'use strict';

var y=Object.defineProperty;var C=(a,e,t)=>e in a?y(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var s=(a,e,t)=>C(a,typeof e!="symbol"?e+"":e,t);var o=class extends Error{constructor(t,n=""){super(n);s(this,"name","");s(this,"description","");this.name=t,this.description=n;}};var d=class{constructor(e,t={type:"To"}){s(this,"reSpecCompliantAddr",/(([^<>\r\n]+)\s)?<[^\r\n]+>/);s(this,"name","");s(this,"addr","");s(this,"type","To");this.type=t.type,this.parse(e);}getAddrDomain(){if(this.addr.includes("@")){let e=this.addr.split("@");if(e.length>1)return e[1]}return ""}dump(){return this.name.length>0?`"${this.name}" <${this.addr}>`:`<${this.addr}>`}parse(e){if(this.isMailboxAddrObject(e))return this.addr=e.addr,typeof e.name=="string"&&(this.name=e.name),typeof e.type=="string"&&(this.type=e.type),this;if(this.isMailboxAddrText(e)){let t=e.trim();if(t.startsWith("<")&&t.endsWith(">"))return this.addr=t.slice(1,-1),this;let n=t.split(" <");return n[0]=/^("|')/.test(n[0])?n[0].slice(1):n[0],n[0]=/("|')$/.test(n[0])?n[0].slice(0,-1):n[0],n[1]=n[1].slice(0,-1),this.name=n[0],this.addr=n[1],this}if(typeof e=="string")return this.addr=e,this;throw new o("MIMETEXT_INVALID_MAILBOX","Couldn't recognize the input.")}isMailboxAddrText(e){return typeof e=="string"&&this.reSpecCompliantAddr.test(e)}isMailboxAddrObject(e){return this.isObject(e)&&Object.hasOwn(e,"addr")}isObject(e){return !!e&&e.constructor===Object}};var c=class{constructor(e){s(this,"envctx");s(this,"fields",[{name:"Date",generator:()=>new Date().toUTCString().replace(/GMT|UTC/gi,"+0000")},{name:"From",required:!0,validate:e=>this.validateMailboxSingle(e),dump:e=>this.dumpMailboxSingle(e)},{name:"Sender",validate:e=>this.validateMailboxSingle(e),dump:e=>this.dumpMailboxSingle(e)},{name:"Reply-To",validate:e=>this.validateMailboxSingle(e),dump:e=>this.dumpMailboxSingle(e)},{name:"To",validate:e=>this.validateMailboxMulti(e),dump:e=>this.dumpMailboxMulti(e)},{name:"Cc",validate:e=>this.validateMailboxMulti(e),dump:e=>this.dumpMailboxMulti(e)},{name:"Bcc",validate:e=>this.validateMailboxMulti(e),dump:e=>this.dumpMailboxMulti(e)},{name:"Message-ID",generator:()=>{let e=Math.random().toString(36).slice(2),n=this.fields.filter(i=>i.name==="From")[0].value.getAddrDomain();return "<"+e+"@"+n+">"}},{name:"Subject",required:!0,dump:e=>typeof e=="string"?"=?utf-8?B?"+this.envctx.toBase64(e)+"?=":""},{name:"MIME-Version",generator:()=>"1.0"}]);this.envctx=e;}dump(){let e="";for(let t of this.fields){if(t.disabled)continue;let n=t.value!==void 0&&t.value!==null;if(!n&&t.required)throw new o("MIMETEXT_MISSING_HEADER",`The "${t.name}" header is required.`);if(!n&&typeof t.generator!="function")continue;!n&&typeof t.generator=="function"&&(t.value=t.generator());let i=Object.hasOwn(t,"dump")&&typeof t.dump=="function"?t.dump(t.value):typeof t.value=="string"?t.value:"";e+=`${t.name}: ${i}${this.envctx.eol}`;}return e.slice(0,-1*this.envctx.eol.length)}toObject(){return this.fields.reduce((e,t)=>(e[t.name]=t.value,e),{})}get(e){let t=i=>i.name.toLowerCase()===e.toLowerCase(),n=this.fields.findIndex(t);return n!==-1?this.fields[n].value:void 0}set(e,t){let n=r=>r.name.toLowerCase()===e.toLowerCase();if(!!this.fields.some(n)){let r=this.fields.findIndex(n),l=this.fields[r];if(l.validate&&!l.validate(t))throw new o("MIMETEXT_INVALID_HEADER_VALUE",`The value for the header "${e}" is invalid.`);return this.fields[r].value=t,this.fields[r]}return this.setCustom({name:e,value:t,custom:!0,dump:r=>typeof r=="string"?r:""})}setCustom(e){if(this.isHeaderField(e)){if(typeof e.value!="string")throw new o("MIMETEXT_INVALID_HEADER_FIELD","Custom header must have a value.");return this.fields.push(e),e}throw new o("MIMETEXT_INVALID_HEADER_FIELD","Invalid input for custom header. It must be in type of HeaderField.")}validateMailboxSingle(e){return e instanceof d}validateMailboxMulti(e){return e instanceof d||this.isArrayOfMailboxes(e)}dumpMailboxMulti(e){let t=n=>n.name.length===0?n.dump():`=?utf-8?B?${this.envctx.toBase64(n.name)}?= <${n.addr}>`;return this.isArrayOfMailboxes(e)?e.map(t).join(`,${this.envctx.eol} `):e instanceof d?t(e):""}dumpMailboxSingle(e){let t=n=>n.name.length===0?n.dump():`=?utf-8?B?${this.envctx.toBase64(n.name)}?= <${n.addr}>`;return e instanceof d?t(e):""}isHeaderField(e){let t=["name","value","dump","required","disabled","generator","custom"];if(this.isObject(e)){let n=e;if(Object.hasOwn(n,"name")&&typeof n.name=="string"&&n.name.length>0&&!Object.keys(n).some(i=>!t.includes(i)))return !0}return !1}isObject(e){return !!e&&e.constructor===Object}isArrayOfMailboxes(e){return this.isArray(e)&&e.every(t=>t instanceof d)}isArray(e){return !!e&&e.constructor===Array}},x=class extends c{constructor(t){super(t);s(this,"fields",[{name:"Content-ID"},{name:"Content-Type"},{name:"Content-Transfer-Encoding"},{name:"Content-Disposition"}]);}};var g=class{constructor(e,t,n={}){s(this,"envctx");s(this,"headers");s(this,"data");this.envctx=e,this.headers=new x(this.envctx),this.data=t,this.setHeaders(n);}dump(){let e=this.envctx.eol;return this.headers.dump()+e+e+this.data}isAttachment(){let e=this.headers.get("Content-Disposition");return typeof e=="string"&&e.includes("attachment")}isInlineAttachment(){let e=this.headers.get("Content-Disposition");return typeof e=="string"&&e.includes("inline")}setHeader(e,t){return this.headers.set(e,t),e}getHeader(e){return this.headers.get(e)}setHeaders(e){return Object.keys(e).map(t=>this.setHeader(t,e[t]))}getHeaders(){return this.headers.toObject()}};var M=class{constructor(e){s(this,"envctx");s(this,"headers");s(this,"boundaries",{mixed:"",alt:"",related:""});s(this,"validTypes",["text/html","text/plain"]);s(this,"validContentTransferEncodings",["7bit","8bit","binary","quoted-printable","base64"]);s(this,"messages",[]);this.envctx=e,this.headers=new c(this.envctx),this.messages=[],this.generateBoundaries();}asRaw(){let e=this.envctx.eol,t=this.headers.dump(),n=this.getMessageByType("text/plain"),i=this.getMessageByType("text/html"),r=i??n??void 0;if(r===void 0)throw new o("MIMETEXT_MISSING_BODY","No content added to the message.");let l=this.hasAttachments(),f=this.hasInlineAttachments(),b=f&&l?"mixed+related":l?"mixed":f?"related":n&&i?"alternative":"";if(b==="mixed+related"){let h=this.getAttachments().map(p=>"--"+this.boundaries.mixed+e+p.dump()+e+e).join("").slice(0,-1*e.length),u=this.getInlineAttachments().map(p=>"--"+this.boundaries.related+e+p.dump()+e+e).join("").slice(0,-1*e.length);return t+e+"Content-Type: multipart/mixed; boundary="+this.boundaries.mixed+e+e+"--"+this.boundaries.mixed+e+"Content-Type: multipart/related; boundary="+this.boundaries.related+e+e+this.dumpTextContent(n,i,this.boundaries.related)+e+e+u+"--"+this.boundaries.related+"--"+e+h+"--"+this.boundaries.mixed+"--"}else if(b==="mixed"){let h=this.getAttachments().map(u=>"--"+this.boundaries.mixed+e+u.dump()+e+e).join("").slice(0,-1*e.length);return t+e+"Content-Type: multipart/mixed; boundary="+this.boundaries.mixed+e+e+this.dumpTextContent(n,i,this.boundaries.mixed)+e+(n&&i?"":e)+h+"--"+this.boundaries.mixed+"--"}else if(b==="related"){let h=this.getInlineAttachments().map(u=>"--"+this.boundaries.related+e+u.dump()+e+e).join("").slice(0,-1*e.length);return t+e+"Content-Type: multipart/related; boundary="+this.boundaries.related+e+e+this.dumpTextContent(n,i,this.boundaries.related)+e+e+h+"--"+this.boundaries.related+"--"}else return b==="alternative"?t+e+"Content-Type: multipart/alternative; boundary="+this.boundaries.alt+e+e+this.dumpTextContent(n,i,this.boundaries.alt)+e+e+"--"+this.boundaries.alt+"--":t+e+r.dump()}asEncoded(){return this.envctx.toBase64WebSafe(this.asRaw())}dumpTextContent(e,t,n){let i=this.envctx.eol,r=t??e,l="";return e&&t&&(this.hasInlineAttachments()||this.hasAttachments())?l="--"+n+i+"Content-Type: multipart/alternative; boundary="+this.boundaries.alt+i+i+"--"+this.boundaries.alt+i+e.dump()+i+i+"--"+this.boundaries.alt+i+t.dump()+i+i+"--"+this.boundaries.alt+"--":e&&t?l="--"+n+i+e.dump()+i+i+"--"+n+i+t.dump():l="--"+n+i+r.dump(),l}hasInlineAttachments(){return this.messages.some(e=>e.isInlineAttachment())}hasAttachments(){return this.messages.some(e=>e.isAttachment())}getAttachments(){let e=t=>t.isAttachment();return this.messages.some(e)?this.messages.filter(e):[]}getInlineAttachments(){let e=t=>t.isInlineAttachment();return this.messages.some(e)?this.messages.filter(e):[]}getMessageByType(e){let t=n=>!n.isAttachment()&&!n.isInlineAttachment()&&(n.getHeader("Content-Type")||"").includes(e);return this.messages.some(t)?this.messages.filter(t)[0]:void 0}addAttachment(e){if(this.isObject(e.headers)||(e.headers={}),typeof e.filename!="string")throw new o("MIMETEXT_MISSING_FILENAME",'The property "filename" must exist while adding attachments.');let t=(e.headers["Content-Type"]??e.contentType)||"none";if(this.envctx.validateContentType(t)===!1)throw new o("MIMETEXT_INVALID_MESSAGE_TYPE",`You specified an invalid content type "${t}".`);let n=e.headers["Content-Transfer-Encoding"]??e.encoding??"base64";this.validContentTransferEncodings.includes(n)||(t="application/octet-stream");let i=e.headers["Content-ID"];typeof i=="string"&&i.length>2&&!i.startsWith("<")&&!i.endsWith(">")&&(e.headers["Content-ID"]="<"+e.headers["Content-ID"]+">");let r=e.inline?"inline":"attachment";return e.headers=Object.assign({},e.headers,{"Content-Type":`${t}; name="${e.filename}"`,"Content-Transfer-Encoding":n,"Content-Disposition":`${r}; filename="${e.filename}"`}),this._addMessage({data:e.data,headers:e.headers})}addMessage(e){this.isObject(e.headers)||(e.headers={});let t=(e.headers["Content-Type"]??e.contentType)||"none";if(!this.validTypes.includes(t))throw new o("MIMETEXT_INVALID_MESSAGE_TYPE",`Valid content types are ${this.validTypes.join(", ")} but you specified "${t}".`);let n=e.headers["Content-Transfer-Encoding"]??e.encoding??"7bit";this.validContentTransferEncodings.includes(n)||(t="application/octet-stream");let i=e.charset??"UTF-8";return e.headers=Object.assign({},e.headers,{"Content-Type":`${t}; charset=${i}`,"Content-Transfer-Encoding":n}),this._addMessage({data:e.data,headers:e.headers})}_addMessage(e){let t=new g(this.envctx,e.data,e.headers);return this.messages.push(t),t}setSender(e,t={type:"From"}){let n=new d(e,t);return this.setHeader("From",n),n}getSender(){return this.getHeader("From")}setRecipients(e,t={type:"To"}){let i=(this.isArray(e)?e:[e]).map(r=>new d(r,t));return this.setHeader(t.type,i),i}getRecipients(e={type:"To"}){return this.getHeader(e.type)}setRecipient(e,t={type:"To"}){return this.setRecipients(e,t)}setTo(e,t={type:"To"}){return this.setRecipients(e,t)}setCc(e,t={type:"Cc"}){return this.setRecipients(e,t)}setBcc(e,t={type:"Bcc"}){return this.setRecipients(e,t)}setSubject(e){return this.setHeader("subject",e),e}getSubject(){return this.getHeader("subject")}setHeader(e,t){return this.headers.set(e,t),e}getHeader(e){return this.headers.get(e)}setHeaders(e){return Object.keys(e).map(t=>this.setHeader(t,e[t]))}getHeaders(){return this.headers.toObject()}toBase64(e){return this.envctx.toBase64(e)}toBase64WebSafe(e){return this.envctx.toBase64WebSafe(e)}generateBoundaries(){this.boundaries={mixed:Math.random().toString(36).slice(2),alt:Math.random().toString(36).slice(2),related:Math.random().toString(36).slice(2)};}isArray(e){return !!e&&e.constructor===Array}isObject(e){return !!e&&e.constructor===Object}};var E={toBase64:function(e){return Utilities.base64Encode(e,Utilities.Charset.UTF_8)},toBase64WebSafe:function(e){return Utilities.base64EncodeWebSafe(e)},eol:`\r
`,validateContentType:a=>a.length>0?a:!1};function P(){return new M(E)}

exports.MIMEMessage = M;
exports.MIMEMessageContent = g;
exports.MIMEMessageHeader = c;
exports.MIMETextError = o;
exports.Mailbox = d;
exports.createMimeMessage = P;
//# sourceMappingURL=gas.cjs.map
//# sourceMappingURL=gas.cjs.map