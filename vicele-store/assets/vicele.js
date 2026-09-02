/* VICELE Store — Phase 2 frontend runtime
   No backend/API secrets are used here. Cart, wishlist and demo admin state use localStorage.
*/
(function () {
  'use strict';
  const CART_KEY = 'vicele_cart_v1';
  const WISH_KEY = 'vicele_wishlist_v1';
  const IMPORT_KEY = 'vicele_imported_products_v1';
  const DRAFT_KEY = 'vicele_product_draft_v1';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const money = n => '$' + Number(n || 0).toFixed(2);
  const slugify = s => String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const read = (k, fallback=[]) => { try { const v=JSON.parse(localStorage.getItem(k)); return v ?? fallback; } catch { return fallback; } };
  const write = (k,v) => localStorage.setItem(k, JSON.stringify(v));

  function toast(message, type='info') {
    let el = $('#vicele-toast');
    if (!el) {
      el = document.createElement('div');
      el.id='vicele-toast';
      el.className='fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] bg-primary text-on-primary px-5 py-3 rounded shadow-xl text-sm tracking-wide transition-all duration-300 opacity-0 translate-y-3 pointer-events-none';
      document.body.appendChild(el);
    }
    el.textContent=message;
    el.classList.remove('opacity-0','translate-y-3');
    clearTimeout(window.__viceleToastTimer);
    window.__viceleToastTimer=setTimeout(()=>el.classList.add('opacity-0','translate-y-3'),2200);
  }

  function cart() { return read(CART_KEY, []); }
  function wishlist() { return read(WISH_KEY, []); }
  function saveCart(v){ write(CART_KEY,v); updateCounters(); }
  function saveWish(v){ write(WISH_KEY,v); updateCounters(); }

  function updateCounters(){
    const c=cart().reduce((n,i)=>n+Number(i.quantity||1),0);
    $$('#cart-count,#cart-counter,#cartCountHeader,#cartDrawerCount').forEach(el=>el.textContent=c);
    $$('.vicele-cart-count').forEach(el=>el.textContent=c);
    $$('#cart-count,#cart-counter').forEach(el=>el.classList.toggle('hidden', c===0));
    // Some Stitch headers display the number inline in their button text.
    $$('#nav-cart-btn').forEach(el=>{ const span=el.querySelector('span:last-child'); if(span) span.textContent=c; });
  }

  function productFromButton(btn){
    const name=btn.dataset.name || btn.closest('[data-name]')?.dataset.name || btn.closest('a')?.querySelector('h3')?.textContent?.trim() || 'VICELE Product';
    const priceText=btn.dataset.price || btn.closest('[data-price]')?.dataset.price || btn.closest('a')?.querySelector('span')?.textContent || '$0';
    const price=parseFloat(String(priceText).replace(/[^0-9.]/g,'')) || 0;
    const image=btn.dataset.image || btn.closest('a,div')?.querySelector('img')?.src || '';
    const id=btn.dataset.productId || slugify(name);
    return {id,name:name.replace(/\s+/g,' ').trim(),price,size:btn.dataset.size||'M',color:btn.dataset.color||'Onyx',image,quantity:1};
  }

  function addToCart(item){
    const c=cart();
    const key=item.id+'::'+(item.size||'M');
    const found=c.find(x=>(x.id+'::'+(x.size||'M'))===key);
    if(found) found.quantity=(Number(found.quantity)||1)+1;
    else c.push({...item,quantity:1});
    saveCart(c); toast(`${item.name} added to cart`); return c;
  }

  function toggleWish(item){
    const w=wishlist(); const i=w.findIndex(x=>x.id===item.id);
    if(i>=0){w.splice(i,1);toast(`${item.name} removed from wishlist`);}
    else {w.push({id:item.id,name:item.name,price:item.price,image:item.image,size:item.size||'M',color:item.color||'Onyx'});toast(`${item.name} added to wishlist`);}
    saveWish(w); return w;
  }

  function openSearch(){
    let modal=$('#vicele-search-modal');
    if(!modal){
      modal=document.createElement('div'); modal.id='vicele-search-modal';
      modal.className='fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 md:p-12';
      modal.innerHTML=`<div class="w-full max-w-2xl bg-white text-black p-6 md:p-8 shadow-2xl"><div class="flex items-center justify-between gap-4 mb-6"><h2 class="text-xl font-bold tracking-widest uppercase">Search VICELE</h2><button type="button" data-close-search class="text-2xl">×</button></div><div class="flex gap-2"><input id="vicele-search-input" autofocus class="flex-1 border border-black px-4 py-3 outline-none" placeholder="Search products..."/><button data-search-submit class="bg-black text-white px-5 py-3 uppercase text-xs tracking-widest">Search</button></div><div id="vicele-search-results" class="mt-6 space-y-2"></div></div>`;
      document.body.appendChild(modal);
    }
    modal.classList.remove('hidden'); setTimeout(()=>$('#vicele-search-input')?.focus(),20);
    renderSearchResults('');
  }
  function renderSearchResults(q){
    const box=$('#vicele-search-results'); if(!box)return;
    const cards=$$('.product-card, [data-product-id]');
    const items=[]; const seen=new Set();
    cards.forEach(card=>{const id=card.dataset.productId; const name=card.dataset.name || card.querySelector('h3')?.textContent?.trim(); if(id&&name&&!seen.has(id)){seen.add(id); const img=card.querySelector('img')?.src||''; const price=card.dataset.price||card.querySelector('span')?.textContent||'';items.push({id,name,image:img,price});}});
    const filtered=items.filter(x=>!q||x.name.toLowerCase().includes(q.toLowerCase()));
    box.innerHTML=filtered.length?filtered.map(x=>`<button class="w-full flex items-center gap-3 border-b py-3 text-left" data-result-id="${x.id}"><img src="${x.image}" class="w-12 h-14 object-cover" alt=""><span class="flex-1 uppercase text-sm">${x.name}</span><span>${x.price}</span></button>`).join(''):'<p class="text-sm opacity-60">No products found.</p>';
  }

  function initGlobalNav(){
    $$('a').forEach(a=>{
      const txt=a.textContent.replace(/\s+/g,' ').trim();
      if(a.getAttribute('href')==='#' && ['Help','About','Legal','Social'].includes(txt)) a.href='/#'+txt.toLowerCase();
    });
    $$('button').forEach(btn=>{
      const txt=btn.textContent.replace(/\s+/g,' ').trim();
      const icon=btn.querySelector('.material-symbols-outlined')?.textContent?.trim()||txt;
      if(icon==='search' || txt==='search') btn.addEventListener('click',e=>{e.preventDefault();openSearch();});
      if(icon==='person' || txt==='person') btn.addEventListener('click',e=>{e.preventDefault();location.href='/account/';});
      if(icon==='shopping_bag' || txt.startsWith('shopping_bag')) btn.addEventListener('click',e=>{e.preventDefault();location.href='/cart/';});
      if(icon==='favorite' && !btn.closest('[data-wishlist-control]')) btn.addEventListener('click',e=>{e.preventDefault();location.href='/account/#wishlist';});
      if(icon==='menu' || txt==='menu') btn.addEventListener('click',e=>{e.preventDefault();toggleMobileMenu(btn);});
    });
  }
  function toggleMobileMenu(btn){
    let menu=$('#vicele-mobile-menu');
    if(!menu){
      menu=document.createElement('div');menu.id='vicele-mobile-menu';menu.className='fixed inset-0 z-[9997] bg-white p-6 overflow-auto';
      menu.innerHTML=`<div class="flex justify-between items-center mb-8"><strong class="text-2xl tracking-widest">VICELE</strong><button data-close-menu class="text-3xl">×</button></div><nav class="flex flex-col gap-5 text-xl uppercase tracking-widest"><a href="/">Home</a><a href="/shop/">Shop</a><a href="/shop/?category=new-arrivals">New Arrivals</a><a href="/shop/?category=gorpcore">Gorpcore</a><a href="/shop/?category=retro-football">Retro Football</a><a href="/shop/?category=urbanwear">Urbanwear</a><a href="/account/">Account</a><a href="/cart/">Cart</a></nav>`;
      document.body.appendChild(menu); menu.addEventListener('click',e=>{if(e.target.matches('[data-close-menu]'))menu.classList.add('hidden');});
    }
    menu.classList.remove('hidden');
  }

  function initProducts(){
    // Home and catalog cards.
    $$('.add-to-cart-btn,.quick-add-btn').forEach(btn=>{
      if(btn.dataset.bound) return; btn.dataset.bound='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();addToCart(productFromButton(btn));});
    });
    $$('.wishlist-btn').forEach(btn=>{
      if(btn.dataset.bound) return; btn.dataset.bound='1'; btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleWish(productFromButton(btn));});
    });
    $$('.product-card').forEach(card=>{
      if(card.dataset.bound) return; card.dataset.bound='1';
      card.addEventListener('click',e=>{if(e.target.closest('button'))return; const id=card.dataset.productId; location.href='/product/?id='+encodeURIComponent(id||'product');});
    });
    // Live-home anchors that wrap product images/details.
    $$('a[href="/product/"]').forEach(a=>{
      if(a.dataset.bound) return;
      const h=a.querySelector('h3'); const btn=a.querySelector('.add-to-cart-btn');
      if(h || btn){a.dataset.bound='1'; const id=slugify(h?.textContent||btn?.dataset.name||'product'); a.href='/product/?id='+encodeURIComponent(id);}
    });
  }

  function initGenericButtons(){
    $$('button').forEach(btn=>{
      if(btn.dataset.genericBound)return; btn.dataset.genericBound='1';
      const t=btn.textContent.replace(/\s+/g,' ').trim();
      if(['XS','S','M','L','XL','XXL'].includes(t) && !btn.classList.contains('size-btn')) btn.addEventListener('click',()=>{btn.parentElement?.querySelectorAll('button').forEach(b=>b.classList.remove('bg-primary','text-on-primary'));btn.classList.add('bg-primary','text-on-primary');toast(`Size filter: ${t}`);});
      if(t==='CLEAR FILTERS') btn.addEventListener('click',()=>{ $$('input').forEach(i=>{if(!i.readOnly)i.value=i.defaultValue||'';});$$('.product-card').forEach(c=>c.classList.remove('hidden'));toast('Filters cleared');});
      if(t==='SAVE CHANGES') btn.addEventListener('click',()=>{write('vicele_account_profile_v1',Object.fromEntries($$('input').filter(i=>i.value).map(i=>[i.placeholder||i.type,i.value])));toast('Changes saved locally');});
      if(t==='UPDATE PASSWORD') btn.addEventListener('click',()=>toast('Password changes will be secured by Supabase Auth in Phase 3/4'));
      if(t.includes('Sign Out')) btn.addEventListener('click',()=>{localStorage.removeItem('vicele_session_v1');toast('Signed out');setTimeout(()=>location.href='/',500);});
      if(t==='NEW') btn.addEventListener('click',()=>toast('New address form ready — persistent addresses arrive with Supabase'));
      if(t==='EDIT') btn.addEventListener('click',()=>toast('Edit mode enabled'));
      if(t==='REMOVE') btn.addEventListener('click',()=>toast('Address removal will be persisted with Supabase'));
      if(t==='View Details') btn.addEventListener('click',()=>toast('Order details loaded in demo mode'));
    });
  }

  function initProductPage(){
    const nameEl=$('#product-name'); if(!nameEl)return;
    const catalog={
      'aero-shell-tech-jacket':{name:'Aero-Shell Tech Jacket',price:385,id:'aero-shell-tech-jacket'},
      'tech-shell-jacket':{name:'Tech Shell Jacket',price:345,id:'tech-shell-jacket'},
      'articulated-cargos':{name:'Articulated Cargos',price:220,id:'articulated-cargos'},
      'monochrome-jersey':{name:'Monochrome Jersey',price:115,id:'monochrome-jersey'},
      'tactical-boot':{name:'Tactical Boot',price:450,id:'tactical-boot'},
      'aegis-shell-jacket':{name:'Aegis Shell Jacket',price:385,id:'aegis-shell-jacket'},
      'structural-hoodie':{name:'Structural Hoodie',price:190,id:'structural-hoodie'},
      'modular-cargo-pant':{name:'Modular Cargo Pant',price:220,id:'modular-cargo-pant'},
      'tech-cargo-pant':{name:'Tech Cargo Pant',price:220,id:'tech-cargo-pant'},
      'heavyweight-box-tee':{name:'Heavyweight Box Tee',price:95,id:'heavyweight-box-tee'},
      'tactical-crossbody':{name:'Tactical Crossbody',price:120,id:'tactical-crossbody'},
      'strata-sneaker':{name:'Strata Sneaker',price:140,id:'strata-sneaker'}
    };
    const id=new URLSearchParams(location.search).get('id')||'aero-shell-tech-jacket'; const p=catalog[id]||catalog['aero-shell-tech-jacket'];
    nameEl.textContent=p.name; nameEl.dataset.productId=p.id;
    const priceEl=$('#product-price'); if(priceEl)priceEl.textContent=money(p.price);
    const sku=$('#product-sku'); if(sku)sku.textContent='VC-'+p.id.toUpperCase().slice(0,10);
    let size='M';
    $$('.size-btn, #size-selector button').forEach(btn=>{if(btn.dataset.bound)return;btn.dataset.bound='1';btn.addEventListener('click',()=>{size=btn.dataset.size||btn.textContent.trim();$$('.size-btn').forEach(b=>b.classList.remove('bg-primary','text-on-primary'));btn.classList.add('bg-primary','text-on-primary');});});
    const add=$('#add-to-cart-btn'); if(add){add.onclick=()=>{const img=$('img[alt="Product Hero Image"]')?.src||$('main img')?.src||'';addToCart({id:p.id,name:p.name,price:p.price,size,color:'Onyx',image:img});};}
    const wish=$('#add-to-wishlist-btn'); if(wish){wish.onclick=()=>{const img=$('img[alt="Product Hero Image"]')?.src||'';const w=toggleWish({id:p.id,name:p.name,price:p.price,image:img,size,color:'Onyx'});updateProductWish(p.id,w);}; updateProductWish(p.id,wishlist());}
    $$('.quick-add-btn,.add-to-cart-btn').forEach(btn=>{if(btn.id==='add-to-cart-btn')return; if(!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();addToCart(productFromButton(btn));});}});
  }
  function updateProductWish(id,w){const icon=$('#wishlist-icon'),text=$('#wishlist-text');if(!icon)return;const on=w.some(x=>x.id===id);icon.textContent=on?'favorite':'favorite_border';if(text)text.textContent=on?'Remove from Wishlist':'Add to Wishlist';}

  function renderCart(){
    const container=$('#orderSummaryItems'); if(!container)return;
    const c=cart(); let subtotal=0,count=0; c.forEach(i=>{subtotal+=Number(i.price)*Number(i.quantity||1);count+=Number(i.quantity||1);});
    const shipping=count?10:0,total=subtotal+shipping;
    const set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v;};
    set('summarySubtotal',money(subtotal));set('summaryShipping',money(shipping));set('summaryTotal',money(total));set('checkoutBtnTotal',total.toFixed(2));set('cartCountHeader',count);set('cartDrawerCount',count);set('drawerSubtotal',money(subtotal));
    container.innerHTML=c.length?c.map((i,idx)=>`<div class="flex gap-4 items-start border-b border-outline-variant pb-5"><div class="w-20 h-24 bg-surface-container-highest flex-shrink-0 overflow-hidden"><img class="w-full h-full object-cover" src="${i.image||''}" alt="${i.name}"></div><div class="flex-1"><div class="font-label-sm uppercase">${i.name}</div><div class="text-xs text-on-surface-variant mt-1">${i.color||'Onyx'} / ${i.size||'M'}</div><div class="flex items-center gap-3 mt-3"><button data-cart-minus="${idx}" class="border px-2">−</button><span>${i.quantity||1}</span><button data-cart-plus="${idx}" class="border px-2">+</button><button data-cart-delete="${idx}" class="ml-auto text-xs uppercase underline">Remove</button></div><div class="font-label-sm mt-3">${money(i.price*Number(i.quantity||1))}</div></div></div>`).join(''):'<div class="py-10 text-center text-on-surface-variant">Your cart is empty.</div>';
    const drawer=$('#cartDrawerItems'); if(drawer){drawer.innerHTML=c.length?c.map((i,idx)=>`<div class="flex gap-4 border-b pb-4"><img src="${i.image||''}" class="w-20 h-24 object-cover" alt="${i.name}"><div class="flex-1"><div class="text-xs uppercase">${i.name}</div><div class="text-xs opacity-60 mt-1">${i.size||'M'}</div><div class="flex gap-2 items-center mt-3"><button data-cart-minus="${idx}" class="border px-2">−</button><span>${i.quantity||1}</span><button data-cart-plus="${idx}" class="border px-2">+</button><button data-cart-delete="${idx}" class="ml-auto">×</button></div></div></div>`).join(''):'<p class="text-on-surface-variant text-center pt-8">Your cart is empty.</p>';}
    updateCounters();
  }
  function initCartPage(){
    if(!$('#orderSummaryItems'))return;
    renderCart();
    document.addEventListener('click',e=>{
      const minus=e.target.closest('[data-cart-minus]'),plus=e.target.closest('[data-cart-plus]'),del=e.target.closest('[data-cart-delete]');
      if(!minus&&!plus&&!del)return; const idx=Number((minus||plus||del).dataset.cartMinus ?? (minus||plus||del).dataset.cartPlus ?? (minus||plus||del).dataset.cartDelete); const c=cart(); if(!c[idx])return;
      if(del)c.splice(idx,1); else if(minus){c[idx].quantity=Math.max(0,Number(c[idx].quantity||1)-1);if(c[idx].quantity===0)c.splice(idx,1);} else c[idx].quantity=Number(c[idx].quantity||1)+1;saveCart(c);renderCart();
    });
    $('#emptyCartBtn')?.addEventListener('click',()=>{saveCart([]);renderCart();toast('Cart emptied');});
    $('#backToShopBtn')?.addEventListener('click',()=>location.href='/shop/');
    $('#drawerCheckoutBtn')?.addEventListener('click',()=>location.href='/cart/');
    $('#openCartBtn')?.addEventListener('click',()=>{const o=$('#cartDrawerOverlay');o?.classList.remove('hidden');});
    $('#closeCartBtn')?.addEventListener('click',()=>$('#cartDrawerOverlay')?.classList.add('hidden'));
    $('#cartBackdrop')?.addEventListener('click',()=>$('#cartDrawerOverlay')?.classList.add('hidden'));
    $('#triggerCheckoutBtn')?.addEventListener('click',()=>{
      const c=cart(); if(!c.length){toast('Add at least one product first');return;}
      const order={id:'DEMO-'+Date.now(),createdAt:new Date().toISOString(),items:c,total:c.reduce((s,i)=>s+Number(i.price)*Number(i.quantity||1),10)};
      const orders=read('vicele_demo_orders_v1',[]);orders.unshift(order);write('vicele_demo_orders_v1',orders);saveCart([]);renderCart();
      const modal=$('#processingModal'); if(modal){modal.classList.remove('hidden');setTimeout(()=>modal.classList.add('hidden'),1800);} toast('Demo order created locally — real checkout comes later');
    });
  }

  function renderWishlist(){
    const box=$('#wishlist-container'); if(!box)return; const empty=$('#empty-wishlist'); const w=wishlist();
    if(!w.length){box.innerHTML='';empty?.classList.remove('hidden');return;} empty?.classList.add('hidden');
    box.innerHTML=w.map((i,idx)=>`<div class="group relative bg-surface-container-lowest border border-outline-variant flex flex-col"><div class="relative aspect-[3/4] overflow-hidden"><img class="w-full h-full object-cover" src="${i.image||''}" alt="${i.name}"><button data-wish-delete="${idx}" class="absolute top-4 right-4 bg-white/80 p-2">×</button></div><div class="p-4"><div class="text-xs uppercase opacity-60">VICELE</div><h3 class="font-bold uppercase mt-1">${i.name}</h3><div class="flex justify-between mt-2"><span>${money(i.price)}</span><button data-wish-cart="${idx}" class="text-xs uppercase underline">Add to Cart</button></div></div></div>`).join('');
  }
  function initAccount(){renderWishlist(); document.addEventListener('click',e=>{const d=e.target.closest('[data-wish-delete]'),a=e.target.closest('[data-wish-cart]');if(!d&&!a)return;const idx=Number((d||a).dataset.wishDelete??(d||a).dataset.wishCart);const w=wishlist();const item=w[idx];if(!item)return;if(d){w.splice(idx,1);saveWish(w);renderWishlist();}else{addToCart(item);}});$$('[data-account-tab]').forEach(btn=>btn.addEventListener('click',()=>showAccountTab(btn.dataset.accountTab)));const hash=location.hash.replace('#','');if(hash==='wishlist')showAccountTab('wishlist');}
  function showAccountTab(tab){$$('[id^="tab-"]').forEach(x=>x.classList.add('hidden'));const t=$('#tab-'+tab);if(t)t.classList.remove('hidden');}

  function initSourcing(){
    const run=$$('button').find(b=>b.textContent.replace(/\s+/g,' ').trim()==='Run Query');
    if(run){run.addEventListener('click',()=>{const input=$('input[placeholder*="waterproof"]');const q=(input?.value||'').trim();$$('[data-source-card]').forEach(card=>card.classList.toggle('hidden',q && !card.textContent.toLowerCase().includes(q.toLowerCase())));toast(q?`Query executed: ${q}`:'Query executed');});}
    const clear=$$('button').find(b=>b.textContent.replace(/\s+/g,' ').trim()==='Clear All'); if(clear)clear.addEventListener('click',()=>{ $$('input').forEach(i=>{if(i.type==='number')i.value=i.defaultValue||'';else if(!i.readOnly)i.value='';});$$('[data-source-card]').forEach(c=>c.classList.remove('hidden'));toast('Filters cleared');});
    $$('button').filter(b=>b.textContent.replace(/\s+/g,' ').trim().includes('Import Product')).forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('[data-source-card]')||btn.closest('article')||btn.parentElement;const product={id:'source-'+Date.now(),name:card?.querySelector('h3')?.textContent?.trim()||'Imported Product',source:'1688 / Weidian / supplier network',importedAt:new Date().toISOString()};const arr=read(IMPORT_KEY,[]);arr.unshift(product);write(IMPORT_KEY,arr);toast(`${product.name} imported to staging`);}));
    $$('button').filter(b=>b.textContent.trim()==='Reject').forEach(btn=>btn.addEventListener('click',()=>{const card=btn.closest('[data-source-card]')||btn.closest('article')||btn.parentElement;card?.classList.add('hidden');toast('Result rejected');}));
    $$('button').filter(b=>b.textContent.trim()==='View Source').forEach(btn=>btn.addEventListener('click',()=>toast('Source links will be connected to the supplier API in Phase 5/7')));
  }

  function initEditor(){
    const inputs=$$('input,textarea,select'); const save=(published=false)=>{const data={};inputs.forEach((el,i)=>{if(el.type==='file')return;data[el.name||el.id||`field_${i}`]=el.value;});write(DRAFT_KEY,data);if(published){const arr=read('vicele_published_products_v1',[]);arr.unshift({...data,publishedAt:new Date().toISOString()});write('vicele_published_products_v1',arr);}toast(published?'Product published locally':'Draft saved locally');};
    $$('button').forEach(b=>{const t=b.textContent.replace(/\s+/g,' ').trim();if(t==='Save Draft')b.addEventListener('click',()=>save(false));if(t==='Publish')b.addEventListener('click',()=>save(true));if(t==='Delete')b.addEventListener('click',()=>{if(confirm('Delete this draft?')){localStorage.removeItem(DRAFT_KEY);toast('Draft deleted');}});if(t.includes('Add Variant'))b.addEventListener('click',()=>toast('Variant row added — connect to database in Phase 4'));});
    const draft=read(DRAFT_KEY,null);if(draft)inputs.forEach((el,i)=>{const k=el.name||el.id||`field_${i}`;if(draft[k]!==undefined&&!el.readOnly)el.value=draft[k];});
  }

  function initSizeGuide(){
    $$('a').filter(a=>a.textContent.replace(/\s+/g,' ').trim()==='Size Guide').forEach(a=>{
      a.addEventListener('click',e=>{e.preventDefault();
        let m=$('#vicele-size-guide');
        if(!m){m=document.createElement('div');m.id='vicele-size-guide';m.className='fixed inset-0 z-[9998] bg-black/60 flex items-center justify-center p-4';m.innerHTML='<div class=\"bg-white text-black max-w-lg w-full p-6 md:p-8 shadow-2xl\"><div class=\"flex justify-between items-center mb-6\"><h2 class=\"text-xl font-bold uppercase tracking-widest\">Size Guide</h2><button data-close-size class=\"text-2xl\">×</button></div><div class=\"grid grid-cols-3 border border-black/10 text-sm\"><div class=\"p-3 font-bold\">Size</div><div class=\"p-3 font-bold\">Chest</div><div class=\"p-3 font-bold\">Length</div><div class=\"p-3 border-t\">S</div><div class=\"p-3 border-t\">56 cm</div><div class=\"p-3 border-t\">68 cm</div><div class=\"p-3 border-t\">M</div><div class=\"p-3 border-t\">59 cm</div><div class=\"p-3 border-t\">70 cm</div><div class=\"p-3 border-t\">L</div><div class=\"p-3 border-t\">62 cm</div><div class=\"p-3 border-t\">72 cm</div><div class=\"p-3 border-t\">XL</div><div class=\"p-3 border-t\">65 cm</div><div class=\"p-3 border-t\">74 cm</div></div><p class=\"text-xs opacity-60 mt-5\">Measurements are approximate. Final size charts will be product-specific once the catalog is connected.</p></div>';document.body.appendChild(m);m.addEventListener('click',ev=>{if(ev.target.matches('[data-close-size]')||ev.target===m)m.remove();});}
        m.classList.remove('hidden');
      });
    });
  }

  function initSearchResults(){const input=$('#vicele-search-input');if(input)input.addEventListener('input',()=>renderSearchResults(input.value));document.addEventListener('click',e=>{if(e.target.closest('[data-close-search]'))$('#vicele-search-modal')?.classList.add('hidden');const r=e.target.closest('[data-result-id]');if(r){$('#vicele-search-modal')?.classList.add('hidden');location.href='/product/?id='+encodeURIComponent(r.dataset.resultId);}});}

  document.addEventListener('DOMContentLoaded',()=>{
    initGlobalNav(); initProducts(); initGenericButtons(); initProductPage(); initCartPage(); initAccount(); initSourcing(); initEditor(); initSizeGuide(); initSearchResults(); updateCounters();
  });
})();
