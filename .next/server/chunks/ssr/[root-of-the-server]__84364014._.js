module.exports={83943:function(a){var{g:b,__dirname:c,m:d,e:e}=a;d.exports=a.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},86103:function(a){var{g:b,__dirname:c,m:d,e:e}=a;d.exports=a.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},74538:function(a){var{g:b,__dirname:c,m:d,e:e}=a;d.exports=a.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24544:function(a){var{g:b,__dirname:c,m:d,e:e}=a;d.exports=a.r(74023)},20188:a=>{"use strict";var{g:b,__dirname:c}=a;a.s({RouteKind:()=>d});var d=function(a){return a.PAGES="PAGES",a.PAGES_API="PAGES_API",a.APP_PAGE="APP_PAGE",a.APP_ROUTE="APP_ROUTE",a.IMAGE="IMAGE",a}({})},36087:a=>{"use strict";var{g:b,__dirname:c}=a;a.s({hoist:()=>function a(b,c){return c in b?b[c]:"then"in b&&"function"==typeof b.then?b.then(b=>a(b,c)):"function"==typeof b&&"default"===c?b:void 0}})},51556:function(a){var{g:b,__dirname:c,m:d,e:e}=a;"use strict";function f(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(f=function(a){return a?c:b})(a)}e._=function(a,b){if(!b&&a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=f(b);if(c&&c.has(a))return c.get(a);var d={__proto__:null},e=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var g in a)if("default"!==g&&Object.prototype.hasOwnProperty.call(a,g)){var h=e?Object.getOwnPropertyDescriptor(a,g):null;h&&(h.get||h.set)?Object.defineProperty(d,g,h):d[g]=a[g]}return d.default=a,c&&c.set(a,d),d}},54299:function(a){var{g:b,__dirname:c,m:d,e:e}=a;{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"warnOnce",{enumerable:!0,get:function(){return a}});let a=a=>{}}},16038:function(a){var{g:b,__dirname:c,m:d,e:e}=a;{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return f}});let b=a.r(38005),c="undefined"==typeof window,d=c?()=>{}:b.useLayoutEffect,g=c?()=>{}:b.useEffect;function f(a){let{headManager:e,reduceComponentsToState:f}=a;function h(){if(e&&e.mountedInstances){let c=b.Children.toArray(Array.from(e.mountedInstances).filter(Boolean));e.updateHead(f(c,a))}}if(c){var i;null==e||null==(i=e.mountedInstances)||i.add(a.children),h()}return d(()=>{var b;return null==e||null==(b=e.mountedInstances)||b.add(a.children),()=>{var b;null==e||null==(b=e.mountedInstances)||b.delete(a.children)}}),d(()=>(e&&(e._pendingUpdate=h),()=>{e&&(e._pendingUpdate=h)})),g(()=>(e&&e._pendingUpdate&&(e._pendingUpdate(),e._pendingUpdate=null),()=>{e&&e._pendingUpdate&&(e._pendingUpdate(),e._pendingUpdate=null)})),null}}},89874:function(a){var{g:b,__dirname:c,m:d,e:e}=a;"use strict";d.exports=a.r(15583).vendored.contexts.AmpContext},36911:function(a){var{g:b,__dirname:c,m:d,e:e}=a;"use strict";d.exports=a.r(15583).vendored.contexts.HeadManagerContext},8016:function(a){var{g:b,__dirname:c,m:d,e:e}=a;"use strict";function f(a){let{ampFirst:b=!1,hybrid:c=!1,hasQuery:d=!1}=void 0===a?{}:a;return b||c&&d}Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"isInAmpMode",{enumerable:!0,get:function(){return f}})},14284:function(a){var{g:b,__dirname:c,m:d,e:e}=a;{"use strict";Object.defineProperty(e,"__esModule",{value:!0});var f={default:function(){return r},defaultHead:function(){return h}};for(var g in f)Object.defineProperty(e,g,{enumerable:!0,get:f[g]});let b=a.r(66662),c=a.r(51556),k=a.r(57739),l=c._(a.r(38005)),m=b._(a.r(16038)),n=a.r(89874),o=a.r(36911),p=a.r(8016);function h(a){void 0===a&&(a=!1);let b=[(0,k.jsx)("meta",{charSet:"utf-8"},"charset")];return a||b.push((0,k.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")),b}function i(a,b){return"string"==typeof b||"number"==typeof b?a:b.type===l.default.Fragment?a.concat(l.default.Children.toArray(b.props.children).reduce((a,b)=>"string"==typeof b||"number"==typeof b?a:a.concat(b),[])):a.concat(b)}a.r(54299);let q=["name","httpEquiv","charSet","itemProp"];function j(a,b){let{inAmpMode:c}=b;return a.reduce(i,[]).reverse().concat(h(c).reverse()).filter(function(){let a=new Set,b=new Set,c=new Set,d={};return e=>{let f=!0,g=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){g=!0;let b=e.key.slice(e.key.indexOf("$")+1);a.has(b)?f=!1:a.add(b)}switch(e.type){case"title":case"base":b.has(e.type)?f=!1:b.add(e.type);break;case"meta":for(let a=0,b=q.length;a<b;a++){let b=q[a];if(e.props.hasOwnProperty(b))if("charSet"===b)c.has(b)?f=!1:c.add(b);else{let a=e.props[b],c=d[b]||new Set;("name"!==b||!g)&&c.has(a)?f=!1:(c.add(a),d[b]=c)}}}return f}}()).reverse().map((a,b)=>{let d=a.key||b;if(process.env.__NEXT_OPTIMIZE_FONTS&&!c&&"link"===a.type&&a.props.href&&["https://fonts.googleapis.com/css","https://use.typekit.net/"].some(b=>a.props.href.startsWith(b))){let b={...a.props||{}};return b["data-href"]=b.href,b.href=void 0,b["data-optimized-fonts"]=!0,l.default.cloneElement(a,b)}return l.default.cloneElement(a,{key:d})})}let r=function(a){let{children:b}=a,c=(0,l.useContext)(n.AmpStateContext),d=(0,l.useContext)(o.HeadManagerContext);return(0,k.jsx)(m.default,{reduceComponentsToState:j,headManager:d,inAmpMode:(0,p.isInAmpMode)(c),children:b})};("function"==typeof e.default||"object"==typeof e.default&&null!==e.default)&&void 0===e.default.__esModule&&(Object.defineProperty(e.default,"__esModule",{value:!0}),Object.assign(e.default,e),d.exports=e.default)}},60525:a=>{"use strict";var{g:b,__dirname:c,a:d}=a;d(async(b,c)=>{try{a.s({default:()=>j});var d=a.i(57739),e=a.i(21513),f=a.i(6725),g=a.i(66294),h=a.i(98214),i=b([g]);function j(){let a=(0,h.useParams)(),b=a?.lang==="fr-FR"?"fr-FR":"en-EN",c={"fr-FR":{cgu:"Conditions Générales d'Utilisation",copyright:"© 2025 - Vylte-finuka SARL, Tous droits réservés."},"en-EN":{cgu:"Terms of Use",copyright:"© 2025 - Vylte-finuka SARL, All rights reserved."}}[b];return(0,d.jsxs)("footer",{className:f.default.footer,children:[(0,d.jsx)("div",{className:f.default.links,children:(0,d.jsx)(e.default,{href:`/${b}/conditions-generales-d-utilisation`,className:f.default.fontstyle3,children:c.cgu})}),(0,d.jsx)("div",{className:f.default.copyright,children:(0,d.jsx)("p",{className:f.default.fontstyle1,children:c.copyright})}),(0,d.jsx)(g.default,{})]})}[g]=i.then?(await i)():i,c()}catch(a){c(a)}},!1)},83886:function(a){var{g:b,__dirname:c,m:d,e:e}=a;d.exports=a.x("fs",()=>require("fs"))},9651:function(a){var{g:b,__dirname:c,m:d,e:e}=a;d.exports=a.x("stream",()=>require("stream"))},94045:function(a){var{g:b,__dirname:c,m:d,e:e}=a;d.exports=a.x("zlib",()=>require("zlib"))},18821:a=>{"use strict";var{g:b,__dirname:c}=a;{a.s({default:()=>b});let b=`
# Terms and Conditions of Use (CGU) - Vyft

**Last update: August 8, 2025**

These Terms and Conditions of Use (CGU) govern the use of services offered by **Vyft**, a "neobank" (term used for information, Vyft is not yet approved by the French Prudential Supervision and Resolution Authority - ACPR) operated by **Vylte-Finuka SARL**, a company registered in France at 60 Rue Fran\xe7ois 1er, 75008 Paris, SIRET: 92978865100016. By using our services, you unreservedly accept these CGU. If you do not accept these terms, please do not use our services.

Vyft is a registered trademark of Vylte-Finuka SARL. The Vyft slide debit card is co-branded with **Visa**, a registered trademark of Visa Inc. The design of the Vyft slide card is protected by intellectual property rights.

## 1. Definitions
- **Client**: Any individual who has opened a Vyft account.
- **Account**: Self-managed wallet based on the EURC asset on the Avalanche network, accessible via the Vyft app.
- **Services**: Digital financial services offered by Vyft, including the Vyft slide debit card, SEPA transfers via MetaMask, and future features (insurance, trading, cashback).
- **Application**: Vyft mobile app, available on iOS and Android.
- **EURC**: Digital asset based on the Avalanche network, used as the basis for the Vyft account.
- **MetaMask**: Registered trademark of ConsenSys, used to make SEPA transfers.

## 2. Purpose
These CGU define the rights and obligations of the parties in the context of using Vyft's services, a beta-phase platform offering a self-managed wallet based on the EURC asset on the Avalanche network, a co-branded Visa debit card, and digital financial services.

## 3. Eligibility
To open an account, the client must:
- Be a resident of one of the CEMEA zone countries (Central African States Community) and others african territories, French overseas territories, Madagascar, or the EEA (European Economic Area).
- Be at least 18 years old, or at least 16 years old with written parental authorization for minors.
- Have a smartphone compatible with the Vyft app.

**Note:** Only clients residing in the EEA are eligible to receive a physical Vyft slide card. Residents of other eligible zones may access the virtual

Due to Vyft's beta phase, **no KYC (Know Your Customer) verification** is currently required for account opening or Vyft slide card creation. This policy may change in the future.

## 4. Account Opening
Account opening is done exclusively via the Vyft mobile app by following these steps:
1. Download the app and create a profile.
2. Accept these CGU and the privacy policy.
3. Account validation within 24 hours.

The Vyft account is a **self-managed wallet** based on the EURC asset on the Avalanche network. No integrated IBAN is provided at this time, but integrated IBANs will be offered in the future, subject to applicable conditions.

## 5. Services Offered
### 5.1 Vyft Account
- The account is a self-managed wallet based on the EURC asset on the Avalanche network.
- Clients are fully responsible for managing and securing their funds, as Vyft is not a licensed digital asset service provider (PSAN) during the beta phase.
- **Warning**: Due to the self-managed nature of the account, Vyft is not responsible for fund movements or losses due to mismanagement, errors, or technical incidents.

### 5.2 Vyft slide Card
- Co-branded Visa debit card, available in virtual version only during the beta phase.
- Physical cards are not delivered to homes at this time.
- Payments are made via the EURC asset on the Avalanche network.
- No transaction fees are applied during the beta phase.

### 5.3 SEPA Transfers
- SEPA transfers are made via **MetaMask**, a registered trademark of ConsenSys.
- No integrated IBAN is provided during the beta phase. Transfers are initiated via the Vyft app and MetaMask.

### 5.4 Future Services
Vyft plans to offer in the future:
- Insurance (travel, purchase, etc.).
- Trading features.
- Cashback programs.
These services will be subject to specific conditions, communicated later.

## 6. Fees and Pricing
During the beta phase, **no fees** are applied for account opening, use of the Vyft slide card, or SEPA transfers. Vyft is committed to full transparency on fees. A pricing schedule will be communicated if fees are introduced in the future.

## 7. Client Obligations
The client agrees to:
- Provide accurate information during registration.
- Secure access to their self-managed wallet and MetaMask app.
- Immediately report any problem or suspected fraud to support@vylte-finuka.com.
- Comply with European and French laws, especially regarding anti-money laundering.

## 8. Vyft's Responsibility
Due to the beta phase and lack of PSAN certification:
- Vyft is not responsible for fund losses due to the self-managed nature of accounts or technical incidents.
- Vyft undertakes to guarantee funds with the Deposit Guarantee and Resolution Fund (FGDR) up to €100,000, in accordance with European regulations, once the necessary certification is obtained.

Vyft is not a fully functional broker during the beta phase and does not guarantee continuous service availability.

## 9. Account Closure
The client may close their account at any time by contacting **support@vylte-finuka.com**, subject to a zero balance and no pending transactions. Vyft reserves the right to close an account in case of:
- Non-compliance with the CGU.
- Suspicion of fraud or illegal activities.
A 30-day notice will be sent, except in cases of fraud.

## 10. Data Protection
In accordance with the General Data Protection Regulation (GDPR), clients' personal data is collected only to personalize Vyft services. This data is shared with trusted partners and will never be sold to third parties. For more information, see our **Privacy Policy** at www.vylte-finuka.com.

## 11. Customer Service
Customer service is available exclusively via **support@vylte-finuka.com**. Response times may vary due to the volume of requests. In case of dispute, please contact support at the same address. If the dispute is not resolved, clients may contact the relevant authorities.

## 12. Modification of the CGU
Vyft reserves the right to modify the CGU as necessary, especially to comply with European and French laws or to add new features. Clients will be informed by email or in-app notification at least 30 days before changes take effect. In case of disagreement, the client may close their account free of charge.

## 13. Non-Compliance with the CGU
In case of non-compliance with these CGU, Vyft reserves the right to take legal action, including suspension or closure of the account.

## 14. Applicable Law and Jurisdiction
These CGU are governed by French law and applicable European regulations. Any dispute will be submitted to the competent courts of Paris, unless otherwise provided by law.

## 15. Contact
**Vylte-Finuka SARL**  
Address: 60 Rue Fran\xe7ois 1er, 75008 Paris, France  
SIRET: 92978865100016  
E-mail: support@vylte-finuka.com  
Website: www.vylte-finuka.com

---

By using Vyft's services, the client acknowledges having read, understood, and accepted these CGU.
`}},25954:a=>{"use strict";var{g:b,__dirname:c,a:d}=a;d(async(b,c)=>{try{a.s({default:()=>n});var d=a.i(57739),e=a.i(25710),f=a.i(53475),g=a.i(60525),h=a.i(7702),i=a.i(9042),j=a.i(98850),k=a.i(18821),l=a.i(4726),m=b([g,h,i]);function n(){let a=(0,l.useRouter)().query.lang,b="fr-FR"===a?j.default:k.default;return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)("title",{children:"Conditions Générales d’Utilisation - Vyft"}),(0,d.jsx)("div",{children:(0,d.jsxs)("div",{className:f.default.container2,children:[(0,d.jsx)(e.default,{}),(0,d.jsx)("main",{className:f.default.main,children:(0,d.jsx)("div",{className:f.default.bodyonwhite,style:{marginBottom:24},children:(0,d.jsx)(i.default,{components:{h1:({node:a,...b})=>(0,d.jsx)("h1",{className:f.default.headeronwhiteX2,...b}),h2:({node:a,...b})=>(0,d.jsx)("h2",{className:f.default.headeronwhiteX2,style:{fontSize:22,marginTop:32},...b}),h3:({node:a,...b})=>(0,d.jsx)("h3",{className:f.default.headeronwhiteX2,style:{fontSize:18,marginTop:24},...b}),p:({node:a,...b})=>(0,d.jsx)("p",{className:f.default.bodyonwhite,style:{marginBottom:12},...b}),ul:({node:a,...b})=>(0,d.jsx)("ul",{style:{marginLeft:24,marginBottom:12},...b}),li:({node:a,...b})=>(0,d.jsx)("li",{style:{marginBottom:6},...b}),strong:({node:a,...b})=>(0,d.jsx)("strong",{style:{color:"#1a7f6b"},...b})},children:b})})}),(0,d.jsx)(g.default,{})]})})]})}[g,h,i]=m.then?(await m)():m,c()}catch(a){c(a)}},!1)},83039:a=>{"use strict";var{g:b,__dirname:c,a:d}=a;d(async(b,c)=>{try{a.s({config:()=>o,default:()=>k,getServerSideProps:()=>n,getStaticPaths:()=>m,getStaticProps:()=>l,reportWebVitals:()=>p,routeModule:()=>v,unstable_getServerProps:()=>t,unstable_getServerSideProps:()=>u,unstable_getStaticParams:()=>s,unstable_getStaticPaths:()=>r,unstable_getStaticProps:()=>q});var d=a.i(24544),e=a.i(20188),f=a.i(36087),g=a.i(45253),h=a.i(52731),i=a.i(25954),j=b([i]);[i]=j.then?(await j)():j;let k=(0,f.hoist)(i,"default"),l=(0,f.hoist)(i,"getStaticProps"),m=(0,f.hoist)(i,"getStaticPaths"),n=(0,f.hoist)(i,"getServerSideProps"),o=(0,f.hoist)(i,"config"),p=(0,f.hoist)(i,"reportWebVitals"),q=(0,f.hoist)(i,"unstable_getStaticProps"),r=(0,f.hoist)(i,"unstable_getStaticPaths"),s=(0,f.hoist)(i,"unstable_getStaticParams"),t=(0,f.hoist)(i,"unstable_getServerProps"),u=(0,f.hoist)(i,"unstable_getServerSideProps"),v=new d.PagesRouteModule({definition:{kind:e.RouteKind.PAGES,page:"/[lang]/conditions-generales-d-utilisation",pathname:"/[lang]/conditions-generales-d-utilisation",bundlePath:"",filename:""},components:{App:h.default,Document:g.default},userland:i});c()}catch(a){c(a)}},!1)}};

//# sourceMappingURL=%5Broot-of-the-server%5D__84364014._.js.map