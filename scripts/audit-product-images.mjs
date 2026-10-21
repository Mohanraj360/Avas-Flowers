import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const catalogDir = path.join(root, 'assets', 'catalog');
const outputDir = path.join(root, 'assets', 'product-images');
const manifestPath = path.join(catalogDir, 'image-manifest.json');
const reportPath = path.join(root, 'image-audit-report.json');
const baseUrl = 'https://www.avasflowers.net/';
const maxBytes = 12 * 1024 * 1024;

function slug(value) {
  return String(value || 'product').toLowerCase().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 64) || 'product';
}
function hash(value, length = 12) {
  return createHash('sha256').update(value).digest('hex').slice(0, length);
}
function normalizeUrl(raw, productUrl) {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const url = new URL(raw.trim(), productUrl || baseUrl);
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    url.hash = '';
    return url.href;
  } catch { return null; }
}
function candidates(product) {
  const list = [];
  const add = (raw, label, field) => {
    const value = raw && typeof raw === 'object' ? (raw.url || raw.src || raw.image || raw.imageUrl) : raw;
    const url = normalizeUrl(value, product.url);
    if (url) list.push({ url, label: label || '', field });
  };
  add(product.image, 'primary', 'image');
  if (Array.isArray(product.images)) product.images.forEach((im, i) => add(im, (im && (im.label || im.alt)) || ('image-' + (i + 1)), 'images[' + i + ']'));
  if (Array.isArray(product.gallery)) product.gallery.forEach((im, i) => add(im, (im && im.label) || ('gallery-' + (i + 1)), 'gallery[' + i + ']'));
  if (Array.isArray(product.options)) product.options.forEach((option, i) => {
    add(option.image || option.imageUrl, option.label || ('option-' + (i + 1)), 'options[' + i + ']');
    if (Array.isArray(option.images)) option.images.forEach((im, j) => add(im, (option.label || ('option-' + (i + 1))) + '-' + (j + 1), 'options[' + i + '].images[' + j + ']'));
  });
  const seen = new Set();
  return list.filter(item => !seen.has(item.url) && seen.add(item.url));
}
function imageType(buffer) {
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return { ext: 'png', type: 'image/png' };
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) return { ext: 'jpg', type: 'image/jpeg' };
  if (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) return { ext: 'gif', type: 'image/gif' };
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return { ext: 'webp', type: 'image/webp' };
  if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(buffer.toString('ascii', 8, 16))) return { ext: 'avif', type: 'image/avif' };
  return null;
}
async function fetchImage(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(18000),
    headers: { 'User-Agent': 'AvasFlowersPrototypeImageAudit/1.0', Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' }
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  const type = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (type && !type.startsWith('image/')) throw new Error('non-image content-type: ' + type);
  if (Number(response.headers.get('content-length') || 0) > maxBytes) throw new Error('image exceeds 12 MiB');
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length || buffer.length > maxBytes) throw new Error('empty or oversized image body');
  const detected = imageType(buffer);
  if (!detected) throw new Error('response body is not a supported raster image');
  return { buffer, ext: detected.ext, type: detected.type, finalUrl: response.url || url };
}
async function main() {
  const parts = await Promise.all([0, 1, 2, 3].map(n => readFile(path.join(catalogDir, 'part-0' + n + '.txt'), 'utf8')));
  const catalog = JSON.parse(gunzipSync(Buffer.from(parts.join('').replace(/\s+/g, ''), 'base64')).toString('utf8'));
  const products = Array.isArray(catalog.products) ? catalog.products : [];
  await mkdir(outputDir, { recursive: true });
  const cache = new Map();
  const contentHashes = new Map();
  const hosted = {};
  const rows = [];
  let totalUrls = 0, working = 0, broken = 0, duplicates = 0, unmatched = 0, noImage = 0;
  for (const product of products) {
    const urls = candidates(product);
    totalUrls += urls.length;
    if (!urls.length) noImage++;
    if (product.identityWarning) unmatched++;
    const verified = [];
    for (const item of urls) {
      let result = cache.get(item.url);
      if (!result) {
        try {
          const image = await fetchImage(item.url);
          const digest = hash(image.buffer, 64);
          let localPath = contentHashes.get(digest);
          if (localPath) duplicates++;
          else {
            const filename = slug(product.id || product.name) + '-' + hash(item.url) + '-' + digest.slice(0, 8) + '.' + image.ext;
            localPath = 'assets/product-images/' + filename;
            await writeFile(path.join(root, localPath), image.buffer);
            contentHashes.set(digest, localPath);
          }
          result = { finalUrl: image.finalUrl, localPath, digest, bytes: image.buffer.length, type: image.type };
          cache.set(item.url, result);
        } catch (error) {
          result = { error: String(error && error.message || error) };
          cache.set(item.url, result);
        }
      } else if (result.digest) duplicates++;
      if (result.error) broken++;
      else {
        working++;
        verified.push({ sourceUrl: item.url, finalUrl: result.finalUrl, localPath: result.localPath, label: item.label, field: item.field, contentType: result.type, bytes: result.bytes, sha256: result.digest });
      }
    }
    const canAssociate = !product.identityWarning && Boolean(product.id) && Boolean(product.url);
    if (canAssociate && verified.length) {
      hosted[product.id] = {
        primary: (verified.find(item => item.field === 'image') || verified[0]).localPath,
        variants: verified,
        canonicalProductUrl: product.url,
        productName: product.name,
        identityVerified: true
      };
    }
    rows.push({
      id: product.id || null, name: product.name || null, canonicalProductUrl: product.url || null,
      identityWarning: Boolean(product.identityWarning), imageUrls: urls.map(item => item.url),
      workingImages: verified.length, brokenImages: urls.length - verified.length,
      hosted: Boolean(hosted[product.id]),
      errors: urls.map(item => ({ url: item.url, error: (cache.get(item.url) || {}).error || null })).filter(item => item.error)
    });
  }
  const report = {
    generatedAt: new Date().toISOString(), sourceCatalogCapturedOn: catalog.capturedOn || null,
    totalProducts: products.length, totalImageUrls: totalUrls, workingImageUrls: working,
    brokenImageUrls: broken, duplicateImageContentOrUrls: duplicates, productsWithoutImageUrls: noImage,
    productsWithIdentityWarnings: unmatched, productsWithVerifiedHostedImages: Object.keys(hosted).length,
    hostedImageFiles: [...new Set(Object.values(hosted).flatMap(product => product.variants.map(item => item.localPath)))].length,
    products: rows
  };
  await writeFile(manifestPath, JSON.stringify({ generatedAt: report.generatedAt, products: hosted }, null, 2) + '\n');
  await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({
    totalProducts: report.totalProducts, totalImageUrls: report.totalImageUrls,
    workingImageUrls: report.workingImageUrls, brokenImageUrls: report.brokenImageUrls,
    duplicateImageContentOrUrls: report.duplicateImageContentOrUrls, productsWithoutImageUrls: report.productsWithoutImageUrls,
    productsWithIdentityWarnings: report.productsWithIdentityWarnings,
    productsWithVerifiedHostedImages: report.productsWithVerifiedHostedImages, hostedImageFiles: report.hostedImageFiles
  }, null, 2));
}
main().catch(error => { console.error('Image audit failed:', error); process.exitCode = 1; });
