(()=>{"use strict";var t={n:e=>{var o=e&&e.__esModule?()=>e.default:()=>e;return t.d(o,{a:o}),o},d:(e,o)=>{for(var n in o)t.o(o,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:o[n]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)};const e=browser;var o=t.n(e);const n={async emitContent(t){const e=await o().tabs.query({active:!0,currentWindow:!0});e&&e.length>0&&await o().tabs.sendMessage(e[0].id,t)},emitBackground:t=>chrome.extension.getBackgroundPage().onMessage(t),async emit(t){await o().runtime.sendMessage(t)},on(t){o().runtime.onMessage.addListener(t)}},a={get:async t=>(await o().storage.local.get()||{})[t],async set(t){await o().storage.local.set(t)}};function s(t){const e=document.createElement("textarea");e.value=t,document.body.appendChild(e),e.focus(),e.select(),document.execCommand("copy"),document.body.removeChild(e)}function c(t){let e=t.offsetLeft,o=t.offsetTop,n=t.offsetParent;for(;n;)e+=n.offsetLeft,o+=n.offsetTop,n=n.offsetParent;return{left:e-t.scrollLeft,top:o-t.scrollTop}}const r="tabChange",l="setCurrentContentHost";console.log("content.js");var i=Math.random().toString(36).slice(2);const d={showDataId:async function(){console.log("showDataId");const t=await a.get("data-id")||"data-id";console.log(t);for(let e of[...document.querySelectorAll(`[${t}]`)]){console.log(e.offsetTop,e.offsetLeft),e.style.position="relative",e.style.border="2px solid red";let o=e.getAttribute(t),n=(c(e),document.createElement("div"));n.setAttribute("data-xid",i),n.innerHTML=t+": "+o,n.style.top=0,n.style.left=0,n.style.padding="0 10px",n.style.fontSize="14px",n.style.lineHeight="1.5",n.style.position="absolute",n.style.backgroundColor="#1e80ff",n.style.color="#fff",n.style.opacity="0.6",n.addEventListener("click",(function(e){e.preventDefault(),s(o),n.innerHTML=t+": "+o+" copyed!"})),e.appendChild(n)}},hideDataId:function(){for(let t of[...document.querySelectorAll(`[data-xid='${i}']`)])t.remove()}};n.on((t=>{console.log("message",t);const{action:e,data:o}=t;e==r&&n.emit({action:l,data:{currentContentHost:window.location.hostname}}),d[e](o)})),n.emit({action:l,data:{currentContentHost:window.location.hostname}});$('<button id="cj_but2">向background发送消息</button>')})();