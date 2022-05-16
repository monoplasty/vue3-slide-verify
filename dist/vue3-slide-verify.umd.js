(function(t,h){typeof exports=="object"&&typeof module!="undefined"?module.exports=h(require("vue")):typeof define=="function"&&define.amd?define(["vue"],h):(t=typeof globalThis!="undefined"?globalThis:t||self,t.vue3SlideVerify=h(t.Vue))})(this,function(t){"use strict";const h=Math.PI;function B(e,n){return e+n}function L(e){return e*e}function I(e,n,s,o,r,m){e.beginPath(),e.moveTo(n,s),e.arc(n+o/2,s-r+2,r,.72*h,2.26*h),e.lineTo(n+o,s),e.arc(n+o+r-2,s+o/2,r,1.21*h,2.78*h),e.lineTo(n+o,s+o),e.lineTo(n,s+o),e.arc(n+r-2,s+o/2,r+.4,2.76*h,1.24*h,!0),e.lineTo(n,s),e.lineWidth=2,e.fillStyle="rgba(255, 255, 255, 0.7)",e.strokeStyle="rgba(255, 255, 255, 0.7)",e.stroke(),e[m](),e.globalCompositeOperation="destination-over"}function Y(e,n){const s=document.createElement("img");return s.crossOrigin="Anonymous",s.onload=n,s.onerror=()=>{s.src=k(e)},s.src=k(e),s}function y(e,n){return Math.round(Math.random()*(n-e)+e)}function k(e){const n=e.length;return n>0?e[y(0,n-1)]:"https://picsum.photos/300/150/?image="+y(0,1084)}function F(){const e=t.reactive({x:0,y:0}),n=t.ref(!1),s=t.ref(!1),o=t.ref(0),r=t.ref([]);return{origin:e,success:n,isMouseDown:s,timestamp:o,trail:r,start:l=>{n.value||(l instanceof MouseEvent?(e.x=l.clientX,e.y=l.clientY):(e.x=l.changedTouches[0].pageX,e.y=l.changedTouches[0].pageY),s.value=!0,o.value=Date.now())},move:(l,u,a)=>{if(!s.value)return!1;let i=0,f=0;if(u instanceof MouseEvent?(i=u.clientX-e.x,f=u.clientY-e.y):(i=u.changedTouches[0].pageX-e.x,f=u.changedTouches[0].pageY-e.y),i<0||i+38>=l)return!1;a(i),r.value.push(f)},end:(l,u)=>{if(!s.value||(s.value=!1,(l instanceof MouseEvent?l.clientX:l.changedTouches[0].pageX)===e.x))return!1;o.value=Date.now()-o.value,u(o.value)},verify:(l,u,a)=>{const i=r.value,f=i.reduce(B)/i.length,w=i.map(p=>p-f),E=Math.sqrt(w.map(L).reduce(B)/i.length),C=parseInt(l);return a=a<=1?1:a>10?10:a,{spliced:Math.abs(C-u)<=a,TuringTest:f!==E}}}}var ee="",R=(e,n)=>{const s=e.__vccOpts||e;for(const[o,r]of n)s[o]=r;return s};const $=t.defineComponent({name:"SlideVerify",props:{l:{type:Number,default:42},r:{type:Number,default:10},w:{type:Number,default:310},h:{type:Number,default:155},sliderText:{type:String,default:"Slide filled right"},accuracy:{type:Number,default:5},show:{type:Boolean,default:!0},imgs:{type:Array,default:()=>[]}},emits:["success","again","fail","refresh"],setup(e,{emit:n}){const{imgs:s,l:o,r,w:m,h:d,accuracy:T}=e,b=t.ref(!0),l=t.ref(0),u=t.ref(0),a=t.reactive({containerActive:!1,containerSuccess:!1,containerFail:!1}),i=t.reactive({iconCls:"arrow-right",width:"0",left:"0"}),f=t.ref(),w=t.ref(),E=t.ref(),C=t.ref();let p;const{success:N,start:D,move:G,end:H,verify:J}=F(),X=()=>{var c,v;N.value=!1,a.containerActive=!1,a.containerSuccess=!1,a.containerFail=!1,i.iconCls="arrow-right",i.left="0",i.width="0",f.value.style.left="0",(c=C.value)==null||c.clearRect(0,0,m,d),(v=w.value)==null||v.clearRect(0,0,m,d),f.value.width=m,p.src=k(s)},K=()=>{X(),n("refresh")};function Q(c){i.left=c+"px";let v=(m-40-20)/(m-40)*c;f.value.style.left=v+"px",a.containerActive=!0,i.width=c+"px"}function Z(c){const{spliced:v,TuringTest:S}=J(f.value.style.left,l.value,T);if(v){if(T===-1){a.containerSuccess=!0,i.iconCls="success",N.value=!0,n("success",c);return}S?(a.containerSuccess=!0,i.iconCls="success",N.value=!0,n("success",c)):(a.containerFail=!0,i.iconCls="fail",n("again"))}else a.containerFail=!0,i.iconCls="fail",n("fail"),setTimeout(()=>{X()},1e3)}const V=c=>{G(m,c,Q)},M=c=>{H(c,Z)};return t.onMounted(()=>{var S,A;const c=(S=E.value)==null?void 0:S.getContext("2d"),v=(A=f.value)==null?void 0:A.getContext("2d");C.value=c,w.value=v,p=Y(s,()=>{b.value=!1;const g=o+r*2+3;if(l.value=y(g+10,m-(g+10)),u.value=y(10+r*2,d-(g+10)),c&&v){I(c,l.value,u.value,o,r,"fill"),I(v,l.value,u.value,o,r,"clip"),c.drawImage(p,0,0,m,d),v.drawImage(p,0,0,m,d);const z=u.value-r*2-1,x=v.getImageData(l.value,z,g,g);f.value.width=g,v.putImageData(x,0,z)}}),document.addEventListener("mousemove",V),document.addEventListener("mouseup",M)}),t.onBeforeUnmount(()=>{document.removeEventListener("mousemove",V),document.removeEventListener("mouseup",M)}),{block:f,canvas:E,loadBlock:b,containerCls:a,sliderBox:i,refresh:K,sliderDown:D,touchStartEvent:D,touchMoveEvent:V,touchEndEvent:M}}}),q=e=>(t.pushScopeId("data-v-2f9639f2"),e=e(),t.popScopeId(),e),O=["width","height"],P=[q(()=>t.createElementVNode("i",{class:"iconfont icon-refresh"},null,-1))],_=["width","height"],j={class:"slide-verify-slider-text"};function U(e,n,s,o,r,m){return t.openBlock(),t.createElementBlock("div",{id:"slideVerify",class:"slide-verify",style:t.normalizeStyle({width:e.w+"px"}),onselectstart:"return false;"},[t.createElementVNode("div",{class:t.normalizeClass({"slider-verify-loading":e.loadBlock})},null,2),t.createElementVNode("canvas",{ref:"canvas",width:e.w,height:e.h},null,8,O),e.show?(t.openBlock(),t.createElementBlock("div",{key:0,class:"slide-verify-refresh-icon",onClick:n[0]||(n[0]=(...d)=>e.refresh&&e.refresh(...d))},P)):t.createCommentVNode("",!0),t.createElementVNode("canvas",{ref:"block",width:e.w,height:e.h,class:"slide-verify-block"},null,8,_),t.createElementVNode("div",{class:t.normalizeClass(["slide-verify-slider",{"container-active":e.containerCls.containerActive,"container-success":e.containerCls.containerSuccess,"container-fail":e.containerCls.containerFail}])},[t.createElementVNode("div",{class:"slide-verify-slider-mask",style:t.normalizeStyle({width:e.sliderBox.width})},[t.createElementVNode("div",{class:"slide-verify-slider-mask-item",style:t.normalizeStyle({left:e.sliderBox.left}),onMousedown:n[1]||(n[1]=(...d)=>e.sliderDown&&e.sliderDown(...d)),onTouchstart:n[2]||(n[2]=(...d)=>e.touchStartEvent&&e.touchStartEvent(...d)),onTouchmove:n[3]||(n[3]=(...d)=>e.touchMoveEvent&&e.touchMoveEvent(...d)),onTouchend:n[4]||(n[4]=(...d)=>e.touchEndEvent&&e.touchEndEvent(...d))},[t.createElementVNode("i",{class:t.normalizeClass(["slide-verify-slider-mask-item-icon","iconfont",`icon-${e.sliderBox.iconCls}`])},null,2)],36)],4),t.createElementVNode("span",j,t.toDisplayString(e.sliderText),1)],2)],4)}var W=R($,[["render",U],["__scopeId","data-v-2f9639f2"]]);return W});
