/*SMS in-stock default (Oct 21 2026): if a product page opens on a sold-out option, switch to the first in-stock one, keeping the color when possible. Remove this block to undo.*/!function(){try{if(window.__smsStock)return;window.__smsStock=1;var done="";
/*TEST MODE: only runs when the URL contains "instocktest". Remove the next line to turn it on for everyone.*/
if(location.search.indexOf("instocktest")<0)return;

function sl(ms){return new Promise(function(r){setTimeout(r,ms)})}
function grp(g){var sel=g.querySelector("select");if(sel)return{values:[].slice.call(sel.options).filter(function(o){return o.value&&o.value!=="Please choose"}).map(function(o){return o.value}),cur:function(){return sel.value},set:async function(v){sel.value=v;sel.dispatchEvent(new Event("change",{bubbles:true}));await sl(250)}};
var sw=[].slice.call(g.querySelectorAll(".product-details-options__swatches--item"));if(sw.length){var nm=function(it){var t=it.querySelector(".ui-tooltip__text");return t?t.textContent.replace(/:\s*Sold out\s*$/i,"").trim():""};return{values:sw.map(nm),cur:function(){var s=sw.filter(function(it){return it.querySelector(".options-swatches-item__color--selected")})[0];return s?nm(s):null},set:async function(v){var it=sw.filter(function(x){return nm(x)===v})[0];var c=it&&(it.querySelector(".options-swatches-item__color")||it.querySelector("[tabindex]"));if(c)c.click();await sl(250)}}}
var rs=[].slice.call(g.querySelectorAll("input[type=radio]"));if(rs.length)return{values:rs.map(function(r){return r.value}),cur:function(){var c=rs.filter(function(r){return r.checked})[0];return c&&c.value},set:async function(v){var r=g.querySelector('input[type=radio][value="'+CSS.escape(v)+'"]');if(r)r.click();await sl(250)}};return null}
async function pick(){var root,n=0;while(n++<15){root=document.querySelector(".product-details");if(root&&root.querySelector(".details-product-option"))break;await sl(200)}if(!root)return;
var key=location.pathname;if(done===key)return;done=key;
var soldOut=function(){return/\bSOLD OUT\b/.test((root.innerText||"").replace(/Sold out/g,""))};
var G=[].slice.call(root.querySelectorAll(".details-product-option")).map(grp).filter(Boolean);if(!G.length||!soldOut())return;
var start=G.map(function(g){return g.cur()});var lists=G.map(function(g,i){return[start[i]].concat(g.values.filter(function(v){return v!==start[i]})).filter(function(v){return v!=null})});
var combos=lists.reduce(function(acc,l){return[].concat.apply([],acc.map(function(a){return l.map(function(v){return a.concat([v])})}))},[[]]).slice(0,60);
for(var k=0;k<combos.length;k++){var c=combos[k];for(var i=0;i<G.length;i++)if(G[i].cur()!==c[i])await G[i].set(c[i]);await sl(200);if(!soldOut())return}
for(var j=0;j<G.length;j++)if(start[j]!=null)await G[j].set(start[j])}
function run(){try{pick()}catch(e){}}
function hook(){if(window.Ecwid&&Ecwid.OnPageLoaded){Ecwid.OnPageLoaded.add(function(p){if(p&&p.type==="PRODUCT"){done="";setTimeout(run,300)}})}else setTimeout(hook,300)}hook()}catch(e){}}();
