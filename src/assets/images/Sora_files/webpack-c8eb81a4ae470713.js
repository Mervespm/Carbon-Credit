!function(){"use strict";var e,t,n,r,o,i,u,c,f,a={},d={};function l(e){var t=d[e];if(void 0!==t)return t.exports;var n=d[e]={id:e,loaded:!1,exports:{}},r=!0;try{a[e].call(n.exports,n,n.exports,l),r=!1}finally{r&&delete d[e]}return n.loaded=!0,n.exports}l.m=a,l.amdO={},e=[],l.O=function(t,n,r,o){if(n){o=o||0;for(var i=e.length;i>0&&e[i-1][2]>o;i--)e[i]=e[i-1];e[i]=[n,r,o];return}for(var u=1/0,i=0;i<e.length;i++){for(var n=e[i][0],r=e[i][1],o=e[i][2],c=!0,f=0;f<n.length;f++)u>=o&&Object.keys(l.O).every(function(e){return l.O[e](n[f])})?n.splice(f--,1):(c=!1,o<u&&(u=o));if(c){e.splice(i--,1);var a=r();void 0!==a&&(t=a)}}return t},l.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return l.d(t,{a:t}),t},n=Object.getPrototypeOf?function(e){return Object.getPrototypeOf(e)}:function(e){return e.__proto__},l.t=function(e,r){if(1&r&&(e=this(e)),8&r||"object"==typeof e&&e&&(4&r&&e.__esModule||16&r&&"function"==typeof e.then))return e;var o=Object.create(null);l.r(o);var i={};t=t||[null,n({}),n([]),n(n)];for(var u=2&r&&e;"object"==typeof u&&!~t.indexOf(u);u=n(u))Object.getOwnPropertyNames(u).forEach(function(t){i[t]=function(){return e[t]}});return i.default=function(){return e},l.d(o,i),o},l.d=function(e,t){for(var n in t)l.o(t,n)&&!l.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},l.f={},l.e=function(e){return Promise.all(Object.keys(l.f).reduce(function(t,n){return l.f[n](e,t),t},[]))},l.u=function(e){return"static/chunks/"+(({3096:"queryString",4604:"tsub-middleware",5852:"f8fd8c4d",7493:"schemaFilter",7680:"921d5d91",8119:"auto-track",8150:"legacyVideos",8196:"f58eac56",9214:"remoteMiddleware",9464:"ajs-destination"})[e]||e)+"."+({1445:"06d22045f36057fd",3081:"52dee604e5dae170",3096:"2b7e0ef1c65a5939",3647:"9d91b16068c7720b",4604:"c340b5292dccfe42",5115:"d3acea11270f9066",5852:"23e13defe209f189",6131:"49c1e8eb0c44ddef",6944:"b7d6edb048a8efb8",7493:"bbef0a7bdaca0c12",7680:"b1535216bbec9dd2",8119:"1a583ff59cbd9a97",8150:"4e8fcd5563c63138",8196:"00ee7d3659b5fb71",8949:"1c27c54e51c46531",9214:"4eb0b1252b272617",9464:"d7896798fd937681"})[e]+".js"},l.miniCssF=function(e){},l.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(e){if("object"==typeof window)return window}}(),l.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r={},o="_N_E:",l.l=function(e,t,n,i){if(r[e]){r[e].push(t);return}if(void 0!==n)for(var u,c,f=document.getElementsByTagName("script"),a=0;a<f.length;a++){var d=f[a];if(d.getAttribute("src")==e||d.getAttribute("data-webpack")==o+n){u=d;break}}u||(c=!0,(u=document.createElement("script")).charset="utf-8",u.timeout=120,l.nc&&u.setAttribute("nonce",l.nc),u.setAttribute("data-webpack",o+n),u.src=l.tu(e)),r[e]=[t];var s=function(t,n){u.onerror=u.onload=null,clearTimeout(p);var o=r[e];if(delete r[e],u.parentNode&&u.parentNode.removeChild(u),o&&o.forEach(function(e){return e(n)}),t)return t(n)},p=setTimeout(s.bind(null,void 0,{type:"timeout",target:u}),12e4);u.onerror=s.bind(null,u.onerror),u.onload=s.bind(null,u.onload),c&&document.head.appendChild(u)},l.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e},l.tt=function(){return void 0===i&&(i={createScriptURL:function(e){return e}},"undefined"!=typeof trustedTypes&&trustedTypes.createPolicy&&(i=trustedTypes.createPolicy("nextjs#bundler",i))),i},l.tu=function(e){return l.tt().createScriptURL(e)},l.p="https://sora-cdn.oaistatic.com/_next/",u={2272:0,6823:0,5422:0},l.f.j=function(e,t){var n=l.o(u,e)?u[e]:void 0;if(0!==n){if(n)t.push(n[2]);else if(/^(2272|5422|6823)$/.test(e))u[e]=0;else{var r=new Promise(function(t,r){n=u[e]=[t,r]});t.push(n[2]=r);var o=l.p+l.u(e),i=Error();l.l(o,function(t){if(l.o(u,e)&&(0!==(n=u[e])&&(u[e]=void 0),n)){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;i.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",i.name="ChunkLoadError",i.type=r,i.request=o,n[1](i)}},"chunk-"+e,e)}}},l.O.j=function(e){return 0===u[e]},c=function(e,t){var n,r,o=t[0],i=t[1],c=t[2],f=0;if(o.some(function(e){return 0!==u[e]})){for(n in i)l.o(i,n)&&(l.m[n]=i[n]);if(c)var a=c(l)}for(e&&e(t);f<o.length;f++)r=o[f],l.o(u,r)&&u[r]&&u[r][0](),u[r]=0;return l.O(a)},(f=self.webpackChunk_N_E=self.webpackChunk_N_E||[]).forEach(c.bind(null,0)),f.push=c.bind(null,f.push.bind(f)),l.nc=void 0}();
//# sourceMappingURL=webpack-c8eb81a4ae470713.js.map