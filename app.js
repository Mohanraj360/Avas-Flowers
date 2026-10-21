'use strict';
const products = [
 {name:"Sweetest Surprise Pastel Bouquet",price:39.99,was:44.99,reviews:24,group:"bouquet",slug:"sweet-surprises-pastel-bouquet",image:"assets/image5.png",label:"SOFT & THOUGHTFUL"},
 {name:"Sunshine Celebration Bouquet",price:39.99,was:47.99,reviews:71,group:"bouquet",slug:"sunshine-celebration-bouquet",image:"assets/image6.png",label:"A LITTLE SUNSHINE"},
 {name:"She's Got Style, She's Got Grace",price:39.99,was:49.99,reviews:119,group:"bouquet",slug:"shes-got-style-shes-got-grace",image:"assets/image7.png",label:"CUSTOMER FAVOURITE"},
 {name:"Sunflower Bouquet",price:44.99,reviews:19,group:"bouquet",slug:"sunflower-bouquet",image:"assets/image8.png",label:"BRIGHT & JOYFUL"},
 {name:"One Dozen Red Roses",price:59.99,was:69.99,reviews:133,group:"roses",slug:"dozen-long-stemmed-roses",image:"assets/image9.png",label:"TIMELESS ROMANCE"},
 {name:"My Sun, Moon and Stars",price:39.99,was:49.99,reviews:132,group:"bouquet",slug:"my-sun-and-moon-and-stars-bouquet",image:"assets/image10.png",label:"A LITTLE MAGIC"},
 {name:"Dreaming of Tuscany",price:39.99,was:47.99,reviews:96,group:"bouquet",slug:"dreaming-of-tuscany",image:"assets/image11.png",label:"WARM & ELEGANT"},
 {name:"Floral Harmony Bouquet",price:39.99,was:49.99,reviews:262,group:"bouquet",slug:"rose-and-carnation-mixed-bouquet",image:"assets/image12.png",label:"MOST LOVED"},
 {name:"Birthday Indulgence",price:44.99,was:54.99,reviews:106,group:"bouquet",slug:"birthday-indulgence",image:"assets/image13.png",label:"CELEBRATE MORE"},
 {name:"Dozen Assorted Roses",price:59.99,was:69.99,reviews:28,group:"roses",slug:"dozen-assorted-roses",image:"assets/image14.png",label:"COLOURFUL CLASSIC"},
 {name:"Peace Lily Plant",price:44.99,was:54.99,reviews:126,group:"plants",slug:"peace-lily-plant",image:"assets/image15.png",label:"CALM & CONSIDERED"},
 {name:"Orchid Planter",price:64.99,was:72.99,reviews:25,group:"plants",slug:"orchid-planter",image:"assets/image16.png",label:"MODERN ELEGANCE"}
];
const grid=document.querySelector('#product-grid');
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
let active='all', query='';
function render(){
 const list=products.filter(p=>(active==='all'||p.group===active)&&p.name.toLowerCase().includes(query));
 document.querySelector('#result-count').textContent=list.length+' arrangement'+(list.length===1?'':'s');
 grid.innerHTML=list.length?list.map((p,i)=>`<article class="product-card"><a class="product-image" href="https://www.avasflowers.net/product/${p.slug}" target="_blank" rel="noopener" aria-label="View ${p.name} on Ava's Flowers"><span class="product-tag">${p.label}</span><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.closest('.product-image').classList.add('image-fallback');this.remove()"><span class="quick-view">View arrangement ↗</span></a><div class="product-info"><div class="product-rating"><span aria-label="5 out of 5 stars">★★★★★</span><small>(${p.reviews})</small></div><h3><a href="https://www.avasflowers.net/product/${p.slug}" target="_blank" rel="noopener">${p.name}</a></h3><div class="product-price">${p.was?'<del>'+money(p.was)+'</del>':''}<strong>From ${money(p.price)}</strong></div><a class="product-link" href="https://www.avasflowers.net/product/${p.slug}" target="_blank" rel="noopener">View product <span>↗</span></a></div></article>`).join(''):'<p class="no-results">No arrangements match that search. Try another name or category.</p>';
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));render()}));
document.querySelector('#search').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();render();if(query)document.querySelector('#collection').scrollIntoView({behavior:'smooth',block:'start'})});
const menu=document.querySelector('#menu-toggle');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#main-nav').classList.toggle('nav-open',open)});
document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');document.querySelector('#main-nav').classList.remove('nav-open')}));
render();