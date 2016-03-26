define(["require","jquery","underscore","monster","toastr"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("toastr"),s={name:"core",css:["app"],i18n:{"en-US":{customCss:!1},"fr-FR":{customCss:!1},"ru-RU":{customCss:!1}},requests:{},subscribe:{"core.loadApps":"_loadApps","core.showAppName":"showAppName","core.triggerMasquerading":"triggerMasquerading","core.restoreMasquerading":"restoreMasquerading"},_baseApps:["apploader","appstore","myaccount","common"],_defaultApp:"appstore",spinner:{requestAmount:0,active:!1},load:function(e){var t=this;t.callApi({resource:"whitelabel.getByDomain",data:{domain:window.location.hostname,generateError:!1},success:function(n){e(t)},error:function(n){e(t)}})},render:function(e){var n=this,i=t(r.template(n,"app",{hidePowered:r.config.whitelabel.hide_powered}));document.title=r.config.whitelabel.applicationTitle,n.bindEvents(i),n.displayVersion(i),n.displayLogo(i),n.displayFavicon(),e.append(i),n.loadAuth()},loadAuth:function(){var e=this;r.apps.load("auth",function(e){e.render(t("#monster-content"))})},showAppName:function(e){var i=this,s=t("#main_topbar"),o=s.find("#main_topbar_current_app"),u;if(e==="myaccount"){var a={name:e,label:"Control Center"};if(o.is(":empty"))o.append(r.template(i,"current-app",a)),s.find("#main_topbar_current_app_name").data("originalName","appstore"),s.find("#main_topbar_current_app_name").fadeIn(100);else{var f=s.find("#main_topbar_current_app_name").data("name");s.find("#main_topbar_current_app_name").fadeOut(100,function(){o.empty().append(r.template(i,"current-app",a)),s.find("#main_topbar_current_app_name").data("originalName",f),s.find("#main_topbar_current_app_name").fadeIn(100)})}}else n.each(r.apps.auth.installedApps,function(t){t.name===e&&(u=t)}),e==="appstore"?o.empty():o.is(":empty")?(o.append(r.template(i,"current-app",u)),s.find("#main_topbar_current_app_name").fadeIn(100)):s.find("#main_topbar_current_app_name").fadeOut(100,function(){o.empty().append(r.template(i,"current-app",u)),s.find("#main_topbar_current_app_name").fadeIn(100)})},_loadApps:function(e){var n=this;if(!n._baseApps.length){var i=r.apps.auth.currentUser.priv_level==="admin"?e.defaultApp||n._defaultApp:e.defaultApp;r.routing.parseHash(),r.routing.hasMatch()||(typeof i!="undefined"?r.apps.load(i,function(e){n.showAppName(i),e.render(t("#monster-content"))},{},!0):console.warn("Current user doesn't have a default app"))}else{var s=n._baseApps.pop();r.apps.load(s,function(t){n._loadApps(e)})}},bindEvents:function(e){var n=this,i=e.find(".loading-wrapper");window.onerror=function(e,t,n,i,s){r.error("js",{message:e,fileName:t,lineNumber:n,columnNumber:i||"",error:s||{}})},r.sub("monster.requestStart",function(){n.onRequestStart(i)}),r.sub("monster.requestEnd",function(){n.onRequestEnd(i)}),e.find("#main_topbar_apploader_link").on("click",function(e){e.preventDefault(),r.pub("apploader.toggle")}),e.find("#main_topbar_account_toggle_link").on("click",function(e){e.preventDefault(),n.toggleAccountToggle()}),e.find("#main_topbar_account_toggle").on("click",".home-account-link",function(){n.restoreMasquerading({callback:function(){var e=r.apps.getActiveApp();e in r.apps&&r.apps[e].render(),n.hideAccountToggle()}})}),e.find("#main_topbar_signout_link").on("click",function(){r.pub("auth.clickLogout")}),e.find("#main_topbar_current_app").on("click",function(){var e=t(this).find("#main_topbar_current_app_name").data("name");e==="myaccount"?r.apps.load(e,function(e){e.renderDropdown(!1)}):r.apps.load(e,function(e){e.render()})}),e.find("#main_topbar_brand").on("click",function(){var e=r.apps.auth.defaultApp;e&&(r.pub("myaccount.hide"),r.apps.load(e,function(t){n.showAppName(e),t.render()}))}),t("body").on("click",'*[class*="monster-button"]:not(.disabled)',function(e){var n=t(this),r=t('<div class="monster-splash-effect"/>'),i=n.offset(),s=e.pageX-i.left,o=e.pageY-i.top;r.css({height:n.height(),width:n.height(),top:o-r.height()/2,left:s-r.width()/2}).appendTo(n),window.setTimeout(function(){r.remove()},1500)}),r.config.whitelabel.hasOwnProperty("nav")&&r.config.whitelabel.nav.hasOwnProperty("logout")&&r.config.whitelabel.nav.logout.length>0&&e.find("#main_topbar_signout_link").unbind("click").attr("href",r.config.whitelabel.nav.logout),e.find('[data-toggle="tooltip"]').tooltip()},hideAccountToggle:function(){t("#main_topbar_account_toggle_container .account-toggle-content").empty(),t("#main_topbar_account_toggle_container .current-account-container").empty(),t("#main_topbar_account_toggle").removeClass("open")},showAccountToggle:function(){var e=this;r.pub("common.accountBrowser.render",{container:t("#main_topbar_account_toggle_container .account-toggle-content"),breadcrumbsContainer:t("#main_topbar_account_toggle_container .current-account-container"),customClass:"ab-dropdown",addBackButton:!0,allowBackOnMasquerading:!0,onAccountClick:function(t,n){e.callApi({resource:"account.get",data:{accountId:t},success:function(t,n){e.triggerMasquerading({account:t.data,callback:function(){var t=r.apps.getActiveApp();t in r.apps&&(r.apps[t].isMasqueradable?r.apps[t].render():(i.warning(e.i18n.active().noMasqueradingAllowed),r.apps.apploader.render())),e.hideAccountToggle()}})}})}}),t("#main_topbar_account_toggle").addClass("open")},toggleAccountToggle:function(){var e=this;t("#main_topbar_account_toggle").hasClass("open")?e.hideAccountToggle():e.showAccountToggle()},triggerMasquerading:function(e){var n=this,s=e.account,o=e.callback,u=function(e){r.apps.auth.currentAccount=t.extend(!0,{},e),n.updateApps(e.id),r.pub("myaccount.renderNavLinks",{name:e.name,isMasquerading:!0}),t("#main_topbar_account_toggle").addClass("masquerading"),i.info(r.template(n,"!"+n.i18n.active().triggerMasquerading,{accountName:e.name})),r.pub("core.changedAccount"),o&&o()};e.account.id===r.apps.auth.originalAccount.id?n.restoreMasquerading({callback:o}):e.account.hasOwnProperty("name")?u(e.account):n.callApi({resource:"account.get",data:{accountId:s.id,generateError:!1},success:function(e,t){s=e.data,u(s)},error:function(){o&&o()}})},updateApps:function(e){t.each(r.apps,function(t,n){if(n.hasOwnProperty("isMasqueradable")?n.isMasqueradable:!0)n.accountId=e})},restoreMasquerading:function(e){var n=this,s=e.callback;r.apps.auth.currentAccount=t.extend(!0,{},r.apps.auth.originalAccount),n.updateApps(r.apps.auth.originalAccount.id),r.pub("myaccount.renderNavLinks"),t("#main_topbar_account_toggle").removeClass("masquerading"),i.info(n.i18n.active().restoreMasquerading),r.pub("core.changedAccount"),s&&s()},displayVersion:function(e){var t=this;r.getVersion(function(t){e.find(".footer-wrapper .tag-version").html("("+t+")"),r.config.version=t})},displayLogo:function(e){var t=this,n=window.location.hostname,i=r.config.api.default;t.callApi({resource:"whitelabel.getLogoByDomain",data:{domain:n,generateError:!1,dataType:"*"},success:function(t){e.find("#main_topbar_brand").css("background-image","url("+i+"whitelabel/"+n+"/logo?_="+(new Date).getTime()+")")},error:function(t){e.find("#main_topbar_brand").css("background-image",'url("apps/core/style/static/images/logo.svg")')}})},displayFavicon:function(){var e=this,t=window.location.hostname,n=r.config.api.default,i=function(e){var t=document.createElement("link"),n=document.getElementById("dynamicFavicon");t.id="dynamicFavicon",t.rel="shortcut icon",t.href=e,n&&document.head.removeChild(n),document.head.appendChild(t)};e.callApi({resource:"whitelabel.getIconByDomain",data:{domain:t,generateError:!1,dataType:"*"},success:function(e){var r=n+"whitelabel/"+t+"/icon?_="+(new Date).getTime();i(r)},error:function(e){var t="apps/core/style/static/images/favicon.png";i(t)}})},onRequestStart:function(e){var t=this,n=250;t.spinner.requestAmount++,clearTimeout(t.spinner.endTimeout),t.spinner.startTimeout=setTimeout(function(){t.spinner.requestAmount!==0&&t.spinner.active===!1&&(t.spinner.active=!0,e.addClass("active"),clearTimeout(t.spinner.startTimeout))},n)},onRequestEnd:function(e){var t=this,n=50;t.spinner.requestAmount--,t.spinner.requestAmount===0&&(t.spinner.endTimeout=setTimeout(function(){t.spinner.requestAmount===0&&t.spinner.active===!0&&(e.removeClass("active"),t.spinner.active=!1,clearTimeout(t.spinner.startTimeout),clearTimeout(t.spinner.endTimeout))},n))}};return s});