(function(){var e={8440:function(){},886:function(e,t,n){"use strict";function o(e){if(!e)return null;10===e.toString().length&&(e*=1e3);let t=new Date(parseInt(e));const n={year:t.getFullYear().toString(),month:[t.getMonth()+1].toString(),day:t.getDate().toString(),hour:t.getHours().toString(),minutes:t.getMinutes().toString(),seconds:t.getSeconds().toString()};return`${n.year}-${1===n.month.length?n.month.padStart(2,"0"):n.month}-${1===n.day.length?n.day.padStart(2,"0"):n.day} ${1===n.hour.length?n.hour.padStart(2,"0"):n.hour}:${1===n.minutes.length?n.minutes.padStart(2,"0"):n.minutes}:${1===n.seconds.length?n.seconds.padStart(2,"0"):n.seconds}`}n.r(t),n.d(t,{transformTime:function(){return o}})},7820:function(e,t,n){"use strict";var o=function(){var e=this,t=e._self._c;e._self._setupProxy;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},r=[],i=n(8440),u=n.n(i),a=u(),s=n(1001),c=(0,s.Z)(a,o,r,!1,null,null,null),l=c.exports,d=n(886),f=n(2140),h=n.n(f),p=n(311),m=n.n(p),g=n(2631),v=n(3822);m().use(v.ZP);var y=new v.ZP.Store({state:{userId:"",menuRouterList:[]},getters:{getMenuRouter(e){return e.menuRouterList}},mutations:{setUserId(e,t){e.userId=t,window.sessionStorage.setItem("userid",t)},getUserId(e){e.userId=window.sessionStorage.getItem("userid")},setRouter(e,t){e.menuRouterList=t,window.sessionStorage.setItem("routerList",JSON.stringify(t))},getMenuRouterList(e){e.menuRouterList=JSON.parse(window.sessionStorage.getItem("routerList"))}},actions:{},modules:{}}),b=n(4806),w=n.n(b);m().use(g.Z);const S=g.Z.prototype.push;g.Z.prototype.push=function(e){return S.call(this,e).catch((e=>e))};const k=[{path:"/",redirect:"/login"},{path:"/login",name:"login",meta:{index:0},component:()=>Promise.all([n.e(732),n.e(535)]).then(n.bind(n,2732))},{path:"/home",name:"home",meta:{index:0},redirect:"/dashboardover",component:()=>Promise.all([n.e(626),n.e(177)]).then(n.bind(n,7626))},{path:"/404",name:"404",component:()=>Promise.all([n.e(626),n.e(177)]).then(n.bind(n,5604))}],x=new g.Z({routes:k}),O=e=>{const t=[];return e&&e.forEach((e=>{if(e.childs)if("Layout"!==e.component){let o={path:e.path,name:e.path.split("/")[1],meta:{id:e.id},component:t=>Promise.all([n.e(626),n.e(732),n.e(454)]).then(function(){var o=[n(9305)(`./${e.component}.vue`)];t.apply(null,o)}.bind(this))["catch"](n.oe)};t.push(o)}else e.childs.forEach((e=>{let o={path:e.path,name:e.path.split("/")[1],meta:{id:e.id},component:t=>Promise.all([n.e(626),n.e(732),n.e(454)]).then(function(){var o=[n(9305)(`./${e.component}.vue`)];t.apply(null,o)}.bind(this))["catch"](n.oe)};t.push(o)}))})),t},E={path:"*",redirect:"/404",hidden:!0};x.beforeEach(((e,t,n)=>{let o=window.sessionStorage.getItem("token");const r=window.sessionStorage.getItem("tokenStart"),i=(new Date).getTime(),u=864e5;if(i-r>u&&(o=null),o)if("/login"===e.path)n("/home");else if(4===x.getRoutes().length)try{y.commit("getMenuRouterList");const t=w().cloneDeep(y.state.menuRouterList),o=O(t);o.forEach((e=>{x.addRoute("home",e)})),x.addRoute(E),n({...e,replace:!0})}catch(a){console.log(a)}else n();else"/login"===e.path?n():(h().error("登录状态过期，请重新登录"),window.sessionStorage.clear(),n("/login"))}));var L=x;Vue.prototype.$axios=axios,Vue.prototype.$echarts=echarts,Object.keys(d).forEach((e=>{Vue.filter(e,d[e])})),axios.interceptors.request.use((e=>(e.headers.Authorization=window.sessionStorage.getItem("token"),e))),Vue.config.productionTip=!1,new Vue({store:y,router:L,axios:axios,render:e=>e(l)}).$mount("#app")},311:function(e){"use strict";e.exports=Vue},7467:function(e){"use strict";e.exports=axios}},t={};function n(o){var r=t[o];if(void 0!==r)return r.exports;var i=t[o]={id:o,loaded:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}n.m=e,function(){var e=[];n.O=function(t,o,r,i){if(!o){var u=1/0;for(l=0;l<e.length;l++){o=e[l][0],r=e[l][1],i=e[l][2];for(var a=!0,s=0;s<o.length;s++)(!1&i||u>=i)&&Object.keys(n.O).every((function(e){return n.O[e](o[s])}))?o.splice(s--,1):(a=!1,i<u&&(u=i));if(a){e.splice(l--,1);var c=r();void 0!==c&&(t=c)}}return t}i=i||0;for(var l=e.length;l>0&&e[l-1][2]>i;l--)e[l]=e[l-1];e[l]=[o,r,i]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})}}(),function(){n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,o){return n.f[o](e,t),t}),[]))}}(),function(){n.u=function(e){return"js/"+({177:"home",535:"login"}[e]||e)+"."+{177:"57dec52f",454:"34b17e5c",535:"6da6e7fd",626:"ccf948b1",732:"d55271d1"}[e]+".js"}}(),function(){n.miniCssF=function(e){return"css/"+({177:"home",535:"login"}[e]||e)+"."+{177:"6e67bd66",454:"447dd2b8",535:"183e09fd"}[e]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="micro_mall:";n.l=function(o,r,i,u){if(e[o])e[o].push(r);else{var a,s;if(void 0!==i)for(var c=document.getElementsByTagName("script"),l=0;l<c.length;l++){var d=c[l];if(d.getAttribute("src")==o||d.getAttribute("data-webpack")==t+i){a=d;break}}a||(s=!0,a=document.createElement("script"),a.charset="utf-8",a.timeout=120,n.nc&&a.setAttribute("nonce",n.nc),a.setAttribute("data-webpack",t+i),a.src=o),e[o]=[r];var f=function(t,n){a.onerror=a.onload=null,clearTimeout(h);var r=e[o];if(delete e[o],a.parentNode&&a.parentNode.removeChild(a),r&&r.forEach((function(e){return e(n)})),t)return t(n)},h=setTimeout(f.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=f.bind(null,a.onerror),a.onload=f.bind(null,a.onload),s&&document.head.appendChild(a)}}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){n.p="/"}(),function(){var e=function(e,t,n,o){var r=document.createElement("link");r.rel="stylesheet",r.type="text/css";var i=function(i){if(r.onerror=r.onload=null,"load"===i.type)n();else{var u=i&&("load"===i.type?"missing":i.type),a=i&&i.target&&i.target.href||t,s=new Error("Loading CSS chunk "+e+" failed.\n("+a+")");s.code="CSS_CHUNK_LOAD_FAILED",s.type=u,s.request=a,r.parentNode.removeChild(r),o(s)}};return r.onerror=r.onload=i,r.href=t,document.head.appendChild(r),r},t=function(e,t){for(var n=document.getElementsByTagName("link"),o=0;o<n.length;o++){var r=n[o],i=r.getAttribute("data-href")||r.getAttribute("href");if("stylesheet"===r.rel&&(i===e||i===t))return r}var u=document.getElementsByTagName("style");for(o=0;o<u.length;o++){r=u[o],i=r.getAttribute("data-href");if(i===e||i===t)return r}},o=function(o){return new Promise((function(r,i){var u=n.miniCssF(o),a=n.p+u;if(t(u,a))return r();e(o,a,r,i)}))},r={143:0};n.f.miniCss=function(e,t){var n={177:1,454:1,535:1};r[e]?t.push(r[e]):0!==r[e]&&n[e]&&t.push(r[e]=o(e).then((function(){r[e]=0}),(function(t){throw delete r[e],t})))}}(),function(){var e={143:0};n.f.j=function(t,o){var r=n.o(e,t)?e[t]:void 0;if(0!==r)if(r)o.push(r[2]);else{var i=new Promise((function(n,o){r=e[t]=[n,o]}));o.push(r[2]=i);var u=n.p+n.u(t),a=new Error,s=function(o){if(n.o(e,t)&&(r=e[t],0!==r&&(e[t]=void 0),r)){var i=o&&("load"===o.type?"missing":o.type),u=o&&o.target&&o.target.src;a.message="Loading chunk "+t+" failed.\n("+i+": "+u+")",a.name="ChunkLoadError",a.type=i,a.request=u,r[1](a)}};n.l(u,s,"chunk-"+t,t)}},n.O.j=function(t){return 0===e[t]};var t=function(t,o){var r,i,u=o[0],a=o[1],s=o[2],c=0;if(u.some((function(t){return 0!==e[t]}))){for(r in a)n.o(a,r)&&(n.m[r]=a[r]);if(s)var l=s(n)}for(t&&t(o);c<u.length;c++)i=u[c],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(l)},o=self["webpackChunkmicro_mall"]=self["webpackChunkmicro_mall"]||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var o=n.O(void 0,[998],(function(){return n(7820)}));o=n.O(o)})();
//# sourceMappingURL=app.48e005c0.js.map