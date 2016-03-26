define(["require","jquery","underscore","monster","toastr"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("toastr"),s={name:"myaccount",css:["app"],i18n:{"en-US":{customCss:!1},"fr-FR":{customCss:!1},"ru-RU":{customCss:!1}},requests:{"myaccount.getAccount":{url:"accounts/{accountId}",verb:"GET"}},subscribe:{"myaccount.hide":"_hide","myaccount.updateMenu":"_updateMenu","myaccount.events":"_myaccountEvents","myaccount.renderNavLinks":"_renderNavLinks","myaccount.renderSubmodule":"_renderSubmodule","myaccount.openAccordionGroup":"_openAccordionGroup","myaccount.UIRestrictionsCompatibility":"_UIRestrictionsCompatibility","myaccount.showCreditCardTab":"showCreditCardTab","myaccount.hasCreditCards":"hasCreditCards","core.changedAccount":"refreshMyAccount","myaccount.hasToShowWalkthrough":"hasToShowWalkthrough"},subModules:["account","balance","billing","servicePlan","transactions","trunks","user","errorTracker"],mainContainer:"#myaccount",load:function(e){var t=this;t.initApp(function(){t.render(),e&&e(t)})},initApp:function(e){var t=this;r.pub("auth.initApp",{app:t,callback:e})},getDefaultCategory:function(){var e=this,t={name:"user"};return r.util.isMasquerading()&&(t.name="account"),t},getDefaultRestrictions:function(){return{account:{show_tab:!0},balance:{show_credit:!0,show_header:!0,show_minutes:!0,show_tab:!0},billing:{show_tab:!0},inbound:{show_tab:!0},outbound:{show_tab:!0},twoway:{show_tab:!0},service_plan:{show_tab:!0},transactions:{show_tab:!0},user:{show_tab:!0},errorTracker:{show_tab:!0}}},_UIRestrictionsCompatibility:function(e){var i=this,s=!1;e.hasOwnProperty("restrictions")&&typeof e.restrictions!="undefined"&&e.restrictions.hasOwnProperty("myaccount")?e.restrictions=t.extend(!0,{},i.getDefaultRestrictions(),e.restrictions.myaccount):e.restrictions=i.getDefaultRestrictions(),r.apps.auth.currentUser.priv_level==="user"&&n.each(e.restrictions,function(e,t){t!=="user"&&t!=="errorTracker"&&(e.show_tab=!1)}),e.restrictions.hasOwnProperty("user")||(e.restrictions=t.extend(e.restrictions,{account:{show_tab:!0},billing:{show_tab:!0},user:{show_tab:!0}}),delete e.restrictions.profile),n.each(e.restrictions,function(e,t){e.show_tab&&(s=!0)}),e.callback(e.restrictions,s)},formatUiRestrictions:function(e,t){var r=this,i={settings:["account","user"],billing:["billing","transactions","service_plan","balance"],trunking:["inbound","outbound"],misc:["errorTracker"]},s=function(e,r){n.isEmpty(e)&&(r.billing.show_tab=!1),r.categories={};for(var s in i){var o=i[s],u=o.length;o.forEach(function(e){(!r.hasOwnProperty(e)||!r[e].show_tab)&&u--}),r.categories[s]={show:u>0?!0:!1}}t(r)};r._UIRestrictionsCompatibility({restrictions:e,callback:function(e){r.callApi({resource:"billing.get",data:{accountId:r.accountId,generateError:!1},success:function(t,n){s(t.data,e)},error:function(t,n){s({},e)}})}})},render:function(){var e=this;e.formatUiRestrictions(r.apps.auth.originalAccount.ui_restrictions,function(n){var i={restrictions:n},s=t(r.template(e,"app",i));r.apps.auth.originalAccount.hasOwnProperty("ui_restrictions")||e.callApi({resource:"account.get",data:{accountId:e.accountId},success:function(t,n){t.data.ui_restrictions=t.data.ui_restrictions||{},t.data.ui_restrictions.myaccount=e.getDefaultRestrictions(),e.callApi({resource:"account.update",data:{accountId:e.accountId,data:t.data}})}}),t("#main_topbar").after(s),e._renderNavLinks(),e.bindEvents(s),e.afterRender(s,n)})},afterRender:function(e,t){var n=this,i=r.apps.auth.currentAccount,s=r.apps.auth.currentUser,o=s.hasOwnProperty("require_password_update")&&s.require_password_update;o||(i.hasOwnProperty("trial_time_left")&&r.config.api.hasOwnProperty("screwdriver")?r.pub("auth.showTrialInfo",i.trial_time_left):n.hasToShowWalkthrough()?n.showWalkthrough(e,function(){n.updateWalkthroughFlagUser()}):n.checkCreditCard(t))},_renderNavLinks:function(e){var n=this;n._UIRestrictionsCompatibility({restrictions:r.apps.auth.originalAccount.ui_restrictions,callback:function(i,s){var o=t("#main_topbar_nav"),u={name:e&&e.name||r.apps.auth.currentUser.first_name+" "+r.apps.auth.currentUser.last_name,showMyaccount:s},a=t(r.template(n,"nav",u)),f=t(n.mainContainer);o.find(".myaccount-common-link").remove(),a.insertAfter(o.find("#main_topbar_apploader"))}})},renderDropdown:function(e,t){var n=this,i=3;r.pub("myaccount.refreshBadges",{callback:function(){e&&(--i||(r.pub("core.showAppName","myaccount"),n.toggle({callback:t})))}})},refreshMyAccount:function(){var e=this,n=t(e.mainContainer);if(n.hasClass("myaccount-open")){e.displayUserSection();var i=n.find(".myaccount-menu .myaccount-element.active").first(),s=i.data("module"),o={module:s,title:e.i18n.active()[s].title};i.data("key")&&(o.key=i.data("key")),e.activateSubmodule(o),r.pub("myaccount.refreshBadges",{except:s})}},bindEvents:function(e){var n=this,i=t(n.mainContainer),s=t("#main_topbar_nav");e.find(".myaccount-close").on("click",function(){n.toggle()}),e.find(".myaccount-element").on("click",function(){var e=t(this),i=e.data("key"),s=e.data("module"),o={module:s};i?(o.title=n.i18n.active()[s][i+"Title"],o.key=i):o.title=n.i18n.active()[s].title,n.activateSubmodule(o),r.pub("myaccount.refreshBadges",{except:o.module})}),s.on("click","#main_topbar_myaccount",function(e){e.preventDefault(),n._UIRestrictionsCompatibility({restrictions:r.apps.auth.originalAccount.ui_restrictions,callback:function(e,t){t&&(i.hasClass("myaccount-open")?n.hide():n.hasToShowWalkthrough()?n.showWalkthrough(i,function(){n.updateWalkthroughFlagUser()}):n.renderDropdown(!0))}})})},toggle:function(e){var n=this,i=(e||{}).callback;n._UIRestrictionsCompatibility({restrictions:r.apps.auth.originalAccount.ui_restrictions,callback:function(e){var r=t(n.mainContainer),s=r.find(".myaccount-menu .myaccount-element").first(),o=n.getDefaultCategory();e&&e[o.name]&&e[o.name].show_tab===!1&&(o.name=s.data("module"),s.data("key")&&(o.key=s.data("key")));if(r.hasClass("myaccount-open"))n.hide(r);else{var u={title:n.i18n.active()[o.name].title,module:o.name,callback:function(){n.displayUserSection(),r.addClass("myaccount-open"),setTimeout(function(){t("#monster-content").hide()},300),i&&i()}};o.key&&(u.key=o.key),n.activateSubmodule(u)}}})},displayUserSection:function(){var e=this;if(r.util.isMasquerading()){var n=t('.myaccount-menu .myaccount-element[data-module="user"]');n.hide(),n.hasClass("active")&&(n.removeClass("active"),t(".myaccount-menu .myaccount-element:visible").first().addClass("active"))}else t('.myaccount-menu .myaccount-element[data-module="user"]').show()},activateSubmodule:function(e){var n=this,i=t(n.mainContainer),s=e.key?i.find('[data-module="'+e.module+'"][data-key="'+e.key+'"]'):i.find('[data-module="'+e.module+'"]');i.find(".myaccount-menu .nav li").removeClass("active"),s.addClass("active"),i.find(".myaccount-module-title").html(e.title),i.find(".myaccount-content").empty(),r.pub("myaccount."+e.module+".renderContent",e)},_renderSubmodule:function(e){var n=t("#myaccount");n.find(".myaccount-right .myaccount-content").html(e),n.find(".myaccount-menu .nav li.active")&&(n.find(".myaccount-right .nav li").first().addClass("active"),n.find(".myaccount-right .tab-content div").first().addClass("active"))},hide:function(e,n){var i=this,e=e||t(i.mainContainer);r.pub("core.showAppName",t("#main_topbar_current_app_name").data("originalName")),e.find(".myaccount-right .myaccount-content").empty(),e.removeClass("myaccount-open"),t("#monster-content").show(),r.pub("myaccount.closed")},_hide:function(){var e=this,n=t(e.mainContainer);n.hasClass("myaccount-open")&&e.hide(n)},_updateMenu:function(e){if(e.data!==undefined){var n=e.hasOwnProperty("key")?'[data-key="'+e.key+'"] .badge':'[data-module="'+e.module+'"] .badge';t(n).html(e.data)}e.callback&&e.callback()},checkCreditCard:function(e){var t=this;r.apps.auth.resellerId===r.config.resellerId&&e.billing.show_tab&&!r.util.isSuperDuper()&&t.hasCreditCards(function(e){e===!1&&t.showCreditCardTab()})},hasCreditCards:function(e){var t=this,n=!1;t.getBraintree(function(t){n=(t.credit_cards||[]).length>0,e&&e(n)},function(){e&&e(n)})},showCreditCardTab:function(){var e=this;e.renderDropdown(!0,function(){var n="billing";e.activateSubmodule({title:e.i18n.active()[n].title,module:n,callback:function(){var n=t("#myaccount .myaccount-content .billing-content-wrapper");e._openAccordionGroup({link:n.find('.settings-item[data-name="credit_card"] .settings-link')}),i.error(e.i18n.active().billing.missingCard)}})})},hasToShowWalkthrough:function(e){var t=this,n=t.uiFlags.user.get("showfirstUseWalkthrough")!==!1;if(typeof e!="function")return n;e(n)},updateWalkthroughFlagUser:function(e){var t=this,n=t.uiFlags.user.set("showfirstUseWalkthrough",!1);t.updateUser(n,function(t){e&&e(t)})},showWalkthrough:function(e,t){var n=this;n.showMyAccount(function(){r.apps.auth.currentAccount.hasOwnProperty("trial_time_left")?n.renderStepByStepWalkthrough(e,t):n.showGreetingWalkthrough(function(){n.renderStepByStepWalkthrough(e,t)},t)})},showMyAccount:function(e){var t=this,n="user";t.renderDropdown(!0,function(){t.activateSubmodule({title:t.i18n.active()[n].title,module:n,callback:function(){e&&e()}})})},showGreetingWalkthrough:function(e,n){var i=this,s=t(r.template(i,"walkthrough-greetingsDialog"));s.find("#start_walkthrough").on("click",function(){o.dialog("close").remove(),e&&e()});var o=r.ui.dialog(s,{title:i.i18n.active().walkthrough.greetingsDialog.title});o.siblings().find(".ui-dialog-titlebar-close").on("click",function(){n&&n()})},showEndWalkthrough:function(e){var n=this,i=t(r.template(n,"walkthrough-endDialog"));i.find("#end_walkthrough").on("click",function(){s.dialog("close").remove(),e&&e()});var s=r.ui.dialog(i,{title:n.i18n.active().walkthrough.endDialog.title})},renderStepByStepWalkthrough:function(e,n){var i=this,s=[{element:t("#main_topbar_myaccount")[0],intro:i.i18n.active().walkthrough.steps[1],position:"left"},{element:e.find('.myaccount-element[data-module="user"]')[0],intro:i.i18n.active().walkthrough.steps[2],position:"right"},{element:e.find('.myaccount-element[data-module="account"]')[0],intro:i.i18n.active().walkthrough.steps[3],position:"right"},{element:e.find('.myaccount-element[data-module="billing"]')[0],intro:i.i18n.active().walkthrough.steps[4],position:"right"},{element:e.find('.myaccount-element[data-module="balance"]')[0],intro:i.i18n.active().walkthrough.steps[5],position:"right"},{element:e.find('.myaccount-element[data-module="servicePlan"]')[0],intro:i.i18n.active().walkthrough.steps[6],position:"right"},{element:e.find('.myaccount-element[data-module="transactions"]')[0],intro:i.i18n.active().walkthrough.steps[7],position:"right"}];r.ui.stepByStep(s,function(){i.showEndWalkthrough(n)})},getBraintree:function(e){var t=this;t.callApi({resource:"billing.get",data:{accountId:t.accountId,generateError:!1},success:function(t){e&&e(t.data)},error:function(t,n){e&&e({})}})},validatePasswordForm:function(e,t){var n=this;r.ui.validate(e,{rules:{password:{minlength:6},confirm_password:{equalTo:'input[name="password"]'}}}),r.ui.valid(e)&&t&&t()},_myaccountEvents:function(e){var i=this,s=e.data,o=e.template,u=function(){var e=o.find("li.settings-item.open"),t=e.find("a.settings-link");e.find(".settings-item-content").slideUp("fast",function(){t.find(".update .text").text(i.i18n.active().editSettings),t.find(".update i").removeClass("fa-times").addClass("fa-cog"),e.removeClass("open"),e.find(".uneditable").show(),e.find(".edition").hide()})},a=function(e,t,n){var r=o.find("#form_password");r.length?i.validatePasswordForm(r,n):n&&n()};o.find(".settings-link").on("click",function(){var e=t(this).parent().hasClass("open");u();if(!e){var r={link:t(this)};s.hasOwnProperty("billing")&&(r.hasEmptyCreditCardInfo=n.isEmpty(s.billing.credit_cards)),i._openAccordionGroup(r)}}),o.find(".cancel").on("click",function(e){e.preventDefault(),u(),t(this).parents("form").first().find("input").each(function(e,n){var r=t(n);r.val(r.data("original_value"))})}),o.find(".change").on("click",function(e){e.preventDefault();var n=t(this),o=n.parents("#myaccount").find(".myaccount-menu .myaccount-element.active").data("module"),u=n.data("module");fieldName=n.data("field"),newData=function(t,n){return t==="billing"&&(n.credit_card.expiration_date=n.extra.expiration_date.month+"/"+n.extra.expiration_date.year),n}(u,r.ui.getFormData("form_"+fieldName)),a(fieldName,newData,function(){i.settingsUpdateData(u,s[u],newData,function(e){var n={callback:function(n){fieldName==="credit_card"?(n.find(".edition").hide(),n.find(".uneditable").show()):fieldName==="colorblind"&&t("body").toggleClass("colorblind",e.data.ui_flags.colorblind),i.highlightField(n,fieldName),typeof callbackUpdate=="function"&&callbackUpdate()}};r.pub("myaccount."+o+".renderContent",n)})})})},highlightField:function(e,t){var n=e.find("li[data-name="+t+"]");n.find(".update").hide(),n.find(".changes-saved").show().fadeOut(1500,function(){n.find(".update").fadeIn(500)}),n.css("background-color","#22a5ff").animate({backgroundColor:"#f6f6f6"},2e3),e.find("li.settings-item .settings-item-content").hide(),e.find("li.settings-item a.settings-link").show()},_openAccordionGroup:function(e){var t=this,n=e.link,r=n.parents(".settings-item"),i=e.hasEmptyCreditCardInfo===!1?!1:!0;r.addClass("open"),n.find(".update .text").text(t.i18n.active().close),n.find(".update i").removeClass("fa-cog").addClass("fa-times"),r.find(".settings-item-content").slideDown("fast"),r.data("name")==="credit_card"&&i&&(r.find(".uneditable").hide(),r.find(".edition").show())},settingsUpdateData:function(e,n,i,s,o){var u=this,a={accountId:u.accountId,data:t.extend(!0,{},n,i)};e==="user"?(a.accountId=r.apps.auth.originalAccount.id,a.userId=u.userId,a.data.timezone&&a.data.timezone==="inherit"&&delete a.data.timezone):e==="billing"&&(a.data=i),"language"in a.data&&a.data.language==="auto"&&delete a.data.language,a.data=function(t){var n=this;return delete t.extra,delete t[""],t}(a.data),u.callApi({resource:e.concat(".update"),data:a,success:function(e,t){typeof s=="function"&&s(e,t)},error:function(e,t){typeof o=="function"&&o(e,t)}})},updateUser:function(e,t){var n=this;n.callApi({resource:"user.update",data:{userId:e.id,accountId:r.apps.auth.originalAccount.id,data:e},success:function(e){t&&t(e.data)}})}};return s});