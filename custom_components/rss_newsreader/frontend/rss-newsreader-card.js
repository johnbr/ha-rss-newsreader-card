function t(t,e,i,s){var r,o=arguments.length,n=o<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,i,n):r(e,i))||n);return o>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new o(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,_=m?m.emptyScript:"",g=f.reactiveElementPolyfillSupport,v=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&c(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const o=s?.call(this);r?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const o=r.fromAttribute(e,t.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const o=this.constructor;if(!1===s&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,g?.({ReactiveElement:w}),(f.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,E=x.trustedTypes,k=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+C,N=`<${T}>`,P=document,U=()=>P.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,R="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,D=/>/g,z=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,j=/"/g,F=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,J=P.createTreeWalker(P,129);function K(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=L;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(n.lastIndex=h,l=n.exec(i),null!==l);)h=n.lastIndex,n===L?"!--"===l[1]?n=H:void 0!==l[1]?n=D:void 0!==l[2]?(F.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=z):void 0!==l[3]&&(n=z):n===z?">"===l[0]?(n=r??L,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?z:'"'===l[3]?j:I):n===j||n===I?n=z:n===H||n===D?n=L:(n=z,r=void 0);const d=n===z&&t[e+1].startsWith("/>")?" ":"";o+=n===L?i+N:c>=0?(s.push(a),i.slice(0,c)+S+i.slice(c)+C+d):i+C+(-2===c?e:d)}return[K(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class G{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=G.createElement(l,i),J.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=J.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=c[o++],i=s.getAttribute(t).split(C),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?et:"?"===n[1]?it:"@"===n[1]?st:tt}),s.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(F.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],U()),J.nextNode(),a.push({type:2,index:++r});s.append(t[e],U())}}}else if(8===s.nodeType)if(s.data===T)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)a.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===q)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=O(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Y(t,r._$AS(t,e.values),r,s)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);J.currentNode=s;let r=J.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new X(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new rt(r,this,t)),this._$AV.push(e),a=i[++n]}o!==a?.index&&(r=J.nextNode(),o++)}return J.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),O(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Q(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new G(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new X(this.O(U()),this.O(U()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,s){const r=this.strings;let o=!1;if(void 0===r)t=Y(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const s=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Y(this,s[i+n],e,n),a===q&&(a=this._$AH[n]),o||=!O(a)||a!==this._$AH[n],a===V?t=V:t!==V&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class st extends tt{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??V)===q)return;const i=this._$AH,s=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const ot=x.litHtmlPolyfillSupport;ot?.(G,X),(x.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;let at=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new X(e.insertBefore(U(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};at._$litElement$=!0,at.finalized=!0,nt.litElementHydrateSupport?.({LitElement:at});const lt=nt.litElementPolyfillSupport;lt?.({LitElement:at}),(nt.litElementVersions??=[]).push("4.2.2");const ct={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ht=(t=ct,e,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const r=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,r,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];e.call(this,i),this.requestUpdate(s,r,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};function dt(t){return(e,i)=>"object"==typeof i?ht(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return dt({...t,state:!0,attribute:!1})}const ut=[["year",31536e3],["month",2592e3],["week",604800],["day",86400],["hour",3600],["minute",60]];function ft(t){if(!t)return"";try{return new URL(t).hostname.replace(/^www\./,"")}catch{return t}}const mt=n`
  :host {
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, inherit);
    -webkit-font-smoothing: antialiased;
  }

  .badge {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--badge-color, var(--primary-color));
    color: var(--text-primary-color, #fff);
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    text-transform: uppercase;
  }

  .badge img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .meta {
    color: var(--secondary-text-color);
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    white-space: nowrap;
  }

  .meta .source {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button.icon-btn {
    background: none;
    border: none;
    padding: 6px;
    margin: 0;
    cursor: pointer;
    color: var(--primary-text-color);
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  button.icon-btn:hover {
    background: var(--secondary-background-color);
  }

  @keyframes shimmer {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }

  .skeleton {
    background: var(--secondary-background-color);
    border-radius: 4px;
    animation: shimmer 1.4s ease-in-out infinite;
  }
`;function _t(t,e){customElements.get(t)||customElements.define(t,e)}class gt extends at{constructor(){super(...arguments),this.showImage=!1,this.now=Date.now(),this.language="en",this._iconFailed=!1}render(){const{entry:t,feed:e,feedConfig:i}=this.item,s=i.name||e.feed_title||ft(e.url),r=function(t,e="en",i=Date.now()){if(!t)return"";const s=Date.parse(t);if(Number.isNaN(s))return"";const r=(s-i)/1e3,o=Math.abs(r);let n;try{n=new Intl.RelativeTimeFormat(e,{numeric:"auto"})}catch{n=new Intl.RelativeTimeFormat("en",{numeric:"auto"})}for(const[t,e]of ut)if(o>=e)return n.format(Math.round(r/e),t);return n.format(Math.round(r),"second")}(t.published,this.language,this.now),o=i.color;return B`
      <div
        class="row"
        role="button"
        tabindex="0"
        @click=${this._select}
        @keydown=${this._keydown}
      >
        <div class="text">
          <div class="title">${t.title}</div>
          <div class="meta">
            <span
              class="badge"
              style=${o?`--badge-color: ${o}`:""}
            >
              ${e.feed_icon&&!this._iconFailed?B`<img
                    src=${e.feed_icon}
                    alt=""
                    @error=${()=>this._iconFailed=!0}
                  />`:s.slice(0,1)}
            </span>
            <span class="source">${s}</span>
            ${r?B`<span>·</span><span>${r}</span>`:V}
          </div>
        </div>
        ${this.showImage&&t.image_url?B`<img
              class="thumb"
              src=${t.image_url}
              alt=""
              loading="lazy"
              @error=${this._hideThumb}
            />`:V}
      </div>
    `}_select(){this.dispatchEvent(new CustomEvent("entry-selected",{detail:{item:this.item},bubbles:!0,composed:!0}))}_keydown(t){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._select())}_hideThumb(t){t.target.style.display="none"}static{this.styles=[mt,n`
      .row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        cursor: pointer;
        border-bottom: 1px solid var(--divider-color);
      }

      .row:hover,
      .row:focus-visible {
        background: var(--secondary-background-color);
        outline: none;
      }

      .text {
        flex: 1;
        min-width: 0;
      }

      .title {
        font-size: 14px;
        font-weight: 500;
        line-height: 1.35;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 4px;
      }

      .thumb {
        flex-shrink: 0;
        width: 72px;
        height: 52px;
        object-fit: cover;
        border-radius: 8px;
        background: var(--secondary-background-color);
      }
    `]}}t([dt({attribute:!1})],gt.prototype,"item",void 0),t([dt({type:Boolean})],gt.prototype,"showImage",void 0),t([dt({type:Number})],gt.prototype,"now",void 0),t([dt()],gt.prototype,"language",void 0),t([pt()],gt.prototype,"_iconFailed",void 0),_t("rss-newsreader-headline",gt);const vt=2;class yt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class $t extends yt{constructor(t){if(super(t),this.it=V,t.type!==vt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===V||null==t)return this._t=void 0,this.it=t;if(t===q)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}$t.directiveName="unsafeHTML",$t.resultType=1;const bt=(t=>(...e)=>({_$litDirective$:t,values:e}))($t);class wt extends at{constructor(){super(...arguments),this.article=null,this.articleLoading=!1,this.articleError=null,this.showImages=!0,this.openLinks="new_tab",this.language="en"}render(){const{entry:t,feed:e,feedConfig:i}=this.item,s=i.name||e.feed_title||ft(e.url),r=this.article?.title||t.title,o=this.article?.content_html||t.content_html||t.summary_html||"",n=this.article?.image_url||t.image_url,a=this.showImages&&n&&!o.includes("<img");return B`
      <div class="toolbar">
        <button
          class="icon-btn"
          aria-label="Back to headlines"
          @click=${this._back}
        >
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </button>
        <span class="toolbar-source">${s}</span>
        ${t.link?B`<a
              class="icon-btn ext"
              href=${t.link}
              target=${"same_tab"===this.openLinks?"_self":"_blank"}
              rel="noopener noreferrer"
              aria-label="Open article on site"
            >
              <ha-icon icon="mdi:open-in-new"></ha-icon>
            </a>`:V}
      </div>
      <div class="body">
        <h2 class="headline">${r}</h2>
        <div class="meta">
          ${t.author?B`<span>${t.author}</span><span>·</span>`:V}
          <span>${function(t,e="en"){if(!t)return"";const i=Date.parse(t);if(Number.isNaN(i))return"";try{return new Intl.DateTimeFormat(e,{dateStyle:"medium",timeStyle:"short"}).format(i)}catch{return new Date(i).toLocaleString()}}(t.published,this.language)}</span>
        </div>
        ${a?B`<img
              class="hero"
              src=${n}
              alt=""
              @error=${this._hideImage}
            />`:V}
        ${this.articleLoading?B`
              <div class="loading-note">Loading full article…</div>
              <div class="skeleton line"></div>
              <div class="skeleton line"></div>
              <div class="skeleton line short"></div>
            `:V}
        ${this.articleError?B`<div class="error-note">
              Couldn't load the full article (${this.articleError}). Showing the
              feed summary instead.
            </div>`:V}
        ${o?B`<div
              class=${this.showImages?"content":"content no-images"}
              @click=${this._contentClick}
            >
              ${bt(o)}
            </div>`:this.articleLoading?V:B`<div class="loading-note">
                This feed doesn't include article text.
              </div>`}
        ${t.link?B`<a
              class="read-more"
              href=${t.link}
              target=${"same_tab"===this.openLinks?"_self":"_blank"}
              rel="noopener noreferrer"
              >Read on ${ft(t.link)}</a
            >`:V}
      </div>
    `}_back(){this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_hideImage(t){t.target.style.display="none"}_contentClick(t){if("same_tab"!==this.openLinks)return;const e=t.composedPath().find(t=>"A"===t.tagName);e?.href&&(t.preventDefault(),window.location.href=e.href)}static{this.styles=[mt,n`
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 0;
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
        flex-shrink: 0;
      }

      .toolbar-source {
        flex: 1;
        font-size: 13px;
        font-weight: 500;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      a.icon-btn {
        text-decoration: none;
      }

      .body {
        flex: 1;
        overflow-y: auto;
        padding: 12px 16px 16px;
        min-height: 0;
      }

      .headline {
        margin: 0 0 6px;
        font-size: 18px;
        font-weight: 600;
        line-height: 1.3;
      }

      .body > .meta {
        margin-bottom: 12px;
      }

      .hero {
        width: 100%;
        max-height: 240px;
        object-fit: cover;
        border-radius: var(--ha-card-border-radius, 12px);
        margin-bottom: 12px;
        background: var(--secondary-background-color);
      }

      .content {
        font-size: 14px;
        line-height: 1.6;
        overflow-wrap: break-word;
      }

      .content img {
        max-width: 100%;
        height: auto;
        border-radius: var(--ha-card-border-radius, 12px);
      }

      .content.no-images img {
        display: none;
      }

      .content a {
        color: var(--primary-color);
      }

      .content pre {
        overflow-x: auto;
        background: var(--secondary-background-color);
        padding: 8px;
        border-radius: 6px;
      }

      .content blockquote {
        margin: 8px 0;
        padding-left: 12px;
        border-left: 3px solid var(--divider-color);
        color: var(--secondary-text-color);
      }

      .content table {
        max-width: 100%;
        overflow-x: auto;
        display: block;
        border-collapse: collapse;
      }

      .content td,
      .content th {
        border: 1px solid var(--divider-color);
        padding: 4px 8px;
      }

      .loading-note {
        color: var(--secondary-text-color);
        font-size: 13px;
        margin-bottom: 8px;
      }

      .error-note {
        color: var(--warning-color, #b7791f);
        font-size: 13px;
        margin-bottom: 8px;
      }

      .skeleton.line {
        height: 14px;
        margin-bottom: 8px;
      }

      .skeleton.line.short {
        width: 60%;
      }

      .read-more {
        display: inline-block;
        margin-top: 16px;
        color: var(--primary-color);
        font-size: 14px;
        font-weight: 500;
        text-decoration: none;
      }

      .read-more:hover {
        text-decoration: underline;
      }
    `]}}t([dt({attribute:!1})],wt.prototype,"item",void 0),t([dt({attribute:!1})],wt.prototype,"article",void 0),t([dt({type:Boolean})],wt.prototype,"articleLoading",void 0),t([dt()],wt.prototype,"articleError",void 0),t([dt({type:Boolean})],wt.prototype,"showImages",void 0),t([dt()],wt.prototype,"openLinks",void 0),t([dt()],wt.prototype,"language",void 0),_t("rss-newsreader-article",wt);const xt={title:"Title",refresh_interval:"Refresh interval",max_items:"Max headlines",height:"Card height",show_images:"Show images",open_links:"Open links in",url:"Feed URL",name:"Display name",color:"Accent color",full_content:"Fetch full article text when opened"},At=[{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"refresh_interval",selector:{number:{min:300,max:86400,step:60,mode:"box",unit_of_measurement:"s"}}},{name:"max_items",selector:{number:{min:1,max:100,mode:"box"}}},{name:"height",selector:{number:{min:150,max:2e3,step:10,mode:"box",unit_of_measurement:"px"}}},{name:"show_images",selector:{boolean:{}}},{name:"open_links",selector:{select:{mode:"dropdown",options:[{value:"new_tab",label:"New tab"},{value:"same_tab",label:"Same tab"}]}}}]}],Et=[{name:"url",required:!0,selector:{text:{type:"url"}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"color",selector:{text:{prefix:"#"}}}]},{name:"full_content",selector:{boolean:{}}}];class kt extends at{constructor(){super(...arguments),this._computeLabel=t=>xt[t.name]??t.name}setConfig(t){this._config=t}connectedCallback(){super.connectedCallback(),this._ensureComponents()}async _ensureComponents(){if(customElements.get("ha-form"))return;const t=await(window.loadCardHelpers?.());if(!t)return;const e=await t.createCardElement({type:"entities",entities:[]});await(e?.constructor?.getConfigElement?.()),this.requestUpdate()}render(){if(!this._config||!this.hass)return V;const t=this._config.feeds??[];return B`
      <div class="section-title">Feeds</div>
      ${t.map((e,i)=>B`
          <div class="feed-row">
            <ha-form
              .hass=${this.hass}
              .data=${e}
              .schema=${Et}
              .computeLabel=${this._computeLabel}
              @value-changed=${t=>this._feedChanged(i,t)}
            ></ha-form>
            <button
              class="remove"
              title="Remove feed"
              ?disabled=${1===t.length}
              @click=${()=>this._removeFeed(i)}
            >
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>
        `)}
      <button class="add" @click=${this._addFeed}>
        <ha-icon icon="mdi:plus"></ha-icon>
        Add feed
      </button>

      <div class="section-title">Options</div>
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${At}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._optionsChanged}
      ></ha-form>
    `}_feedChanged(t,e){if(e.stopPropagation(),!this._config)return;const i=e.detail.value,s=[...this._config.feeds??[]];s[t]=this._pruneEmpty(i),this._emit({...this._config,feeds:s})}_optionsChanged(t){if(t.stopPropagation(),!this._config)return;const e=t.detail.value;this._emit(this._pruneEmpty({...this._config,...e}))}_addFeed(){this._config&&this._emit({...this._config,feeds:[...this._config.feeds??[],{url:""}]})}_removeFeed(t){if(!this._config)return;const e=(this._config.feeds??[]).filter((e,i)=>i!==t);this._emit({...this._config,feeds:e})}_pruneEmpty(t){const e={...t};for(const t of Object.keys(e))""!==e[t]&&void 0!==e[t]&&null!==e[t]||delete e[t];return e}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t},bubbles:!0,composed:!0}))}static{this.styles=n`
    :host {
      display: block;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 16px 0 8px;
    }

    .section-title:first-child {
      margin-top: 0;
    }

    .feed-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      margin-bottom: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
    }

    .feed-row ha-form {
      flex: 1;
      min-width: 0;
    }

    button.remove,
    button.add {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px;
      border-radius: 6px;
      font-size: 14px;
    }

    button.remove:hover:not([disabled]),
    button.add:hover {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    button.remove[disabled] {
      opacity: 0.3;
      cursor: default;
    }

    button.add {
      color: var(--primary-color);
      font-weight: 500;
      padding: 8px 12px;
    }
  `}}t([dt({attribute:!1})],kt.prototype,"hass",void 0),t([pt()],kt.prototype,"_config",void 0),_t("rss-newsreader-card-editor",kt);class St extends at{constructor(){super(...arguments),this._feeds=[],this._loading=!0,this._fetchError=null,this._view="list",this._article=null,this._articleLoading=!1,this._articleError=null,this._now=Date.now(),this._lastFetch=0,this._fetchedOnce=!1,this._listScrollTop=0,this._onVisibility=()=>{!document.hidden&&this._isStale()&&this._fetchFeeds()}}static getConfigElement(){return document.createElement("rss-newsreader-card-editor")}static getStubConfig(){return{feeds:[{url:"https://www.home-assistant.io/atom.xml"}]}}setConfig(t){if(!t.feeds||!Array.isArray(t.feeds)||!t.feeds.length)throw new Error("You need to configure at least one feed (feeds:)");for(const e of t.feeds)if(e.url&&!/^https?:\/\//.test(e.url))throw new Error(`Feed urls must start with http(s):// (got: ${e.url})`);this._config=t,this._fetchedOnce=!1,this._view="list",this._startTimers()}getCardSize(){return this._config?.height?Math.ceil(this._config.height/50):6}getGridOptions(){return{columns:12,rows:6,min_rows:3,min_columns:6}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibility),this._startTimers(),this._fetchedOnce&&this._isStale()&&this._fetchFeeds()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibility),this._stopTimers()}updated(t){super.updated(t),!this._fetchedOnce&&this.hass&&this._config&&(this._fetchedOnce=!0,this._fetchFeeds())}render(){if(!this._config)return V;const t=this._config.height,e=t?`height: ${t}px;`:"max-height: 480px;";return B`
      <ha-card>
        ${this._config.title?B`<h1 class="card-header">${this._config.title}</h1>`:V}
        <div class="container" style=${e}>
          ${"article"===this._view&&this._active?this._renderArticle():this._renderList()}
        </div>
      </ha-card>
    `}_renderList(){if(this._loading)return B`<div class="list">
        ${[1,2,3,4,5].map(()=>B`
            <div class="skeleton-row">
              <div style="flex:1">
                <div class="skeleton title-line"></div>
                <div class="skeleton meta-line"></div>
              </div>
            </div>
          `)}
      </div>`;const t=this._feeds.filter(t=>"error"===t.status),e=this._mergedEntries();return this._fetchError&&!e.length?this._renderEmpty("mdi:alert-circle-outline",this._fetchError):t.length&&!e.length?this._renderEmpty("mdi:rss-off",`All feeds failed: ${t.map(t=>t.error?.message??ft(t.url)).join("; ")}`):e.length?B`
      <div class="list" @entry-selected=${this._onEntrySelected}>
        ${t.map(t=>B`
            <div class="feed-error-chip" title=${t.error?.message??""}>
              <ha-icon icon="mdi:alert-outline"></ha-icon>
              ${ft(t.url)} failed
            </div>
          `)}
        ${e.map(t=>B`
            <rss-newsreader-headline
              .item=${t}
              .now=${this._now}
              .language=${this.hass?.locale?.language??"en"}
              .showImage=${!1!==this._config.show_images}
            ></rss-newsreader-headline>
          `)}
      </div>
    `:this._renderEmpty("mdi:rss",this._validFeedUrls().length?"No articles in these feeds yet.":"Add a feed URL to get started.")}_renderArticle(){return B`
      <rss-newsreader-article
        .item=${this._active}
        .article=${this._article}
        .articleLoading=${this._articleLoading}
        .articleError=${this._articleError}
        .showImages=${!1!==this._config.show_images}
        .openLinks=${this._config.open_links??"new_tab"}
        .language=${this.hass?.locale?.language??"en"}
        @back=${this._onBack}
      ></rss-newsreader-article>
    `}_renderEmpty(t,e){return B`
      <div class="empty">
        <ha-icon icon=${t}></ha-icon>
        <div>${e}</div>
      </div>
    `}_mergedEntries(){if(!this._config)return[];const t=new Map(this._config.feeds.map((t,e)=>[t.url,e])),e=[];for(const t of this._feeds){if("ok"!==t.status)continue;const i=this._config.feeds.find(e=>e.url===t.url)??{url:t.url};for(const s of t.entries)e.push({entry:s,feed:t,feedConfig:i})}e.sort((e,i)=>{const s=e.entry.published?Date.parse(e.entry.published):NaN,r=i.entry.published?Date.parse(i.entry.published):NaN;return Number.isNaN(s)&&Number.isNaN(r)?(t.get(e.feed.url)??0)-(t.get(i.feed.url)??0):Number.isNaN(s)?1:Number.isNaN(r)?-1:r-s});const i=new Set;return e.filter(t=>{const e=t.entry.link??t.entry.id;return!i.has(e)&&(i.add(e),!0)}).slice(0,this._config.max_items??30)}_validFeedUrls(){return(this._config?.feeds??[]).map(t=>t.url).filter(t=>/^https?:\/\//.test(t))}async _fetchFeeds(){if(!this.hass||!this._config)return;this._lastFetch=Date.now();const t=this._validFeedUrls();if(!t.length)return this._feeds=[],void(this._loading=!1);const e=this._config.max_items??30;try{const i=await function(t,e,i,s=!1){return t.connection.sendMessagePromise({type:"rss_newsreader/fetch_feeds",urls:e,max_items_per_feed:i,force_refresh:s})}(this.hass,t,Math.min(50,e));this._feeds=i.feeds,this._fetchError=null}catch(t){this._fetchError=t.message??String(t)}finally{this._loading=!1}}_onEntrySelected(t){const e=this.renderRoot.querySelector(".list");this._listScrollTop=e?.scrollTop??0;const i=t.detail.item;this._active=i,this._article=null,this._articleError=null,this._view="article",i.feedConfig.full_content&&i.entry.link&&this._loadArticle(i.entry.link)}async _loadArticle(t){if(this.hass){this._articleLoading=!0;try{const e=await function(t,e){return t.connection.sendMessagePromise({type:"rss_newsreader/fetch_article",url:e})}(this.hass,t);this._active?.entry.link===t&&(this._article=e)}catch(e){this._active?.entry.link===t&&(this._articleError=e.message??String(e))}finally{this._articleLoading=!1}}}async _onBack(){this._view="list",this._active=void 0,await this.updateComplete;const t=this.renderRoot.querySelector(".list");t&&(t.scrollTop=this._listScrollTop)}_isStale(){return Date.now()-this._lastFetch>this._refreshIntervalMs()}_refreshIntervalMs(){return 1e3*Math.max(300,this._config?.refresh_interval??900)}_startTimers(){this._stopTimers(),this._config&&(this._pollTimer=setInterval(()=>{document.hidden||this._fetchFeeds()},this._refreshIntervalMs()),this._tickTimer=setInterval(()=>{this._now=Date.now()},6e4))}_stopTimers(){this._pollTimer&&(clearInterval(this._pollTimer),this._pollTimer=void 0),this._tickTimer&&(clearInterval(this._tickTimer),this._tickTimer=void 0)}static{this.styles=[mt,n`
      ha-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      .card-header {
        padding: 12px 16px 4px;
        margin: 0;
        font-size: var(--ha-card-header-font-size, 24px);
        font-weight: 400;
        line-height: 1.2;
        color: var(--ha-card-header-color, var(--primary-text-color));
      }

      .container {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
      }

      .list {
        flex: 1;
        overflow-y: auto;
        min-height: 0;
      }

      rss-newsreader-headline:last-child::part(row),
      .list > rss-newsreader-headline:last-of-type {
        border-bottom: none;
      }

      .feed-error-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 8px 16px 0;
        padding: 4px 10px;
        border-radius: 12px;
        background: var(--warning-color, #b7791f);
        color: var(--text-primary-color, #fff);
        font-size: 12px;
        width: fit-content;
      }

      .feed-error-chip ha-icon {
        --mdc-icon-size: 14px;
      }

      .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 32px 16px;
        color: var(--secondary-text-color);
        font-size: 14px;
        text-align: center;
      }

      .empty ha-icon {
        --mdc-icon-size: 36px;
      }

      .skeleton-row {
        display: flex;
        padding: 12px 16px;
        border-bottom: 1px solid var(--divider-color);
      }

      .skeleton.title-line {
        height: 14px;
        width: 85%;
        margin-bottom: 8px;
      }

      .skeleton.meta-line {
        height: 10px;
        width: 40%;
      }
    `]}}t([dt({attribute:!1})],St.prototype,"hass",void 0),t([pt()],St.prototype,"_config",void 0),t([pt()],St.prototype,"_feeds",void 0),t([pt()],St.prototype,"_loading",void 0),t([pt()],St.prototype,"_fetchError",void 0),t([pt()],St.prototype,"_view",void 0),t([pt()],St.prototype,"_active",void 0),t([pt()],St.prototype,"_article",void 0),t([pt()],St.prototype,"_articleLoading",void 0),t([pt()],St.prototype,"_articleError",void 0),t([pt()],St.prototype,"_now",void 0),_t("rss-newsreader-card",St),window.customCards=window.customCards||[],window.customCards.push({type:"rss-newsreader-card",name:"RSS Newsreader Card",description:"Scrollable headlines from multiple RSS/Atom feeds with in-card article reading.",preview:!0,documentationURL:"https://github.com/johnbr/ha-rss-newsreader-card"}),console.info("%c RSS-NEWSREADER-CARD %c loaded ","color: white; background: #039be5; font-weight: 700;","color: #039be5; background: white; font-weight: 700;");export{St as RssNewsreaderCard};
