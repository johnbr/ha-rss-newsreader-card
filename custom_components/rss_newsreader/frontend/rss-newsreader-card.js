function e(e,t,i,s){var r,o=arguments.length,n=o<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(e,t,i,s);else for(var a=e.length-1;a>=0;a--)(r=e[a])&&(n=(o<3?r(n):o>3?r(t,i,n):r(t,i))||n);return o>3&&n&&Object.defineProperty(t,i,n),n}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),r=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=r.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(t,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new o(i,e,s)},a=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,s))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,_=m?m.emptyScript:"",g=f.reactiveElementPolyfillSupport,v=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},$=(e,t)=>!l(e,t),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=b){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&c(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const o=s?.call(this);r?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??b}static _$Ei(){if(this.hasOwnProperty(v("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(v("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(v("properties"))){const e=this.properties,t=[...d(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(a(e))}else void 0!==e&&t.push(a(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,s)=>{if(i)e.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=i.cssText,e.appendChild(s)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=s;const o=r.fromAttribute(t,e.type);this[s]=o??this._$Ej?.get(s)??o,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(void 0!==e){const o=this.constructor;if(!1===s&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??$)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==r||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[v("elementProperties")]=new Map,w[v("finalized")]=new Map,g?.({ReactiveElement:w}),(f.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=e=>e,E=x.trustedTypes,k=E?E.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,T="?"+C,N=`<${T}>`,P=document,O=()=>P.createComment(""),U=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,R="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,F=/-->/g,H=/>/g,z=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,I=/"/g,j=/^(?:script|style|textarea|title)$/i,B=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),q=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),W=new WeakMap,J=P.createTreeWalker(P,129);function K(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(t):t}const Y=(e,t)=>{const i=e.length-1,s=[];let r,o=2===t?"<svg>":3===t?"<math>":"",n=L;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,h=0;for(;h<i.length&&(n.lastIndex=h,l=n.exec(i),null!==l);)h=n.lastIndex,n===L?"!--"===l[1]?n=F:void 0!==l[1]?n=H:void 0!==l[2]?(j.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=z):void 0!==l[3]&&(n=z):n===z?">"===l[0]?(n=r??L,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?z:'"'===l[3]?I:D):n===I||n===D?n=z:n===F||n===H?n=L:(n=z,r=void 0);const d=n===z&&e[t+1].startsWith("/>")?" ":"";o+=n===L?i+N:c>=0?(s.push(a),i.slice(0,c)+S+i.slice(c)+C+d):i+C+(-2===c?t:d)}return[K(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Z{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0;const n=e.length-1,a=this.parts,[l,c]=Y(e,t);if(this.el=Z.createElement(l,i),J.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=J.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(S)){const t=c[o++],i=s.getAttribute(e).split(C),n=/([.?@])?(.*)/.exec(t);a.push({type:1,index:r,name:n[2],strings:i,ctor:"."===n[1]?te:"?"===n[1]?ie:"@"===n[1]?se:ee}),s.removeAttribute(e)}else e.startsWith(C)&&(a.push({type:6,index:r}),s.removeAttribute(e));if(j.test(s.tagName)){const e=s.textContent.split(C),t=e.length-1;if(t>0){s.textContent=E?E.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],O()),J.nextNode(),a.push({type:2,index:++r});s.append(e[t],O())}}}else if(8===s.nodeType)if(s.data===T)a.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(C,e+1));)a.push({type:7,index:r}),e+=C.length-1}r++}}static createElement(e,t){const i=P.createElement("template");return i.innerHTML=e,i}}function G(e,t,i=e,s){if(t===q)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const o=U(t)?void 0:t._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(e),r._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=G(e,r._$AS(e,t.values),r,s)),t}class Q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??P).importNode(t,!0);J.currentNode=s;let r=J.nextNode(),o=0,n=0,a=i[0];for(;void 0!==a;){if(o===a.index){let t;2===a.type?t=new X(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new re(r,this,e)),this._$AV.push(t),a=i[++n]}o!==a?.index&&(r=J.nextNode(),o++)}return J.currentNode=P,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=G(this,e,t),U(e)?e===V||null==e||""===e?(this._$AH!==V&&this._$AR(),this._$AH=V):e!==this._$AH&&e!==q&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==V&&U(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new Q(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=W.get(e.strings);return void 0===t&&W.set(e.strings,t=new Z(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new X(this.O(O()),this.O(O()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=A(e).nextSibling;A(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=V,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(e,t=this,i,s){const r=this.strings;let o=!1;if(void 0===r)e=G(this,e,t,0),o=!U(e)||e!==this._$AH&&e!==q,o&&(this._$AH=e);else{const s=e;let n,a;for(e=r[0],n=0;n<r.length-1;n++)a=G(this,s[i+n],t,n),a===q&&(a=this._$AH[n]),o||=!U(a)||a!==this._$AH[n],a===V?e=V:e!==V&&(e+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!s&&this.j(e)}j(e){e===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===V?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==V)}}class se extends ee{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=G(this,e,t,0)??V)===q)return;const i=this._$AH,s=e===V&&i!==V||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==V&&(i===V||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){G(this,e)}}const oe=x.litHtmlPolyfillSupport;oe?.(Z,X),(x.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;let ae=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=i?.renderBefore??null;s._$litPart$=r=new X(t.insertBefore(O(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}};ae._$litElement$=!0,ae.finalized=!0,ne.litElementHydrateSupport?.({LitElement:ae});const le=ne.litElementPolyfillSupport;le?.({LitElement:ae}),(ne.litElementVersions??=[]).push("4.2.2");const ce={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},he=(e=ce,t,i)=>{const{kind:s,metadata:r}=i;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===s&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===s){const{name:s}=i;return{set(i){const r=t.get.call(this);t.set.call(this,i),this.requestUpdate(s,r,e,!0,i)},init(t){return void 0!==t&&this.C(s,void 0,e,t),t}}}if("setter"===s){const{name:s}=i;return function(i){const r=this[s];t.call(this,i),this.requestUpdate(s,r,e,!0,i)}}throw Error("Unsupported decorator location: "+s)};function de(e){return(t,i)=>"object"==typeof i?he(e,t,i):((e,t,i)=>{const s=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),s?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function pe(e){return de({...e,state:!0,attribute:!1})}const ue=[["year",31536e3],["month",2592e3],["week",604800],["day",86400],["hour",3600],["minute",60]];function fe(e,t){return e.name||t?.feed_title||me(e.url)}function me(e){if(!e)return"";try{return new URL(e).hostname.replace(/^www\./,"")}catch{return e}}const _e=n`
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
`;function ge(e,t){customElements.get(e)||customElements.define(e,t)}class ve extends ae{constructor(){super(...arguments),this.showImage=!1,this.now=Date.now(),this.language="en",this._iconFailed=!1}render(){const{entry:e,feed:t,feedConfig:i}=this.item,s=fe(i,t),r=function(e,t="en",i=Date.now()){if(!e)return"";const s=Date.parse(e);if(Number.isNaN(s))return"";const r=(s-i)/1e3,o=Math.abs(r);let n;try{n=new Intl.RelativeTimeFormat(t,{numeric:"auto"})}catch{n=new Intl.RelativeTimeFormat("en",{numeric:"auto"})}for(const[e,t]of ue)if(o>=t)return n.format(Math.round(r/t),e);return n.format(Math.round(r),"second")}(e.published,this.language,this.now),o=i.color;return B`
      <div
        class="row"
        role="button"
        tabindex="0"
        @click=${this._select}
        @keydown=${this._keydown}
      >
        <div class="text">
          <div class="title">${e.title}</div>
          <div class="meta">
            <span
              class="badge"
              style=${o?`--badge-color: ${o}`:""}
            >
              ${t.feed_icon&&!this._iconFailed?B`<img
                    src=${t.feed_icon}
                    alt=""
                    @error=${()=>this._iconFailed=!0}
                  />`:s.slice(0,1)}
            </span>
            <span class="source">${s}</span>
            ${r?B`<span>·</span><span>${r}</span>`:V}
          </div>
        </div>
        ${this.showImage&&e.image_url?B`<img
              class="thumb"
              src=${e.image_url}
              alt=""
              loading="lazy"
              @error=${this._hideThumb}
            />`:V}
      </div>
    `}_select(){this.dispatchEvent(new CustomEvent("entry-selected",{detail:{item:this.item},bubbles:!0,composed:!0}))}_keydown(e){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._select())}_hideThumb(e){e.target.style.display="none"}static{this.styles=[_e,n`
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
    `]}}e([de({attribute:!1})],ve.prototype,"item",void 0),e([de({type:Boolean})],ve.prototype,"showImage",void 0),e([de({type:Number})],ve.prototype,"now",void 0),e([de()],ve.prototype,"language",void 0),e([pe()],ve.prototype,"_iconFailed",void 0),ge("rss-newsreader-headline",ve);const ye=2;class $e{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}}class be extends $e{constructor(e){if(super(e),this.it=V,e.type!==ye)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===V||null==e)return this._t=void 0,this.it=e;if(e===q)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");if(e===this.it)return this._t;this.it=e;const t=[e];return t.raw=t,this._t={_$litType$:this.constructor.resultType,strings:t,values:[]}}}be.directiveName="unsafeHTML",be.resultType=1;const we=(e=>(...t)=>({_$litDirective$:e,values:t}))(be);class xe extends ae{constructor(){super(...arguments),this.article=null,this.articleLoading=!1,this.articleError=null,this.showImages=!0,this.openLinks="new_tab",this.language="en"}render(){const{entry:e,feed:t,feedConfig:i}=this.item,s=i.name||t.feed_title||me(t.url),r=this.article?.title||e.title,o=this.article?.content_html||e.content_html||e.summary_html||"",n=this.article?.image_url||e.image_url,a=function(e){if(!e)return null;try{const t=new URL(e);return"http:"===t.protocol||"https:"===t.protocol?t.href:null}catch{return null}}(e.link),l=this.showImages&&n&&!o.includes("<img");return B`
      <div class="toolbar">
        <button
          class="icon-btn"
          aria-label="Back to headlines"
          @click=${this._back}
        >
          <ha-icon icon="mdi:arrow-left"></ha-icon>
        </button>
        <span class="toolbar-source">${s}</span>
        ${a?B`<a
              class="icon-btn ext"
              href=${a}
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
          ${e.author?B`<span>${e.author}</span><span>·</span>`:V}
          <span>${function(e,t="en"){if(!e)return"";const i=Date.parse(e);if(Number.isNaN(i))return"";try{return new Intl.DateTimeFormat(t,{dateStyle:"medium",timeStyle:"short"}).format(i)}catch{return new Date(i).toLocaleString()}}(e.published,this.language)}</span>
        </div>
        ${l?B`<img
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
              ${we(o)}
            </div>`:this.articleLoading?V:B`<div class="loading-note">
                This feed doesn't include article text.
              </div>`}
        ${a?B`<a
              class="read-more"
              href=${a}
              target=${"same_tab"===this.openLinks?"_self":"_blank"}
              rel="noopener noreferrer"
              >Read on ${me(a)}</a
            >`:V}
      </div>
    `}_back(){this.dispatchEvent(new CustomEvent("back",{bubbles:!0,composed:!0}))}_hideImage(e){e.target.style.display="none"}_contentClick(e){if("same_tab"!==this.openLinks)return;const t=e.composedPath().find(e=>"A"===e.tagName);t?.href&&(e.preventDefault(),window.location.href=t.href)}static{this.styles=[_e,n`
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
    `]}}e([de({attribute:!1})],xe.prototype,"item",void 0),e([de({attribute:!1})],xe.prototype,"article",void 0),e([de({type:Boolean})],xe.prototype,"articleLoading",void 0),e([de()],xe.prototype,"articleError",void 0),e([de({type:Boolean})],xe.prototype,"showImages",void 0),e([de()],xe.prototype,"openLinks",void 0),e([de()],xe.prototype,"language",void 0),ge("rss-newsreader-article",xe);const Ae={title:"Title",refresh_interval:"Refresh interval",max_items:"Max headlines",height:"Card height",show_images:"Show images",open_links:"Open links in",show_feed_filter:"Show feed picker",url:"Feed URL",name:"Display name",color:"Accent color",full_content:"Fetch full article text when opened"},Ee=[{name:"title",selector:{text:{}}},{type:"grid",name:"",schema:[{name:"refresh_interval",selector:{number:{min:300,max:86400,step:60,mode:"box",unit_of_measurement:"s"}}},{name:"max_items",selector:{number:{min:1,max:100,mode:"box"}}},{name:"height",selector:{number:{min:150,max:2e3,step:10,mode:"box",unit_of_measurement:"px"}}},{name:"show_images",selector:{boolean:{}}},{name:"show_feed_filter",selector:{boolean:{}}},{name:"open_links",selector:{select:{mode:"dropdown",options:[{value:"new_tab",label:"New tab"},{value:"same_tab",label:"Same tab"}]}}}]}],ke=[{name:"url",required:!0,selector:{text:{type:"url"}}},{type:"grid",name:"",schema:[{name:"name",selector:{text:{}}},{name:"color",selector:{text:{prefix:"#"}}}]},{name:"full_content",selector:{boolean:{}}}];class Se extends ae{constructor(){super(...arguments),this._computeLabel=e=>Ae[e.name]??e.name}setConfig(e){this._config=e}connectedCallback(){super.connectedCallback(),this._ensureComponents()}async _ensureComponents(){if(customElements.get("ha-form"))return;const e=await(window.loadCardHelpers?.());if(!e)return;const t=await e.createCardElement({type:"entities",entities:[]});await(t?.constructor?.getConfigElement?.()),this.requestUpdate()}render(){if(!this._config||!this.hass)return V;const e=this._config.feeds??[];return B`
      <div class="section-title">Feeds</div>
      ${e.map((t,i)=>B`
          <div class="feed-row">
            <ha-form
              .hass=${this.hass}
              .data=${t}
              .schema=${ke}
              .computeLabel=${this._computeLabel}
              @value-changed=${e=>this._feedChanged(i,e)}
            ></ha-form>
            <button
              class="remove"
              title="Remove feed"
              ?disabled=${1===e.length}
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
        .schema=${Ee}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._optionsChanged}
      ></ha-form>
    `}_feedChanged(e,t){if(t.stopPropagation(),!this._config)return;const i=t.detail.value,s=[...this._config.feeds??[]];s[e]=this._pruneEmpty(i),this._emit({...this._config,feeds:s})}_optionsChanged(e){if(e.stopPropagation(),!this._config)return;const t=e.detail.value;this._emit(this._pruneEmpty({...this._config,...t}))}_addFeed(){this._config&&this._emit({...this._config,feeds:[...this._config.feeds??[],{url:""}]})}_removeFeed(e){if(!this._config)return;const t=(this._config.feeds??[]).filter((t,i)=>i!==e);this._emit({...this._config,feeds:t})}_pruneEmpty(e){const t={...e};for(const e of Object.keys(t))""!==t[e]&&void 0!==t[e]&&null!==t[e]||delete t[e];return t}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}static{this.styles=n`
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
  `}}e([de({attribute:!1})],Se.prototype,"hass",void 0),e([pe()],Se.prototype,"_config",void 0),ge("rss-newsreader-card-editor",Se);class Ce extends ae{constructor(){super(...arguments),this._feeds=[],this._loading=!0,this._fetchError=null,this._view="list",this._article=null,this._articleLoading=!1,this._articleError=null,this._now=Date.now(),this._feedFilter=null,this._lastFetch=0,this._fetchedOnce=!1,this._listScrollTop=0,this._onVisibility=()=>{!document.hidden&&this._isStale()&&this._fetchFeeds()}}static getConfigElement(){return document.createElement("rss-newsreader-card-editor")}static getStubConfig(){return{feeds:[{url:"https://www.home-assistant.io/atom.xml"}]}}setConfig(e){if(!e.feeds||!Array.isArray(e.feeds)||!e.feeds.length)throw new Error("You need to configure at least one feed (feeds:)");for(const t of e.feeds)if(t.url&&!/^https?:\/\//.test(t.url))throw new Error(`Feed urls must start with http(s):// (got: ${t.url})`);this._config=e,this._feedFilter&&!this._validFeedUrls().includes(this._feedFilter)&&(this._feedFilter=null),this._fetchedOnce=!1,this._view="list",this._startTimers()}getCardSize(){return this._config?.height?Math.ceil(this._config.height/50):6}getGridOptions(){return{columns:12,rows:6,min_rows:3,min_columns:6}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._onVisibility),this._startTimers(),this._fetchedOnce&&this._isStale()&&this._fetchFeeds()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._onVisibility),this._stopTimers()}updated(e){super.updated(e),!this._fetchedOnce&&this.hass&&this._config&&(this._fetchedOnce=!0,this._fetchFeeds())}render(){if(!this._config)return V;const e=this._config.height,t=e?`height: ${e}px;`:"max-height: 480px;",i=this._config.title,s=this._renderFeedFilter();return B`
      <ha-card>
        ${i||s?B`<div class="header">
              ${i?B`<h1 class="card-header">${i}</h1>`:V}
              ${s}
            </div>`:V}
        <div class="container" style=${t}>
          ${"article"===this._view&&this._active?this._renderArticle():this._renderList()}
        </div>
      </ha-card>
    `}_renderFeedFilter(){if(!1===this._config?.show_feed_filter||"list"!==this._view)return V;const e=this._filterOptions();if(e.length<2)return V;const t=this._feedFilter??"";return B`
      <div class="feed-filter">
        <select
          aria-label="Show articles from"
          .value=${t}
          @change=${this._onFeedFilterChanged}
        >
          <option value="" ?selected=${""===t}>All feeds</option>
          ${e.map(e=>B`<option
              value=${e.url}
              ?selected=${t===e.url}
            >
              ${e.label}
            </option>`)}
        </select>
        <ha-icon icon="mdi:menu-down"></ha-icon>
      </div>
    `}_filterOptions(){const e=new Set,t=[];for(const i of this._config?.feeds??[]){if(!/^https?:\/\//.test(i.url)||e.has(i.url))continue;e.add(i.url);const s=this._feeds.find(e=>e.url===i.url);t.push({url:i.url,label:fe(i,s)})}return t}_onFeedFilterChanged(e){this._feedFilter=e.target.value||null,this._listScrollTop=0;const t=this.renderRoot.querySelector(".list");t&&(t.scrollTop=0)}_renderList(){if(this._loading)return B`<div class="list">
        ${[1,2,3,4,5].map(()=>B`
            <div class="skeleton-row">
              <div style="flex:1">
                <div class="skeleton title-line"></div>
                <div class="skeleton meta-line"></div>
              </div>
            </div>
          `)}
      </div>`;const e=this._feedFilter,t=this._feeds.filter(t=>"error"===t.status&&(!e||t.url===e)),i=this._mergedEntries();return this._fetchError&&!i.length?this._renderEmpty("mdi:alert-circle-outline",this._fetchError):e&&t.length&&!i.length?this._renderEmpty("mdi:rss-off",`${this._filterLabel(e)} failed: ${t[0].error?.message??me(e)}`):t.length&&!i.length?this._renderEmpty("mdi:rss-off",`All feeds failed: ${t.map(e=>e.error?.message??me(e.url)).join("; ")}`):i.length?B`
      <div class="list" @entry-selected=${this._onEntrySelected}>
        ${t.map(e=>B`
            <div class="feed-error-chip" title=${e.error?.message??""}>
              <ha-icon icon="mdi:alert-outline"></ha-icon>
              ${me(e.url)} failed
            </div>
          `)}
        ${i.map(e=>B`
            <rss-newsreader-headline
              .item=${e}
              .now=${this._now}
              .language=${this.hass?.locale?.language??"en"}
              .showImage=${!1!==this._config.show_images}
            ></rss-newsreader-headline>
          `)}
      </div>
    `:this._renderEmpty("mdi:rss",e?"No articles in this feed yet.":this._validFeedUrls().length?"No articles in these feeds yet.":"Add a feed URL to get started.")}_filterLabel(e){return this._filterOptions().find(t=>t.url===e)?.label??me(e)}_renderArticle(){return B`
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
    `}_renderEmpty(e,t){return B`
      <div class="empty">
        <ha-icon icon=${e}></ha-icon>
        <div>${t}</div>
      </div>
    `}_mergedEntries(){if(!this._config)return[];const e=new Map(this._config.feeds.map((e,t)=>[e.url,t])),t=[];for(const e of this._feeds){if("ok"!==e.status||this._feedFilter&&e.url!==this._feedFilter)continue;const i=this._config.feeds.find(t=>t.url===e.url)??{url:e.url};for(const s of e.entries)t.push({entry:s,feed:e,feedConfig:i})}t.sort((t,i)=>{const s=t.entry.published?Date.parse(t.entry.published):NaN,r=i.entry.published?Date.parse(i.entry.published):NaN;return Number.isNaN(s)&&Number.isNaN(r)?(e.get(t.feed.url)??0)-(e.get(i.feed.url)??0):Number.isNaN(s)?1:Number.isNaN(r)?-1:r-s});const i=new Set;return t.filter(e=>{const t=e.entry.link??e.entry.id;return!i.has(t)&&(i.add(t),!0)}).slice(0,this._config.max_items??30)}_validFeedUrls(){return(this._config?.feeds??[]).map(e=>e.url).filter(e=>/^https?:\/\//.test(e))}async _fetchFeeds(){if(!this.hass||!this._config)return;this._lastFetch=Date.now();const e=this._validFeedUrls();if(!e.length)return this._feeds=[],void(this._loading=!1);const t=this._config.max_items??30;try{const i=await function(e,t,i,s=!1){return e.connection.sendMessagePromise({type:"rss_newsreader/fetch_feeds",urls:t,max_items_per_feed:i,force_refresh:s})}(this.hass,e,Math.min(50,t));this._feeds=i.feeds,this._fetchError=null}catch(e){this._fetchError=e.message??String(e)}finally{this._loading=!1}}_onEntrySelected(e){const t=this.renderRoot.querySelector(".list");this._listScrollTop=t?.scrollTop??0;const i=e.detail.item;this._active=i,this._article=null,this._articleError=null,this._view="article",i.feedConfig.full_content&&i.entry.link&&this._loadArticle(i.entry.link)}async _loadArticle(e){if(this.hass){this._articleLoading=!0;try{const t=await function(e,t){return e.connection.sendMessagePromise({type:"rss_newsreader/fetch_article",url:t})}(this.hass,e);this._active?.entry.link===e&&(this._article=t)}catch(t){this._active?.entry.link===e&&(this._articleError=t.message??String(t))}finally{this._articleLoading=!1}}}async _onBack(){this._view="list",this._active=void 0,await this.updateComplete;const e=this.renderRoot.querySelector(".list");e&&(e.scrollTop=this._listScrollTop)}_isStale(){return Date.now()-this._lastFetch>this._refreshIntervalMs()}_refreshIntervalMs(){return 1e3*Math.max(300,this._config?.refresh_interval??900)}_startTimers(){this._stopTimers(),this._config&&(this._pollTimer=setInterval(()=>{document.hidden||this._fetchFeeds()},this._refreshIntervalMs()),this._tickTimer=setInterval(()=>{this._now=Date.now()},6e4))}_stopTimers(){this._pollTimer&&(clearInterval(this._pollTimer),this._pollTimer=void 0),this._tickTimer&&(clearInterval(this._tickTimer),this._tickTimer=void 0)}static{this.styles=[_e,n`
      ha-card {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      .header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 12px;
        padding: 12px 16px 4px;
      }

      /* A title too long to share the row pushes the picker onto its own */
      .card-header {
        flex: 1 1 auto;
        min-width: 0;
        padding: 0;
        margin: 0;
        font-size: var(--ha-card-header-font-size, 24px);
        font-weight: 400;
        line-height: 1.2;
        color: var(--ha-card-header-color, var(--primary-text-color));
      }

      .feed-filter {
        position: relative;
        flex-shrink: 1;
        min-width: 0;
        max-width: 60%;
        margin-left: auto;
      }

      .feed-filter select {
        appearance: none;
        -webkit-appearance: none;
        box-sizing: border-box;
        width: 100%;
        min-width: 120px;
        padding: 6px 30px 6px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        background: var(--card-background-color, var(--ha-card-background));
        color: var(--primary-text-color);
        font: inherit;
        font-size: 14px;
        line-height: 1.3;
        text-overflow: ellipsis;
        cursor: pointer;
      }

      .feed-filter select:hover {
        border-color: var(--secondary-text-color);
      }

      .feed-filter select:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 1px;
      }

      .feed-filter option {
        background: var(--card-background-color, var(--ha-card-background));
        color: var(--primary-text-color);
      }

      .feed-filter ha-icon {
        position: absolute;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
        pointer-events: none;
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
    `]}}e([de({attribute:!1})],Ce.prototype,"hass",void 0),e([pe()],Ce.prototype,"_config",void 0),e([pe()],Ce.prototype,"_feeds",void 0),e([pe()],Ce.prototype,"_loading",void 0),e([pe()],Ce.prototype,"_fetchError",void 0),e([pe()],Ce.prototype,"_view",void 0),e([pe()],Ce.prototype,"_active",void 0),e([pe()],Ce.prototype,"_article",void 0),e([pe()],Ce.prototype,"_articleLoading",void 0),e([pe()],Ce.prototype,"_articleError",void 0),e([pe()],Ce.prototype,"_now",void 0),e([pe()],Ce.prototype,"_feedFilter",void 0),ge("rss-newsreader-card",Ce),window.customCards=window.customCards||[],window.customCards.push({type:"rss-newsreader-card",name:"RSS Newsreader Card",description:"Scrollable headlines from multiple RSS/Atom feeds with in-card article reading.",preview:!0,documentationURL:"https://github.com/johnbr/ha-rss-newsreader-card"}),console.info("%c RSS-NEWSREADER-CARD %c loaded ","color: white; background: #039be5; font-weight: 700;","color: #039be5; background: white; font-weight: 700;");export{Ce as RssNewsreaderCard};
