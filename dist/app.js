/* Product data is a curated snapshot, not a live inventory or checkout. */
const products = window.PRODUCTS || [];
const notes = window.NOTES || [];
const categories = [
  ['all', '全部好物', 'layout-grid'], ['makeup', '彩妆', 'palette'],
  ['skincare', '补水保湿', 'droplets'], ['sunscreen', '日常防晒', 'sun'],
  ['cleansing', '洁面与卸妆', 'sparkles'],
  ['masks', '面膜与棉片', 'layers'], ['lips', '唇部护理', 'heart'],
  ['hairbody', '洗护与身体', 'bath'], ['tools', '美妆工具', 'brush']
];
const state = {purpose:'all', category:'all', skin:'all', limit:0, query:'', sort:'recommended'};
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = value => `₩${Number(value).toLocaleString('en-US')}`;
const icon = name => `<i data-lucide="${name}"></i>`;
const paintIcons = () => window.lucide?.createIcons();
const productById = id => products.find(p => p.id === id);
let list = [];
let persistenceAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem('seoul-edit-list-v1') || '[]');
  if (Array.isArray(saved)) {
    const seen = new Set();
    list = saved.filter(item => item && productById(item.id) && !seen.has(item.id) && seen.add(item.id)).map(item => ({id:item.id, quantity:Math.min(99,Math.max(1,Math.trunc(Number(item.quantity)) || 1)), purchased:!!item.purchased, recipient:item.recipient === 'gift' ? 'gift' : 'self'}));
  }
} catch { persistenceAvailable = false; }

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('visible');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('visible'), 2400);
}
function saveList() {
  try { localStorage.setItem('seoul-edit-list-v1', JSON.stringify(list)); }
  catch { persistenceAvailable = false; toast('浏览器未允许保存，离开前请导出清单'); }
  updateListCount();
}
function updateListCount() {
  const total = list.reduce((sum, item) => sum + item.quantity, 0);
  $('#list-count').textContent = total;
  $('#drawer-count').textContent = total ? `${total} 件` : '';
  $('#open-list').setAttribute('aria-label', `我的购物清单，${total}件`);
  $$('.add-button').forEach(button => {
    const added = list.some(item => item.id === button.dataset.add);
    button.classList.toggle('added', added);
    button.innerHTML = icon(added ? 'check' : 'plus');
    button.setAttribute('aria-label', `${added ? '查看清单中的' : '加入清单：'}${productById(button.dataset.add).name}`);
    button.title = added ? '已加入，查看清单' : '加入清单';
  });
  paintIcons();
}
function addItem(id, recipient = state.purpose === 'gift' ? 'gift' : 'self') {
  if (!productById(id)) return;
  if (list.some(item => item.id === id)) { openList(); return; }
  list.push({id, quantity:1, purchased:false, recipient});
  saveList();
  toast('已加入购物清单');
}
function renderCategories() {
  $('#category-filters').innerHTML = categories.map(([id,label,symbol]) => `<button class="category ${id === state.category ? 'active' : ''}" data-category="${id}" aria-pressed="${id === state.category}">${icon(symbol)}${label}<span>${products.filter(p => id === 'all' || p.category === id).length}</span></button>`).join('');
}
function filteredProducts() {
  const query = state.query.trim().toLocaleLowerCase();
  const result = products.filter(p =>
    (state.purpose === 'all' || p.purposes.includes(state.purpose)) &&
    (state.category === 'all' || p.category === state.category) &&
    (state.skin === 'all' || p.skin.includes(state.skin)) &&
    (!state.limit || p.budget <= state.limit) &&
    (!query || [p.brand,p.name,p.ko,p.reason,...p.tags].join(' ').toLocaleLowerCase().includes(query))
  );
  if (state.sort === 'low') result.sort((a,b) => a.budget-b.budget);
  if (state.sort === 'high') result.sort((a,b) => b.budget-a.budget);
  return result;
}
function productCard(p) {
  return `<article class="product-card"><button class="product-visual" data-detail="${p.id}" aria-label="查看${escapeHTML(p.name)}详情"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.brand+' '+p.name+' 商品包装')}" loading="lazy" width="320" height="320"><span class="product-label ${p.purposes.includes('gift') ? 'gift' : ''}">${escapeHTML(p.label)}</span></button><div class="product-info"><p class="brand-name">${escapeHTML(p.brand)}</p><button class="product-title" data-detail="${p.id}">${escapeHTML(p.name)}</button><p class="product-size">${escapeHTML(p.size)}</p><p class="product-reason">${escapeHTML(p.reason)}</p><div class="tags">${p.tags.slice(0,2).map((tag,index) => `<span class="tag ${index === 1 && p.purposes.includes('gift') ? 'pink' : ''}">${escapeHTML(tag)}</span>`).join('')}</div><div class="product-bottom"><div class="product-price"><small>计划预算</small>${money(p.budget)}</div><button class="add-button" data-add="${p.id}" title="加入清单" aria-label="加入清单：${escapeHTML(p.name)}">${icon('plus')}</button></div></div></article>`;
}
function renderProducts() {
  const result = filteredProducts();
  $('#product-grid').innerHTML = result.map(productCard).join('');
  $('#result-count').textContent = result.length;
  $('#total-count').textContent = products.length;
  $('#empty-results').hidden = !!result.length;
  $('#product-grid').hidden = !result.length;
  $('#filter-summary').textContent = state.purpose === 'gift' ? '先想想对方的使用习惯' : state.purpose === 'self' ? '按你的日常需要来挑' : '从日常需要出发';
  renderCategories();
  updateListCount();
}
function resetFilters() {
  Object.assign(state,{purpose:'all',category:'all',skin:'all',limit:0,query:'',sort:'recommended'});
  $('#search').value = ''; $('#skin').value = 'all'; $('#price-limit').value = '0'; $('#sort').value = 'recommended';
  syncPurpose(); renderProducts();
}
function syncPurpose() {
  $$('[data-purpose]').forEach(button => { const active = button.dataset.purpose === state.purpose; button.classList.toggle('selected',active); button.setAttribute('aria-pressed',active); });
}
function setView() {
  const requested = location.hash.slice(1);
  const view = ['products','gifts','routine','notes','guide'].includes(requested) ? requested : 'products';
  $$('.view').forEach(section => section.hidden = section.id !== `${view}-view`);
  $$('.main-nav a').forEach(link => { const active = link.dataset.view === view; link.classList.toggle('active',active); if(active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current'); });
}
function showDialog(dialog) {
  if (dialog.open) return;
  $$('dialog[open]').forEach(other => other.close());
  dialog.showModal();
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('已复制'); }
  catch {
    const field = document.createElement('textarea');
    field.value = text; field.style.position = 'fixed'; field.style.opacity = '0';
    const container = $('dialog[open]') || document.body;
    container.append(field); field.select();
    const copied = document.execCommand('copy'); field.remove();
    toast(copied ? '已复制' : '复制未成功，可长按韩文选中复制');
  }
}
function showProduct(id) {
  const p = productById(id);
  if (!p) return;
  const note = notes.find(n => n.id === p.noteId);
  $('#product-detail').innerHTML = `<div class="detail-top"><div class="detail-image"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.brand+' '+p.name)}"></div><div class="detail-main"><p class="brand-name">${escapeHTML(p.brand)}</p><h2>${escapeHTML(p.name)}</h2><div class="korean-name"><span lang="ko">${escapeHTML(p.ko)}</span><button class="icon-button copy-phrase" data-text="${escapeHTML(p.ko)}" aria-label="复制商品韩文名" title="复制韩文名">${icon('copy')}</button></div><p>${escapeHTML(p.reason)}</p><p class="product-size">${escapeHTML(p.size)}</p><div class="product-price"><small>计划预算，非实时售价</small>${money(p.budget)}</div><button class="primary-button" data-detail-add="${p.id}">${icon(list.some(item => item.id === id) ? 'check' : 'plus')}${list.some(item => item.id === id) ? '已加入，查看清单' : '加入购物清单'}</button></div></div><div class="detail-facts"><div><h3>适合考虑</h3><p>${escapeHTML(p.suitable)}</p></div><div><h3>买前留意</h3><p>${escapeHTML(p.caution)}</p></div><div><h3>送礼判断</h3><p>${escapeHTML(p.giftAdvice)}</p></div><div><h3>预算与版本</h3><p>${escapeHTML(p.priceNote)}</p></div></div><div class="detail-sources"><a href="${escapeHTML(p.source)}" target="_blank" rel="noopener noreferrer">官方商品页 ${icon('arrow-up-right')}</a>${note ? `<a href="${escapeHTML(note.url)}" target="_blank" rel="noopener noreferrer">相关小红书笔记 ${icon('arrow-up-right')}</a>` : ''}${p.evidenceUrl ? `<a href="${escapeHTML(p.evidenceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(p.evidenceLabel || '韩国销售榜资料')} ${icon('arrow-up-right')}</a>` : ''}<p>${note ? '笔记用于同品牌 / 系列发现；不代表作者测评了本页这一规格。' : '编辑补充选品：以官方商品页为产品来源。'}${p.evidence ? ` ${escapeHTML(p.evidence)}` : ''} 商品图来自官方页面。核对日期：2026.11.17。</p></div>`;
  $('.detail-sources').insertAdjacentHTML('afterbegin', `<p class="image-note">图片说明：${escapeHTML(p.imageNote)}</p>`);
  $('.detail-sources').innerHTML = $('.detail-sources').innerHTML.replace('核对日期：2026.11.17。', `核对日期：${escapeHTML((p.checkedDate || '2026-11-17').replaceAll('-', '.'))}。`);
  paintIcons();
  showDialog($('#product-dialog'));
}
function renderList() {
  $('#list-items').innerHTML = list.length ? list.map(item => {
    const p = productById(item.id);
    return `<article class="list-item ${item.purchased ? 'purchased' : ''}" data-item="${item.id}"><img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}"><div><div class="list-item-heading"><h3>${escapeHTML(p.name)}</h3><button class="icon-button" data-remove="${item.id}" aria-label="移除${escapeHTML(p.name)}" title="移出清单">${icon('x')}</button></div><p class="list-korean" lang="ko">${escapeHTML(p.ko)}</p><div class="list-item-bottom"><span class="list-item-price">${money(p.budget*item.quantity)}</span><div class="stepper"><button data-quantity="${item.id}" data-delta="-1" aria-label="减少${escapeHTML(p.name)}数量" ${item.quantity===1?'disabled':''}>${icon('minus')}</button><span>${item.quantity}</span><button data-quantity="${item.id}" data-delta="1" aria-label="增加${escapeHTML(p.name)}数量" ${item.quantity===99?'disabled':''}>${icon('plus')}</button></div></div><div class="list-item-meta"><label><input type="checkbox" data-purchased="${item.id}" ${item.purchased?'checked':''}>已买到</label><select data-recipient="${item.id}" aria-label="${escapeHTML(p.name)}送给谁"><option value="self" ${item.recipient==='self'?'selected':''}>给自己</option><option value="gift" ${item.recipient==='gift'?'selected':''}>送心意</option></select></div></div></article>`;
  }).join('') : `<div class="list-empty">${icon('shopping-bag')}<h3>装一点喜欢的进去。</h3><p>先从日常保湿，或一份小礼物开始。</p><button class="primary-button" id="back-to-products">去挑选好物</button></div>`;
  const total = list.reduce((sum,item) => sum + productById(item.id).budget*item.quantity,0);
  const purchased = list.filter(item => item.purchased).reduce((sum,item)=>sum+item.quantity,0);
  $('#list-summary').hidden = !list.length;
  $('#list-summary').innerHTML = `<div class="list-total"><span>合计计划预算</span><strong>${money(total)}</strong></div><p class="budget-note">已买到 ${purchased} 件。合计包含已买商品，未计门店优惠、退税及额外费用。${persistenceAvailable ? '清单仅保存在当前浏览器。' : '当前浏览器无法保存，请导出备份。'}</p><div class="list-actions"><button class="secondary-button" id="export-list">${icon('download')}导出清单</button><button class="primary-button" id="print-list">${icon('printer')}打印 / PDF</button></div>`;
  updateListCount();
}
function openList() { renderList(); showDialog($('#list-dialog')); }
function renderGifts() {
  const bundles = window.BUNDLES || [];
  $('#gift-bundles').innerHTML = bundles.map(bundle => {
    const items = bundle.ids.map(productById).filter(Boolean);
    return `<article class="bundle"><div class="bundle-images">${items.map(p => `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy">`).join('')}</div><div class="bundle-body"><span class="eyebrow">${escapeHTML(bundle.for)}</span><h3>${escapeHTML(bundle.title)}</h3><p>${escapeHTML(bundle.description)}</p><div class="bundle-products">${items.map(p=>escapeHTML(p.brand+' '+p.name)).join('<br>')}</div><div class="bundle-price"><span>组合计划预算</span><strong>${money(items.reduce((sum,p)=>sum+p.budget,0))}</strong></div><button class="primary-button" data-bundle="${bundle.id}">${icon('plus')}加入这份心意</button></div></article>`;
  }).join('');
}
function renderNotes() {
  $('#note-list').innerHTML = notes.map(note => `<article class="note-row"><div class="note-author">${escapeHTML(note.author)}<small>${escapeHTML(note.date)}</small></div><div class="note-body"><h3>${escapeHTML(note.title)}</h3><p>${escapeHTML(note.summary)}</p><p class="editor-note">选物判断：${escapeHTML(note.takeaway)}</p></div><a href="${escapeHTML(note.url)}" class="note-link" target="_blank" rel="noopener noreferrer">查看原笔记 ${icon('arrow-up-right')}</a></article>`).join('');
}
function renderRoutine() {
  const picks = (window.PICKS || []).map(pick => ({pick, product:productById(pick.id)})).filter(item => item.product);
  $('#routine-count').textContent = `${picks.length} 件 · 参考价核对至 2026.11.18`;
  $('#routine-total').textContent = money(picks.reduce((sum,item) => sum + item.product.budget,0));
  $('#routine-grid').innerHTML = picks.map(({pick,product}) => `<article class="routine-card"><button class="routine-visual" data-detail="${product.id}" aria-label="查看${escapeHTML(product.name)}详情"><img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.brand+' '+product.name+' 商品包装')}" loading="lazy" width="320" height="320"><span>${escapeHTML(pick.category)}</span></button><div class="routine-body"><p class="brand-name">${escapeHTML(product.brand)}</p><button class="product-title" data-detail="${product.id}">${escapeHTML(product.name)}</button><p class="product-size">${escapeHTML(product.size)}</p><p class="routine-reason">${escapeHTML(pick.note)}</p><div class="routine-bottom"><div class="product-price"><small>计划预算</small>${money(product.budget)}</div><button class="add-button" data-add="${product.id}" title="加入购物清单" aria-label="加入清单：${escapeHTML(product.name)}">${icon('plus')}</button></div></div></article>`).join('');
  updateListCount();
}
function exportList() {
  const lines = ['首尔选物 | Olive Young 购物清单','各商品核对日期见商品详情；以下为计划预算，不是实时门店价。',''];
  list.forEach(item => { const p = productById(item.id); lines.push(`${item.purchased?'[已买]':'[待买]'} ${p.brand} ${p.name} × ${item.quantity}`,`韩文：${p.ko}`,`规格：${p.size}`,`用途：${item.recipient==='gift'?'送心意':'给自己'} | 计划预算：${money(p.budget*item.quantity)}`,`官方：${p.source}`,''); });
  lines.push(`合计计划预算：${money(list.reduce((sum,item)=>sum+productById(item.id).budget*item.quantity,0))}`);
  const url = URL.createObjectURL(new Blob(['\uFEFF'+lines.join('\n')],{type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href=url; link.download='Olive-Young-shopping-list.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('购物清单已导出');
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.purpose) { state.purpose = button.dataset.purpose; syncPurpose(); renderProducts(); }
  if (button.dataset.category) { state.category = button.dataset.category; renderProducts(); }
  if (button.dataset.add) addItem(button.dataset.add);
  if (button.dataset.detail) showProduct(button.dataset.detail);
  if (button.dataset.detailAdd) { const id = button.dataset.detailAdd; if (list.some(item=>item.id===id)) openList(); else { addItem(id); showProduct(id); } }
  if (button.classList.contains('dialog-close')) button.closest('dialog').close();
  if (button.classList.contains('copy-phrase')) copyText(button.dataset.text);
  if (button.dataset.remove) { list = list.filter(item=>item.id!==button.dataset.remove); saveList(); renderList(); }
  if (button.dataset.quantity) { const item = list.find(item=>item.id===button.dataset.quantity); if(item){item.quantity = Math.min(99,Math.max(1,item.quantity+Number(button.dataset.delta))); saveList(); renderList();} }
  if (button.dataset.bundle) {
    const bundle = window.BUNDLES.find(b=>b.id===button.dataset.bundle);
    let added = 0;
    bundle.ids.forEach(id => {if(productById(id) && !list.some(item=>item.id===id)){list.push({id,quantity:1,purchased:false,recipient:'gift'});added++;}});
    saveList(); toast(added ? `已加入 ${added} 款礼物` : '这些好物已经在清单里');
  }
  if (['reset-filters','empty-reset'].includes(button.id)) resetFilters();
  if (button.id==='open-list') openList();
  if (button.id==='add-all-picks') {
    const before = list.length;
    (window.PICKS || []).forEach(pick => { if(productById(pick.id) && !list.some(item=>item.id===pick.id)) list.push({id:pick.id,quantity:1,purchased:false,recipient:'self'}); });
    const added = list.length - before;
    saveList();
    toast(added ? `已加入 ${added} 件商品` : '这套推荐已在清单中');
  }
  if (button.id==='back-to-products') {$('#list-dialog').close();location.hash='products';}
  if (button.id==='export-list') exportList();
  if (button.id==='print-list') window.print();
});
document.addEventListener('change', event => {
  const input = event.target;
  if(input.id==='skin') {state.skin=input.value;renderProducts();}
  if(input.id==='price-limit') {state.limit=Number(input.value);renderProducts();}
  if(input.id==='sort') {state.sort=input.value;renderProducts();}
  if(input.dataset.purchased) {const item=list.find(item=>item.id===input.dataset.purchased);item.purchased=input.checked;saveList();renderList();}
  if(input.dataset.recipient) {const item=list.find(item=>item.id===input.dataset.recipient);item.recipient=input.value;saveList();}
});
$('#search').addEventListener('input', event => {state.query=event.target.value;renderProducts();});
window.addEventListener('hashchange', setView);
document.addEventListener('keydown',event=>{if(event.key==='/' && !event.ctrlKey && !event.metaKey && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName) && !$('dialog[open]')){event.preventDefault();location.hash='products';$('#search').focus();}});
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => { if(event.target===dialog) {const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();} }));
document.addEventListener('error',event=>{if(event.target.tagName==='IMG'){const fallback=document.createElement('span');fallback.className='image-fallback';fallback.textContent='商品图片暂不可用';event.target.replaceWith(fallback);}},true);
renderProducts(); renderGifts(); renderNotes(); renderRoutine(); setView(); paintIcons();
