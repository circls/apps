!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.card=e()}}(function(){var e,t,n;return function r(e,t,n){function i(o,u){if(!t[o]){if(!e[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(s)return s(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=t[o]={exports:{}};e[o][0].call(f.exports,function(t){var n=e[o][1][t];return i(n?n:t)},f,f.exports,r,e,t,n)}return t[o].exports}var s=typeof require=="function"&&require;for(var o=0;o<n.length;o++)i(n[o]);return i}({1:[function(e,t,n){(function(){var e,t,n,r,i,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b,w=[].slice,E=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1};e=jQuery,e.payment={},e.payment.fn={},e.fn.payment=function(){var t,n;return n=arguments[0],t=2<=arguments.length?w.call(arguments,1):[],e.payment.fn[n].apply(this,t)},i=/(\d{1,4})/g,r=[{type:"visaelectron",pattern:/^4(026|17500|405|508|844|91[37])/,format:i,length:[16],cvcLength:[3],luhn:!0},{type:"maestro",pattern:/^(5(018|0[23]|[68])|6(39|7))/,format:i,length:[12,13,14,15,16,17,18,19],cvcLength:[3],luhn:!0},{type:"forbrugsforeningen",pattern:/^600/,format:i,length:[16],cvcLength:[3],luhn:!0},{type:"dankort",pattern:/^5019/,format:i,length:[16],cvcLength:[3],luhn:!0},{type:"visa",pattern:/^4/,format:i,length:[13,16],cvcLength:[3],luhn:!0},{type:"mastercard",pattern:/^5[0-5]/,format:i,length:[16],cvcLength:[3],luhn:!0},{type:"amex",pattern:/^3[47]/,format:/(\d{1,4})(\d{1,6})?(\d{1,5})?/,length:[15],cvcLength:[3,4],luhn:!0},{type:"dinersclub",pattern:/^3[0689]/,format:i,length:[14],cvcLength:[3],luhn:!0},{type:"discover",pattern:/^6([045]|22)/,format:i,length:[16],cvcLength:[3],luhn:!0},{type:"unionpay",pattern:/^(62|88)/,format:i,length:[16,17,18,19],cvcLength:[3],luhn:!1},{type:"jcb",pattern:/^35/,format:i,length:[16],cvcLength:[3],luhn:!0}],t=function(e){var t,n,i;e=(e+"").replace(/\D/g,"");for(n=0,i=r.length;n<i;n++){t=r[n];if(t.pattern.test(e))return t}},n=function(e){var t,n,i;for(n=0,i=r.length;n<i;n++){t=r[n];if(t.type===e)return t}},h=function(e){var t,n,r,i,s,o;r=!0,i=0,n=(e+"").split("").reverse();for(s=0,o=n.length;s<o;s++){t=n[s],t=parseInt(t,10);if(r=!r)t*=2;t>9&&(t-=9),i+=t}return i%10===0},c=function(e){var t;return e.prop("selectionStart")!=null&&e.prop("selectionStart")!==e.prop("selectionEnd")?!0:(typeof document!="undefined"&&document!==null?(t=document.selection)!=null?typeof t.createRange=="function"?t.createRange().text:void 0:void 0:void 0)?!0:!1},p=function(t){return setTimeout(function(){var n,r;return n=e(t.currentTarget),r=n.val(),r=e.payment.formatCardNumber(r),n.val(r)})},u=function(n){var r,i,s,o,u,a,f;s=String.fromCharCode(n.which);if(!/^\d+$/.test(s))return;r=e(n.currentTarget),f=r.val(),i=t(f+s),o=(f.replace(/\D/g,"")+s).length,a=16,i&&(a=i.length[i.length.length-1]);if(o>=a)return;if(r.prop("selectionStart")!=null&&r.prop("selectionStart")!==f.length)return;i&&i.type==="amex"?u=/^(\d{4}|\d{4}\s\d{6})$/:u=/(?:^|\s)(\d{4})$/;if(u.test(f))return n.preventDefault(),setTimeout(function(){return r.val(f+" "+s)});if(u.test(f+s))return n.preventDefault(),setTimeout(function(){return r.val(f+s+" ")})},s=function(t){var n,r;n=e(t.currentTarget),r=n.val();if(t.which!==8)return;if(n.prop("selectionStart")!=null&&n.prop("selectionStart")!==r.length)return;if(/\d\s$/.test(r))return t.preventDefault(),setTimeout(function(){return n.val(r.replace(/\d\s$/,""))});if(/\s\d?$/.test(r))return t.preventDefault(),setTimeout(function(){return n.val(r.replace(/\s\d?$/,""))})},d=function(t){return setTimeout(function(){var n,r;return n=e(t.currentTarget),r=n.val(),r=e.payment.formatExpiry(r),n.val(r)})},a=function(t){var n,r,i;r=String.fromCharCode(t.which);if(!/^\d+$/.test(r))return;n=e(t.currentTarget),i=n.val()+r;if(/^\d$/.test(i)&&i!=="0"&&i!=="1")return t.preventDefault(),setTimeout(function(){return n.val("0"+i+" / ")});if(/^\d\d$/.test(i))return t.preventDefault(),setTimeout(function(){return n.val(""+i+" / ")})},f=function(t){var n,r,i;r=String.fromCharCode(t.which);if(!/^\d+$/.test(r))return;n=e(t.currentTarget),i=n.val();if(/^\d\d$/.test(i))return n.val(""+i+" / ")},l=function(t){var n,r,i;i=String.fromCharCode(t.which);if(i!=="/"&&i!==" ")return;n=e(t.currentTarget),r=n.val();if(/^\d$/.test(r)&&r!=="0")return n.val("0"+r+" / ")},o=function(t){var n,r;n=e(t.currentTarget),r=n.val();if(t.which!==8)return;if(n.prop("selectionStart")!=null&&n.prop("selectionStart")!==r.length)return;if(/\s\/\s\d?$/.test(r))return t.preventDefault(),setTimeout(function(){return n.val(r.replace(/\s\/\s\d?$/,""))})},y=function(e){var t;return e.metaKey||e.ctrlKey?!0:e.which===32?!1:e.which===0?!0:e.which<33?!0:(t=String.fromCharCode(e.which),!!/[\d\s]/.test(t))},m=function(n){var r,i,s,o;r=e(n.currentTarget),s=String.fromCharCode(n.which);if(!/^\d+$/.test(s))return;if(c(r))return;return o=(r.val()+s).replace(/\D/g,""),i=t(o),i?o.length<=i.length[i.length.length-1]:o.length<=16},g=function(t){var n,r,i;n=e(t.currentTarget),r=String.fromCharCode(t.which);if(!/^\d+$/.test(r))return;if(c(n))return;i=n.val()+r,i=i.replace(/\D/g,"");if(i.length>6)return!1},v=function(t){var n,r,i;n=e(t.currentTarget),r=String.fromCharCode(t.which);if(!/^\d+$/.test(r))return;if(c(n))return;return i=n.val()+r,i.length<=4},b=function(t){var n,i,s,o,u;n=e(t.currentTarget),u=n.val(),o=e.payment.cardType(u)||"unknown";if(!n.hasClass(o))return i=function(){var e,t,n;n=[];for(e=0,t=r.length;e<t;e++)s=r[e],n.push(s.type);return n}(),n.removeClass("unknown"),n.removeClass(i.join(" ")),n.addClass(o),n.toggleClass("identified",o!=="unknown"),n.trigger("payment.cardType",o)},e.payment.fn.formatCardCVC=function(){return this.payment("restrictNumeric"),this.on("keypress",v),this},e.payment.fn.formatCardExpiry=function(){return this.payment("restrictNumeric"),this.on("keypress",g),this.on("keypress",a),this.on("keypress",l),this.on("keypress",f),this.on("keydown",o),this.on("change",d),this.on("input",d),this},e.payment.fn.formatCardNumber=function(){return this.payment("restrictNumeric"),this.on("keypress",m),this.on("keypress",u),this.on("keydown",s),this.on("keyup",b),this.on("paste",p),this.on("change",p),this.on("input",p),this.on("input",b),this},e.payment.fn.restrictNumeric=function(){return this.on("keypress",y),this},e.payment.fn.cardExpiryVal=function(){return e.payment.cardExpiryVal(e(this).val())},e.payment.cardExpiryVal=function(e){var t,n,r,i;return e=e.replace(/\s/g,""),i=e.split("/",2),t=i[0],r=i[1],(r!=null?r.length:void 0)===2&&/^\d+$/.test(r)&&(n=(new Date).getFullYear(),n=n.toString().slice(0,2),r=n+r),t=parseInt(t,10),r=parseInt(r,10),{month:t,year:r}},e.payment.validateCardNumber=function(e){var n,r;return e=(e+"").replace(/\s+|-/g,""),/^\d+$/.test(e)?(n=t(e),n?(r=e.length,E.call(n.length,r)>=0)&&(n.luhn===!1||h(e)):!1):!1},e.payment.validateCardExpiry=function(t,n){var r,i,s;return typeof t=="object"&&"month"in t&&(s=t,t=s.month,n=s.year),!t||!n?!1:(t=e.trim(t),n=e.trim(n),/^\d+$/.test(t)?/^\d+$/.test(n)?1<=t&&t<=12?(n.length===2&&(n<70?n="20"+n:n="19"+n),n.length!==4?!1:(i=new Date(n,t),r=new Date,i.setMonth(i.getMonth()-1),i.setMonth(i.getMonth()+1,1),i>r)):!1:!1:!1)},e.payment.validateCardCVC=function(t,r){var i,s;return t=e.trim(t),/^\d+$/.test(t)?(i=n(r),i!=null?(s=t.length,E.call(i.cvcLength,s)>=0):t.length>=3&&t.length<=4):!1},e.payment.cardType=function(e){var n;return e?((n=t(e))!=null?n.type:void 0)||null:null},e.payment.formatCardNumber=function(n){var r,i,s,o;r=t(n);if(!r)return n;s=r.length[r.length.length-1],n=n.replace(/\D/g,""),n=n.slice(0,s);if(r.format.global)return(o=n.match(r.format))!=null?o.join(" "):void 0;i=r.format.exec(n);if(i==null)return;return i.shift(),i=e.grep(i,function(e){return e}),i.join(" ")},e.payment.formatExpiry=function(e){var t,n,r,i;n=e.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/);if(!n)return"";t=n[1]||"",r=n[2]||"",i=n[3]||"";if(i.length>0||r.length>0&&!/\ \/?\ ?/.test(r))r=" / ";return t.length===1&&t!=="0"&&t!=="1"&&(t="0"+t,r=" / "),t+r+i}}).call(this)},{}],2:[function(e,t,n){var r,i,s=[].indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1},o=[].slice;e("jquery.payment"),r=jQuery,r.card={},r.card.fn={},r.fn.card=function(e){return r.card.fn.construct.apply(this,e)},i=function(){function e(e,t){this.options=r.extend(!0,{},this.defaults,t),r.extend(this.options.messages,r.card.messages),r.extend(this.options.values,r.card.values),this.$el=r(e);if(!this.options.container){console.log("Please provide a container");return}this.$container=r(this.options.container),this.render(),this.attachHandlers(),this.handleInitialValues()}return e.prototype.cardTemplate='<div class="card-container">\n    <div class="card">\n        <div class="front">\n                <div class="card-logo visa">visa</div>\n                <div class="card-logo mastercard">MasterCard</div>\n                <div class="card-logo amex"></div>\n                <div class="card-logo discover">discover</div>\n            <div class="lower">\n                <div class="shiny"></div>\n                <div class="cvc display">{{cvc}}</div>\n                <div class="number display">{{number}}</div>\n                <div class="name display">{{name}}</div>\n                <div class="expiry display" data-before="{{monthYear}}" data-after="{{validDate}}">{{expiry}}</div>\n            </div>\n        </div>\n        <div class="back">\n            <div class="bar"></div>\n            <div class="cvc display">{{cvc}}</div>\n            <div class="shiny"></div>\n        </div>\n    </div>\n</div>',e.prototype.template=function(e,t){return e.replace(/\{\{(.*?)\}\}/g,function(e,n,r){return t[n]})},e.prototype.cardTypes=["maestro","dinersclub","laser","jcb","unionpay","discover","mastercard","amex","visa"],e.prototype.defaults={formatting:!0,formSelectors:{numberInput:'input[name="number"]',expiryInput:'input[name="expiry"]',cvcInput:'input[name="cvc"]',nameInput:'input[name="name"]'},cardSelectors:{cardContainer:".card-container",card:".card",numberDisplay:".number",expiryDisplay:".expiry",cvcDisplay:".cvc",nameDisplay:".name"},messages:{validDate:"valid\nthru",monthYear:"month/year"},values:{number:"&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;",cvc:"&bull;&bull;&bull;",expiry:"&bull;&bull;/&bull;&bull;",name:"Full Name"},classes:{valid:"card-valid",invalid:"card-invalid"},debug:!1},e.prototype.render=function(){var e,t;this.$container.append(this.template(this.cardTemplate,r.extend({},this.options.messages,this.options.values))),r.each(this.options.cardSelectors,function(e){return function(t,n){return e["$"+t]=e.$container.find(n)}}(this)),r.each(this.options.formSelectors,function(e){return function(t,n){var i;return e.options[t]?i=r(e.options[t]):i=e.$el.find(n),!i.length&&e.options.debug&&console.error("Card can't find a "+t+" in your form."),e["$"+t]=i}}(this)),this.options.formatting&&(this.$numberInput.payment("formatCardNumber"),this.$cvcInput.payment("formatCardCVC"),this.$expiryInput.length===1&&this.$expiryInput.payment("formatCardExpiry")),this.options.width&&(e=parseInt(this.$cardContainer.css("width")),this.$cardContainer.css("transform","scale("+this.options.width/e+")"));if(typeof navigator!="undefined"&&navigator!==null?navigator.userAgent:void 0)t=navigator.userAgent.toLowerCase(),t.indexOf("safari")!==-1&&t.indexOf("chrome")===-1&&this.$card.addClass("safari");(new Function("/*@cc_on return @_jscript_version; @*/"))()&&this.$card.addClass("ie-10");if(/rv:11.0/i.test(navigator.userAgent))return this.$card.addClass("ie-11")},e.prototype.attachHandlers=function(){var e;return this.$numberInput.bindVal(this.$numberDisplay,{fill:!1,filters:this.validToggler("cardNumber")}).on("payment.cardType",this.handle("setCardType")),e=[function(e){return e.replace(/(\s+)/g,"")}],this.$expiryInput.length===1&&e.push(this.validToggler("cardExpiry")),this.$expiryInput.bindVal(this.$expiryDisplay,{join:function(e){return e[0].length===2||e[1]?"/":""},filters:e}),this.$cvcInput.bindVal(this.$cvcDisplay,{filters:this.validToggler("cardCVC")}).on("focus",this.handle("flipCard")).on("blur",this.handle("unflipCard")),this.$nameInput.bindVal(this.$nameDisplay,{fill:!1,filters:this.validToggler("cardHolderName"),join:" "}).on("keydown",this.handle("captureName"))},e.prototype.handleInitialValues=function(){return r.each(this.options.formSelectors,function(e){return function(t,n){var r;r=e["$"+t];if(r.val())return r.trigger("paste"),setTimeout(function(){return r.trigger("keyup")})}}(this))},e.prototype.handle=function(e){return function(t){return function(n){var i,s;return i=r(n.currentTarget),s=Array.prototype.slice.call(arguments),s.unshift(i),t.handlers[e].apply(t,s)}}(this)},e.prototype.validToggler=function(e){var t;return e==="cardExpiry"?t=function(e){var t;return t=r.payment.cardExpiryVal(e),r.payment.validateCardExpiry(t.month,t.year)}:e==="cardCVC"?t=function(e){return function(t){return r.payment.validateCardCVC(t,e.cardType)}}(this):e==="cardNumber"?t=function(e){return r.payment.validateCardNumber(e)}:e==="cardHolderName"&&(t=function(e){return e!==""}),function(e){return function(n,r,i){var s;return s=t(n),e.toggleValidClass(r,s),e.toggleValidClass(i,s),n}}(this)},e.prototype.toggleValidClass=function(e,t){return e.toggleClass(this.options.classes.valid,t),e.toggleClass(this.options.classes.invalid,!t)},e.prototype.handlers={setCardType:function(e,t,n){if(!this.$card.hasClass(n))return this.$card.removeClass("unknown"),this.$card.removeClass(this.cardTypes.join(" ")),this.$card.addClass(n),this.$card.toggleClass("identified",n!=="unknown"),this.cardType=n},flipCard:function(){return this.$card.addClass("flipped")},unflipCard:function(){return this.$card.removeClass("flipped")},captureName:function(e,t){var n,r,i;i=t.which||t.keyCode,r=[48,49,50,51,52,53,54,55,56,57,106,107,109,110,111,186,187,188,189,190,191,192,219,220,221,222],n=[189,109,190,110,222];if(r.indexOf(i)!==-1&&!(!t.shiftKey&&s.call(n,i)>=0))return t.preventDefault()}},r.fn.bindVal=function(e,t){var n,i,s,o,u;return t==null&&(t={}),t.fill=t.fill||!1,t.filters=t.filters||[],t.filters instanceof Array||(t.filters=[t.filters]),t.join=t.join||"",typeof t.join!="function"&&(s=t.join,t.join=function(){return s}),n=r(this),u=function(){var t,n,r;r=[];for(i=t=0,n=e.length;t<n;i=++t)o=e[i],r.push(e.eq(i).text());return r}(),n.on("focus",function(){return e.addClass("focused")}),n.on("blur",function(){return e.removeClass("focused")}),n.on("keyup change paste",function(s){var a,f,l,c,h,p,d,v,m,g;c=n.map(function(){return r(this).val()}).get(),f=t.join(c),c=c.join(f),c===f&&(c=""),m=t.filters;for(h=0,d=m.length;h<d;h++)a=m[h],c=a(c,n,e);g=[];for(i=p=0,v=e.length;p<v;i=++p)o=e[i],t.fill?l=c+u[i].substring(c.length):l=c||u[i],g.push(e.eq(i).text(l));return g}),n},e}(),r.fn.extend({card:function(){var e,t;return t=arguments[0],e=2<=arguments.length?o.call(arguments,1):[],this.each(function(){var n,s;n=r(this),s=n.data("card"),s||n.data("card",s=new i(this,t));if(typeof t=="string")return s[t].apply(s,e)})}})},{"jquery.payment":1}]},{},[2])(2)});