define(["require","jquery","underscore","chosen","monster","toastr","monster-timezone"],function(e){var t=e("jquery"),n=e("underscore"),r=e("chosen"),i=e("monster"),s=e("toastr"),o=e("monster-timezone"),u={name:"accounts",css:["app"],i18n:{"en-US":{customCss:!1},"fr-FR":{customCss:!1},"ru-RU":{customCss:!1},"es-ES":{customCss:!1}},requests:{},subscribe:{"accountsManager.activate":"_render"},load:function(e){var t=this;t.initApp(function(){e&&e(t)})},initApp:function(e){var t=this;i.pub("auth.initApp",{app:t,callback:e})},render:function(e){var t=this;t._render(e)},_render:function(e){var n=this,r=e||{},s=r.container,o=t(i.template(n,"accountsManager")),u=t(i.template(n,"accountsManagerLanding")),a=s||t("#monster-content");o.find(".main-content").append(u),a.empty().append(o),n.renderAccountsManager({container:o,parentId:r.parentId,selectedId:r.selectedId,selectedTab:r.selectedTab,callback:r.callback,breadcrumbs:r.breadcrumbs})},renderAccountsManager:function(e){var n=this,r=e.container,s=e.parentId,o=e.selectedId,u=e.selectedTab,a=e.callback,f=e.breadcrumbs;i.pub("common.accountBrowser.render",{container:r.find(".edition-view .left-menu"),parentId:s,selectedId:o,breadcrumbsContainer:r.find(".edition-view .content .top-bar"),breadcrumbsList:f,addBackButton:!0,onNewAccountClick:function(e,t){n.renderNewAccountWizard({parent:r,accountId:e||n.accountId,breadcrumbs:t})},onBreadcrumbClick:function(e,t){e===n.accountId?r.find(".main-content").empty().append(i.template(n,"accountsManagerLanding")):n.edit({accountId:e,parent:r})},onAccountClick:function(e){r.find(".main-content").empty(),n.edit({accountId:e,parent:r})},callback:o?function(){n.edit({accountId:o,selectedTab:u,parent:r}),a&&a()}:a}),setTimeout(function(){r.find(".search-query").focus()}),t(window).resize(function(e){var n=r.find(".account-list-container"),i=r.find(".main-content"),s=t("#topbar").outerHeight(),o=this.innerHeight-n.position().top-s+"px";n.css("height",o),i.css("height",this.innerHeight-i.position().top-s+"px")}),t(window).resize()},formatAccountCreationData:function(e,n){var r=this;return n.account.call_restriction={},t.each(e.find('.call-restrictions-element input[type="checkbox"]'),function(){var e=t(this);n.account.call_restriction[e.data("id")]={action:e.is(":checked")?"inherit":"deny"}}),n},renderNewAccountWizard:function(e){var n=this,r=e.parent,o=e.accountId,u={};i.config.whitelabel.hasOwnProperty("realm_suffix")&&i.config.whitelabel.realm_suffix.length&&(u.whitelabeledRealm=i.util.randomString(7)+"."+i.config.whitelabel.realm_suffix);var a=t(i.template(n,"newAccountWizard",u)),f=parseInt(a.find(".wizard-top-bar").data("max_step")),l=a.find("#accountsmanager_new_account_form");a.find(".wizard-top-bar").data("active_step","1"),a.find(".wizard-content-step").hide(),a.find('.wizard-content-step[data-step="1"]').show(),i.apps.auth.isReseller||a.find('.wizard-top-bar .step[data-step="2"]').hide(),f>1?a.find(".submit-btn").hide():a.find(".next-step").hide(),a.find(".prev-step").hide(),a.find(".step").on("click",function(){var e=a.find(".wizard-top-bar").data("active_step"),r=t(this).data("step");t(this).hasClass("completed")&&e!==r&&(r<e?(i.ui.valid(l)||a.find(".step:gt("+r+")").removeClass("completed"),n.changeStep(r,f,a)):i.ui.valid(l)&&n.changeStep(r,f,a))}),a.find(".next-step").on("click",function(e){e.preventDefault();var t=parseInt(a.find(".wizard-top-bar").data("active_step")),r=t+1;r===2&&!i.apps.auth.isReseller&&r++,i.ui.valid(l)&&n.changeStep(r,f,a)}),a.find(".prev-step").on("click",function(e){e.preventDefault();var t=parseInt(a.find(".wizard-top-bar").data("active_step"))-1;t===2&&!i.apps.auth.isReseller&&t--,i.ui.valid(l)||a.find(".step:gt("+t+")").removeClass("completed"),n.changeStep(t,f,a)}),a.find(".cancel").on("click",function(e){e.preventDefault(),r.find(".edition-view").show(),r.find(".creation-view").empty()}),a.find(".submit-btn").on("click",function(r){r.preventDefault();var u=parseInt(a.find(".wizard-top-bar").data("active_step")),f=function(e){var t=a.find("#accountsmanager_new_account_form"),n=a.find(".processing-div");e?(t.hide(),n.show(),n.find("i.fa-spinner").addClass("fa-spin"),a.find(".step").removeClass("completed")):(t.show(),n.hide(),n.find("i.fa-spinner").removeClass("fa-spin"),a.find(".step").addClass("completed"))};if(i.ui.valid(l)){var c=i.ui.getFormData("accountsmanager_new_account_form");c=n.formatAccountCreationData(l,c),f(!0),n.callApi({resource:"account.create",data:{accountId:o,data:c.account},success:function(r,u){var a=r.data.id;i.parallel({admin:function(e){c.user.email?(c.extra.autogenPassword&&(c.user.password=n.autoGeneratePassword(),c.user.send_email_on_creation=!0),c.user.username=c.user.email,c.user.priv_level="admin",n.callApi({resource:"user.create",data:{accountId:a,data:c.user},success:function(t,r){e(null,t.data);if(c.user.send_email_on_creation){var s=i.template(n,"!"+n.i18n.active().sentEmailPopup,{email:t.data.email});i.ui.alert("info",s)}},error:function(t,r){s.error(n.i18n.active().toastrMessages.newAccount.adminError,"",{timeOut:1e4}),e(null,{})}})):e()},noMatch:function(e){n.createNoMatchCallflow({accountId:a,resellerId:r.data.reseller_id},function(t){e(null,t)})},limits:function(e){n.callApi({resource:"limits.get",data:{accountId:a},success:function(r,i){var o={allow_prepay:c.limits.allow_prepay,inbound_trunks:parseInt(c.limits.inbound_trunks,10),outbound_trunks:parseInt(c.limits.outbound_trunks,10),twoway_trunks:parseInt(c.limits.twoway_trunks,10)};n.callApi({resource:"limits.update",data:{accountId:a,data:t.extend(!0,{},r.data,o),generateError:!1},success:function(t,n){e(null,t.data)},error:function(t,r){t.error===403?(s.info(n.i18n.active().toastrMessages.newAccount.forbiddenLimitsError,"",{timeOut:1e4}),e(null,{})):t.error!==402&&(s.info(n.i18n.active().toastrMessages.newAccount.limitsError,"",{timeOut:1e4}),e(null,{}))},onChargesCancelled:function(){e(null,{})}})},error:function(t,n){e(null,{})}})},credit:function(e){c.addCreditBalance?n.addCredit(a,c.addCreditBalance,function(t,n){e(null,t.data)},function(t,r){e(null,{}),s.info(n.i18n.active().toastrMessages.newAccount.creditError,"",{timeOut:1e4})}):e()},servicePlans:function(e){i.util.isSuperDuper()?i.pub("common.servicePlanDetails.customizeSave",{container:l.find(".common-container"),accountId:a,callback:function(){e()}}):e()}},function(t,r){n.render({parentId:o,selectedId:a,breadcrumbs:e.breadcrumbs})})},error:function(e,t){s.error(n.i18n.active().toastrMessages.newAccount.accountError,"",{timeOut:5e3}),f(!1)}})}}),n.renderWizardSteps(a),i.ui.validate(a.find("#accountsmanager_new_account_form"),{rules:{"user.password":{minlength:6},"extra.confirmPassword":{equalTo:'input[name="user.password"]'},addCreditBalance:{number:!0,min:5}}}),i.ui.showPasswordStrength(a.find('input[name="user.password"]')),r.find(".edition-view").hide(),r.find(".creation-view").append(a)},renderWizardSteps:function(e){var t=this;i.parallel({classifiers:function(e){t.callApi({resource:"numbers.listClassifiers",data:{accountId:t.accountId},success:function(t,n){e(null,t.data)},error:function(t,n){e(null,{})}})}},function(n,r){t.renderAccountInfoStep({parent:e.find('.wizard-content-step[data-step="1"]')}),t.renderServicePlanStep({parent:e.find('.wizard-content-step[data-step="2"]')}),t.renderLimitsStep({parent:e.find('.wizard-content-step[data-step="3"]'),classifiers:r.classifiers}),t.renderRestrictionsStep({parent:e.find('.wizard-content-step[data-step="4"]')})})},renderAccountInfoStep:function(e){var n=this,r=e.parent,s=r.find(".new-admin-div"),u=s.find(".autogen-button"),a=s.find(".manual-button"),f=s.find(".autogen-ckb"),l=s.find(".password-toggle-div");o.populateDropdown(r.find("#accountsmanager_new_account_timezone")),r.find(".change-realm").on("click",function(e){r.find(".generated-realm").hide(),r.find(".manual-realm").show().find("input").focus()}),r.find(".cancel-edition").on("click",function(e){r.find(".manual-realm").hide(),r.find(".generated-realm").show()}),r.find(".add-admin-toggle > a").on("click",function(e){e.preventDefault();var r=t(this);s.hasClass("active")?(s.slideUp(),s.removeClass("active"),s.find('input[type="text"], input[type="email"]').val(""),u.click(),r.html(n.i18n.active().addAdminLink.toggleOn),r.next("i").show()):(s.slideDown(),s.addClass("active"),r.html(n.i18n.active().addAdminLink.toggleOff),r.next("i").hide())}),a.on("click",function(e){f.prop("checked",!1),l.slideDown(),a.removeClass("monster-button-secondary").addClass("monster-button-primary"),u.removeClass("monster-button-primary").addClass("monster-button-secondary")}),u.on("click",function(e){f.prop("checked",!0),l.find("input[type=password]").val(""),l.slideUp(),u.removeClass("monster-button-secondary").addClass("monster-button-primary"),a.removeClass("monster-button-primary").addClass("monster-button-secondary")}),i.ui.tooltips(r)},renderServicePlanStep:function(e){var n=this,r=e.parent,s=t(i.template(n,"servicePlanWizardStep",{isReseller:i.apps.auth.isReseller}));i.pub("common.servicePlanDetails.getServicePlanTemplate",{mode:"new",useOwnPlans:i.apps.auth.isReseller,afterRender:function(e,t){s.find(".common-container").append(e),r.append(s)}})},servicePlanGet:function(e,t){var n=this;n.callApi({resource:"servicePlan.get",data:{accountId:n.accountId,planId:e},success:function(e,n){t&&t(e.data)}})},servicePlanAdd:function(e,t,n,r){var i=this;i.callApi({resource:"servicePlan.add",data:{accountId:e,planId:t,data:{}},success:function(e,t){n&&n(e)},error:function(e,t){r&&r(e)}})},servicePlanRemove:function(e,t,n,r){var i=this;i.callApi({resource:"servicePlan.remove",data:{accountId:e,planId:t,data:{}},success:function(e,t){n&&n(e)},error:function(e,t){r&&r(e)}})},renderLimitsStep:function(e){var n=this,r=e.parent,i=t.map(e.classifiers,function(e,t){return{id:t,name:(n.i18n.active().classifiers[t]||{}).name||e.friendly_name,help:(n.i18n.active().classifiers[t]||{}).help,checked:!0}}),s=n.getLimitsTabContent({parent:r,formattedClassifiers:i});r.append(s)},renderRestrictionsStep:function(e){var t=this,n=e.parent,r=t.getRestrictionsTabContent({parent:n});n.append(r),i.ui.tooltips(n)},getUIRestrictionForServicePlan:function(e){var t=this,r=e.hasOwnProperty("data")&&e.data.hasOwnProperty("plan")&&e.data.plan.hasOwnProperty("limits"),i=r?e.data.plan.limits:{},s={},o=function(e){var t=!1;return r&&i.hasOwnProperty(e)&&i[e].hasOwnProperty("rate")&&(t=!0),t};return r&&n.each(i,function(e,t){s[t]=o(t)}),s},updateUIRestrictionsFromServicePlan:function(e,t,n,r){var i=this,s=i.getUIRestrictionForServicePlan(n),o=function(e){return s.hasOwnProperty(e)?s[e]:!1},u={ui_restrictions:{myaccount:{inbound:{show_tab:o("inbound_trunks")},outbound:{show_tab:o("outbound_trunks")},twoway:{show_tab:o("twoway_trunks")}}}},a=function(t,n){var r=!0;n.data.hasOwnProperty("ui_restrictions")&&n.data.ui_restrictions.hasOwnProperty("myaccount")&&n.data.ui_restrictions.myaccount.hasOwnProperty(t)&&n.data.ui_restrictions.myaccount[t].hasOwnProperty("show_tab")&&(r=n.data.ui_restrictions.myaccount[t].show_tab===!0?!0:!1),e.find('[name="account.ui_restrictions.myaccount.'+t+'.show_tab"]').prop("checked",r)};i.updateData(t,u,function(e){a("inbound",e),a("outbound",e),a("twoway",e),r&&r()})},changeStep:function(e,t,n){var r=this;n.find(".step").removeClass("active"),n.find('.step[data-step="'+e+'"]').addClass("active");for(var i=e;i>=1;--i)n.find('.step[data-step="'+i+'"]').addClass("completed");n.find(".wizard-content-step").hide(),n.find('.wizard-content-step[data-step="'+e+'"]').show(),n.find(".cancel").hide(),n.find(".prev-step").show(),n.find(".next-step").show(),n.find(".submit-btn").hide(),e===t&&(n.find(".next-step").hide(),n.find(".submit-btn").show()),e===1&&(n.find(".prev-step").hide(),n.find(".cancel").show()),n.find(".wizard-top-bar").data("active_step",e)},renderEditAdminsForm:function(e,n){var r=this,s=e.find('li.settings-item[data-name="accountsmanager_account_admins"]'),o=function(){s.removeClass("open"),s.find(".settings-item-content").hide(),s.find("a.settings-link").show()},u=function(){r.callApi({resource:"user.list",data:{accountId:n,filters:{filter_priv_level:"admin"}},success:function(e,t){s.find(".total-admins").text(e.data.length),e.data.length>0?(e.data=e.data.sort(function(e,t){return(e.first_name+e.last_name).toLowerCase()>(t.first_name+t.last_name).toLowerCase()?1:-1}),s.find(".first-admin-name").text(e.data[0].first_name+" "+e.data[0].last_name),s.find(".first-admin-email").text(e.data[0].email)):(s.find(".first-admin-name").text("-"),s.find(".first-admin-email").empty())}})};r.callApi({resource:"user.list",data:{accountId:n},success:function(s,a){s.data=s.data.sort(function(e,t){return(e.first_name+e.last_name).toLowerCase()>(t.first_name+t.last_name).toLowerCase()?1:-1});var f=t.map(s.data,function(e){return e.priv_level==="admin"?e:null}),l=t.map(s.data,function(e){return e.priv_level!=="admin"?e:null}),c=t(i.template(r,"accountsAdminForm",{accountAdmins:f,accountUsers:l})),h=c.find(".create-user-div"),p=c.find(".admin-element"),d=c.find("#accountsmanager_new_admin_btn"),v=c.find(".new-admin-element");c.find(".close-admin-settings").click(function(e){e.preventDefault(),o(),e.stopPropagation()}),c.find(".new-admin-tabs a").click(function(e){e.preventDefault(),t(this).tab("show")}),d.click(function(e){e.preventDefault();var n=t(this);n.hasClass("disabled")?e.stopPropagation():n.hasClass("active")?(n.find("i").removeClass("fa-caret-up").addClass("fa-caret-down"),v.slideUp(),n.removeClass("active")):(n.find("i").removeClass("fa-caret-down").addClass("fa-caret-up"),v.slideDown(),n.addClass("active"))}),h.find('input[name="extra.autogen_password"]').change(function(e){t(this).val()==="true"?h.find(".new-admin-password-div").slideUp():h.find(".new-admin-password-div").slideDown()}),c.find(".admin-element-link.delete").click(function(s){s.preventDefault();var o=t(this).parent().parent().data("user_id");i.ui.confirm(r.i18n.active().deleteUserConfirm,function(){r.callApi({resource:"user.delete",data:{accountId:n,userId:o,data:{}},success:function(t,i){r.renderEditAdminsForm(e,n),u()}})})}),c.find(".admin-element-link.edit").click(function(e){e.preventDefault();var n=t(this).parent().parent(),r=n.data("user_id");c.find(".admin-element-edit .admin-cancel-btn").click(),d.hasClass("active")&&d.click(),d.addClass("disabled"),n.find(".admin-element-display").hide(),n.find(".admin-element-edit").show()}),p.each(function(){var s=t(this),o=s.data("user_id"),a=s.find(".edit-admin-password-div");i.ui.showPasswordStrength(s.find('input[name="password"]'),{container:s.find(".password-strength-container"),display:"icon"}),a.hide(),s.find(".admin-cancel-btn").click(function(e){e.preventDefault(),s.find("input").each(function(){t(this).val(t(this).data("original_value"))}),s.find(".admin-element-display").show(),s.find(".admin-element-edit").hide(),d.removeClass("disabled")}),s.find('input[name="email"]').change(function(){t(this).keyup()}),s.find('input[name="email"]').keyup(function(e){var n=t(this);n.val()!==n.data("original_value")?a.slideDown():a.slideUp(function(){a.find('input[type="password"]').val("")})}),s.find(".admin-save-btn").click(function(f){f.preventDefault();var l=s.find("form"),c=i.ui.getFormData(l[0]);i.ui.valid(l)&&(c=r.cleanFormData(c),a.is(":visible")||delete c.password,r.callApi({resource:"user.get",data:{accountId:n,userId:o},success:function(i,s){i.data.email!==c.email&&(c.username=c.email);var a=t.extend(!0,{},i.data,c);r.callApi({resource:"user.update",data:{accountId:n,userId:o,data:a},success:function(t,i){r.renderEditAdminsForm(e,n),u()}})}}))})}),v.find(".admin-cancel-btn").click(function(e){e.preventDefault(),d.click()}),v.find(".admin-add-btn").click(function(t){t.preventDefault();if(v.find(".tab-pane.active").hasClass("create-user-div")){var s=i.ui.getFormData("accountsmanager_add_admin_form"),o=h.find('input[name="extra.autogen_password"]:checked').val()==="true";i.ui.valid(c.find("#accountsmanager_add_admin_form"))&&(s=r.cleanFormData(s),s.priv_level="admin",s.username=s.email,o&&(s.password=r.autoGeneratePassword(),s.send_email_on_creation=!0),r.callApi({resource:"user.create",data:{accountId:n,data:s},success:function(t,o){r.renderEditAdminsForm(e,n),u();if(s.send_email_on_creation){var a=i.template(r,"!"+r.i18n.active().sentEmailPopup,{email:t.data.email});i.ui.alert("info",a)}}}),d.click())}else{var a=c.find("#accountsmanager_promote_user_select option:selected").val();r.callApi({resource:"user.get",data:{accountId:n,userId:a},success:function(t,i){t.data.priv_level="admin",r.callApi({resource:"user.update",data:{accountId:n,userId:a,data:t.data},success:function(t,i){r.renderEditAdminsForm(e,n),u()}})}}),d.click()}}),e.find("#form_accountsmanager_account_admins").empty().append(c),t.each(c.find("form"),function(){i.ui.validate(t(this),{rules:{password:{minlength:6},"extra.password_confirm":{equalTo:t(this).find('input[name="password"]')}},messages:{"extra.password_confirm":{equalTo:r.i18n.active().validationMessages.invalidPasswordConfirm}},errorPlacement:function(e,t){e.appendTo(t.parent())}})}),i.ui.tooltips(c)}})},edit:function(e){var t=this,r=e.accountId,s=e.selectedTab,o=e.parent;i.parallel({account:function(e){t.callApi({resource:"account.get",data:{accountId:r},success:function(t,n){e(null,t.data)}})},users:function(e){t.callApi({resource:"user.list",data:{accountId:r},success:function(t,n){e(null,t.data)},error:function(t,n){e(null,{})}})},currentServicePlan:function(e){t.callApi({resource:"servicePlan.listCurrent",data:{accountId:r},success:function(t,n){t&&t.data?e(null,t.data):e(null,{})},error:function(t,n){e(null,{})}})},limits:function(e){t.callApi({resource:"limits.get",data:{accountId:r},success:function(t,n){e(null,t.data)},error:function(t,n){e(null,{})}})},classifiers:function(e){t.callApi({resource:"numbers.listClassifiers",data:{accountId:r},success:function(t,n){e(null,t.data)},error:function(t,n){e(null,{})}})},currentBalance:function(e){t.getBalance(r,function(t,n){e(null,t.data)},function(t,n){e(null,{})})},noMatch:function(e){t.callApi({resource:"callflow.list",data:{accountId:r,filters:{filter_numbers:"no_match"}},success:function(n){n.data.length===1?t.callApi({resource:"callflow.get",data:{callflowId:n.data[0].id,accountId:r},success:function(t){e(null,t.data)}}):e(null,null)}})},appsList:function(e){t.callApi({resource:"appsStore.list",data:{accountId:t.accountId},success:function(r,s){var o={};n.each(r.data,function(e){o[e.id]=function(n){e.icon=t.apiUrl+"accounts/"+t.accountId+"/apps_store/"+e.id+"/icon?auth_token="+t.authToken,n&&n(null,e)}}),i.parallel(o,function(t,n){e(null,n)})},error:function(t,n){e(null,null)}})},appsBlacklist:function(e){t.callApi({resource:"appsStore.getBlacklist",data:{accountId:r},success:function(t,n){e(null,t.data&&t.data.blacklist?t.data.blacklist:null)},error:function(t,n){e(null,null)}})}},function(e,r){var u=i.config.whitelabel.language,a=u.substr(0,3).concat(u.substr(u.length-2,2).toUpperCase()),f={accountData:r.account,accountUsers:r.users.sort(function(e,t){return(e.first_name+e.last_name).toLowerCase()>(t.first_name+t.last_name).toLowerCase()?1:-1}),currentServicePlan:r.currentServicePlan,accountLimits:r.limits,classifiers:r.classifiers,accountBalance:"balance"in r.currentBalance?r.currentBalance.balance:0,parent:o,noMatch:r.noMatch,selectedTab:s,appsList:n.map(r.appsList,function(e){var t=e.i18n.hasOwnProperty(a)?a:"en-US";return e.description=e.i18n[t].description,e.name=e.i18n[t].label,r.appsBlacklist&&r.appsBlacklist.indexOf(e.id)>=0&&(e.blacklisted=!0),e}),appsBlacklist:r.appsBlacklist},l=function(){f=t.formatDataEditAccount(f),t.editAccount(f)};n.isObject(f.noMatch)?l():t.createNoMatchCallflow({accountId:f.accountData.id,resellerId:f.accountData.reseller_id},function(e){f.noMatch=e,l()})})},formatDataEditAccount:function(e){var t=this;return e},editAccount:function(e){var r=this,u=e.accountData,a=e.accountUsers,f=e.currentServicePlan,l=e.accountLimits,c=e.accountBalance,h=e.carrierInfo,p=e.selectedTab,d=e.appsList,v=e.parent,m=e.callback,g=t.map(a,function(e){return e.priv_level==="admin"?e:null}),y=t.map(a,function(e){return e.priv_level!=="admin"?e:null}),b=t.map(e.classifiers,function(e,t){var n={id:t,name:(r.i18n.active().classifiers[t]||{}).name||e.friendly_name,help:(r.i18n.active().classifiers[t]||{}).help,checked:!0};return u.call_restriction&&t in u.call_restriction&&u.call_restriction[t].action==="deny"&&(n.checked=!1),n}),w={account:t.extend(!0,{},u),accountAdmins:g,accountUsers:y,currentServicePlan:f,isReseller:i.apps.auth.isReseller,carrierInfo:h,isSuperDuperAdmin:i.util.isSuperDuper(),accountIsReseller:u.is_reseller,appsList:i.util.sort(d)};t.isNumeric(w.account.created)&&(w.account.created=i.util.toFriendlyDate(u.created,"short"));var E=t(i.template(r,"edit",w)),S=E.find("li.settings-item"),x=S.find(".settings-item-content"),T=S.find("a.settings-link"),N=function(){S.removeClass("open"),x.slideUp("fast"),T.find(".update .text").text(r.i18n.active().editSetting),T.find(".update i").removeClass("fa-times").addClass("fa-cog")},C=E.find("#accountsmanager_notes_tab");i.pub("common.carrierSelector",{container:E.find("#accountsmanager_carrier_tab"),data:e,callbackAfterSave:function(){i.pub("common.accountBrowser.getBreadcrumbsList",{container:v.find(".top-bar"),callback:function(e){r.render({parentId:n.last(e).id,selectedId:u.id,breadcrumbs:e,selectedTab:"tab-carrier"})}})}}),E.find(".account-tabs a").click(function(e){e.preventDefault(),t(this).parent().hasClass("disabled")||(N(),t(this).tab("show"))}),E.find("li.settings-item .settings-link").on("click",function(e){var n=t(this),i=n.parents(".settings-item");if(!i.hasClass("disabled")){var s=i.hasClass("open");N(),s||(i.addClass("open"),n.find(".update .text").text(r.i18n.active().closeSetting),n.find(".update i").removeClass("fa-cog").addClass("fa-times"),i.find(".settings-item-content").slideDown("fast"),i.data("name")==="accountsmanager_account_admins"&&r.renderEditAdminsForm(v,u.id))}}),E.find(".settings-item .cancel").on("click",function(e){e.preventDefault(),N(),t(this).parents("form").first().find("input, select").each(function(e,n){t(n).val(t(n).data("original_value"))}),e.stopPropagation()}),E.find("#accountsmanager_delete_account_btn").on("click",function(e){r.confirmDeleteDialog(u.name,function(){r.callApi({resource:"account.delete",data:{accountId:u.id,data:{},generateError:!1},success:function(e,t){v.find(".main-content").empty(),v.find('.account-list-element[data-id="'+u.id+'"]').remove()},error:function(e,t){e.message==="account_has_descendants"&&i.ui.alert("error",r.i18n.active().account_has_descendants)}})})}),E.find(".resellerAction").on("click",function(e){e.preventDefault();var o=t(this).data("action"),a=o==="promote"?"promoteAccount":"demoteAccount";i.ui.confirm(r.i18n.active()[a].confirm,function(){r.callApi({resource:"account."+o,data:{accountId:u.id},success:function(e,t){s.success(r.i18n.active()[a].success),i.pub("common.accountBrowser.getBreadcrumbsList",{container:v.find(".top-bar"),callback:function(e){r.render({parentId:n.last(e).id,selectedId:u.id,breadcrumbs:e})}})},error:function(e,t){s.error(r.i18n.active().promoteDemoteError)}})})}),E.find("#accountsmanager_use_account_btn").on("click",function(e){e.preventDefault(),i.pub("core.triggerMasquerading",{account:u,callback:function(){r.render()}}),e.stopPropagation()}),E.find(".change").on("click",function(e){e.preventDefault();var s=t(this),o=s.data("module"),a=s.data("field"),f=r.cleanFormData(i.ui.getFormData("form_"+a));i.ui.valid(E.find("#form_"+a))&&r.updateData(u,f,function(e){i.pub("common.accountBrowser.getBreadcrumbsList",{container:v.find(".top-bar"),callback:function(e){r.render({parentId:n.last(e).id,selectedId:u.id,breadcrumbs:e})}})},function(e){e&&e.data&&"api_error"in e.data&&"message"in e.data.api_error&&i.ui.alert(e.data.api_error.message)})});if(i.apps.auth.isReseller){var k=E.find("#accountsmanager_serviceplan_change"),L=E.find("#accountsmanager_serviceplan_reconciliation"),A=E.find("#accountsmanager_serviceplan_synchronization");k.on("click",function(){i.pub("common.servicePlanDetails.getServicePlanTemplate",{accountId:u.id,afterRender:function(e,n){var o=t(i.template(r,"changeServicePlanDialog"));o.find(".common-container").append(e),o.find("#save_custom_plans").on("click",function(){i.pub("common.servicePlanDetails.customizeSave",{previousPlans:n.selectedPlans,container:o.find(".common-container"),accountId:u.id,divResult:E.find(".serviceplans-details-container"),callback:function(){a.dialog("close"),s.success(r.i18n.active().changeServicePlanDialog.successUpdate)}})});var a=i.ui.dialog(o,{title:r.i18n.active().changeServicePlanDialog.title})}})}),L.click(function(e){e.preventDefault(),!L.hasClass("disabled")&&!A.hasClass("disabled")&&(L.addClass("disabled"),A.addClass("disabled"),r.callApi({resource:"servicePlan.reconciliate",data:{accountId:u.id,data:{}},success:function(e,t){s.success(r.i18n.active().toastrMessages.servicePlanReconciliationSuccess,"",{timeOut:5e3}),L.removeClass("disabled"),A.removeClass("disabled")},error:function(e,t){s.error(r.i18n.active().toastrMessages.servicePlanReconciliationError,"",{timeOut:5e3}),L.removeClass("disabled"),A.removeClass("disabled")}}))}),A.click(function(e){e.preventDefault(),!L.hasClass("disabled")&&!A.hasClass("disabled")&&(L.addClass("disabled"),A.addClass("disabled"),r.callApi({resource:"servicePlan.synchronize",data:{accountId:u.id,data:{}},success:function(e,t){s.success(r.i18n.active().toastrMessages.servicePlanSynchronizationSuccess,"",{timeOut:5e3}),L.removeClass("disabled"),A.removeClass("disabled")},error:function(e,t){s.error(r.i18n.active().toastrMessages.servicePlanSynchronizationError,"",{timeOut:5e3}),L.removeClass("disabled"),A.removeClass("disabled")}}))})}o.populateDropdown(E.find("#accountsmanager_account_timezone"),u.timezone),E.find("#accountsmanager_account_timezone").chosen({search_contains:!0,width:"220px"}),i.ui.tooltips(E),f&&i.pub("common.servicePlanDetails.render",{container:E.find(".serviceplans-details-container"),accountId:u.id,servicePlan:f,useOwnPlans:u.is_reseller}),r.renderLimitsTab({accountData:u,limits:l,balance:c,formattedClassifiers:b,servicePlan:f,parent:E.find("#accountsmanager_limits_tab")}),r.renderRestrictionsTab({accountData:u,parent:E.find("#accountsmanager_restrictions_tab")}),i.ui.validate(E.find("#form_accountsmanager_account_realm"),{rules:{realm:{realm:!0}}}),v.find(".main-content").empty().append(E),p&&E.find("."+p+" > a").tab("show"),C.find("div.dropdown-menu input").on("click",function(){return!1}).change(function(){t(this).parents("div.dropdown-menu").siblings("a.dropdown-toggle").dropdown("toggle")}).keydown("esc",function(){this.value="",t(this).change()}),i.ui.wysiwyg(C.find(".wysiwyg-container.notes")).html(u.custom_notes),C.find("#accountsmanager_notes_save").on("click",function(){var e=C.find(".notes .wysiwyg-editor").html();r.updateData(u,{custom_notes:e},function(e,t){u=e.data,i.pub("common.accountBrowser.getBreadcrumbsList",{container:v.find(".top-bar"),callback:function(e){r.render({parentId:n.last(e).id,selectedId:u.id,breadcrumbs:e,selectedTab:"tab-notes",callback:function(){s.success(r.i18n.active().toastrMessages.notesUpdateSuccess,"",{timeOut:5e3})}})}})},function(e,t){s.error(r.i18n.active().toastrMessages.notesUpdateError,"",{timeOut:5e3})})}),i.ui.wysiwyg(C.find(".wysiwyg-container.announcement")).html(u.announcement);var O=function(e,t){u=e.data,i.pub("common.accountBrowser.getBreadcrumbsList",{container:v.find(".top-bar"),callback:function(e){r.render({parentId:n.last(e).id,selectedId:u.id,breadcrumbs:e,selectedTab:"tab-notes",callback:function(){s.success(r.i18n.active().toastrMessages.notesUpdateSuccess,"",{timeOut:5e3})}})}})},M=function(e,t){s.error(r.i18n.active().toastrMessages.notesUpdateError,"",{timeOut:5e3})};C.find("#accountsmanager_announcement_delete").on("click",function(){delete u.announcement,r.updateAccount(u,O,M)}),C.find("#accountsmanager_announcement_save").on("click",function(){var e=C.find(".announcement .wysiwyg-editor").html();r.updateData(u,{announcement:e},O,M)}),E.find("#accountsmanager_appstore_tab .app-toggle").on("change",function(){t(this).parents(".app-row").toggleClass("blacklisted")}),E.find("#accountsmanager_appstore_tab #accountsmanager_appstore_save").on("click",function(){var e={blacklist:t.map(E.find("#accountsmanager_appstore_tab .app-toggle:not(:checked)"),function(e){return t(e).data("id")})};r.callApi({resource:"appsStore.updateBlacklist",data:{accountId:u.id,data:e},success:function(e,t){i.pub("common.accountBrowser.getBreadcrumbsList",{container:v.find(".top-bar"),callback:function(e){r.render({parentId:n.last(e).id,selectedId:u.id,breadcrumbs:e,selectedTab:"tab-appstore",callback:function(){s.success(r.i18n.active().toastrMessages.appstoreUpdateSuccess,"",{timeOut:5e3})}})}})},error:function(e,t){s.error(r.i18n.active().toastrMessages.appstoreUpdateError,"",{timeOut:5e3})}})}),E.find("#accountsmanager_numbersfeatures_save").on("click",function(){r.callApi({resource:"account.get",data:{accountId:u.id},success:function(e,o){r.callApi({resource:"account.update",data:{accountId:u.id,data:t.extend(!0,{},e.data,{numbers_features:i.ui.getFormData("accountsmanager_numbersfeatures_form")})},success:function(e,t){i.pub("common.accountBrowser.getBreadcrumbsList",{container:v.find(".top-bar"),callback:function(e){r.render({parentId:n.last(e).id,selectedId:u.id,breadcrumbs:e,selectedTab:"tab-numbersfeatures",callback:function(){s.success(r.i18n.active().toastrMessages.appstoreUpdateSuccess,"",{timeOut:5e3})}})}})}})}})}),t.each(E.find("form"),function(){var e={};this.id==="accountsmanager_callrestrictions_form"&&(e.rules={addCreditBalance:{number:!0,min:5}}),i.ui.validate(t(this),e)}),typeof m=="function"&&m(E)},confirmDeleteDialog:function(e,n){var r=this,s=r.i18n.active().deleteAccountDialog.deleteKey,o=i.ui.confirm(i.template(r,"deleteAccountDialog",{accountName:e}),function(){n&&n()},null,{title:r.i18n.active().deleteAccountDialog.title,confirmButtonText:r.i18n.active().deleteAccountDialog.deleteAccount,htmlContent:!0});o.find("#confirm_button").prop("disabled",!0),o.find("#delete_input").on("keyup",function(){t(this).val()===s?o.find("#confirm_button").prop("disabled",!1):o.find("#confirm_button").prop("disabled",!0)})},renderLimitsTab:function(e){var r=this,o=e.parent,u=e.limits,a=e.balance,f=e.accountData,l=r.getLimitsTabContent(e),c=l.find(".add-credit-input"),h=l.find(".trunks-div.twoway"),p=l.find(".trunks-div.inbound"),d=l.find(".trunks-div.outbound");l.find(".change-credits").on("click",function(){var n={amount:e.balance.toFixed(2)},o=t(i.template(r,"updateCreditsDialog",n)),u=o.find(".add-credits-header .value"),a=l.find(".credit-balance"),c=o.find("#amount_add"),h=o.find("#amount_remove"),p=function(t,n){r.getBalance(t,function(t){e.balance=t.data.balance;var i=r.i18n.active().currencyUsed+""+e.balance.toFixed(2);u.html(i),a.html(i),n.val(""),s.success(r.i18n.active().updateCreditDialog.successfulUpdate)})},d=o.find("#add_credit_form"),v=o.find("#remove_credit_form"),m={rules:{amount:{number:!0,min:5}}};i.ui.validate(d,m),i.ui.validate(v,m),i.ui.tooltips(o),o.find(".add-credit").on("click",function(){i.ui.valid(d)&&r.addCredit(f.id,c.val(),function(e){p(f.id,c)})}),o.find(".remove-credit").on("click",function(){i.ui.valid(v)&&r.removeCredit(f.id,h.val(),function(e){p(f.id,h)})});var g=i.ui.dialog(o,{title:r.i18n.active().updateCreditDialog.title})}),o.find("#accountsmanager_limits_save").click(function(a){a.preventDefault();var v=h.find(".slider-div").slider("value"),m=p.find(".slider-div").slider("value"),g=d.find(".slider-div").slider("value"),y=i.ui.getFormData("accountsmanager_callrestrictions_form").limits.call_restriction,b=c.val(),w=l.find(".allow-prepay-ckb").is(":checked");i.ui.valid(o.find("#accountsmanager_callrestrictions_form"))&&(t.each(e.formattedClassifiers,function(e,t){if(!(t.id in y)||y[t.id].action!=="inherit")y[t.id]={action:"deny"}}),f.call_restriction=y,i.parallel({limits:function(e){r.callApi({resource:"limits.update",data:{accountId:f.id,data:t.extend(!0,{},u,{twoway_trunks:v,inbound_trunks:m,outbound_trunks:g,allow_prepay:w,call_restriction:y})},success:function(t,n){s.success(r.i18n.active().toastrMessages.limitsUpdateSuccess,"",{timeOut:5e3}),e&&e(null,t.data)},error:function(t,n){t.error!==402&&s.error(r.i18n.active().toastrMessages.limitsUpdateError,"",{timeOut:5e3}),e&&e(null,null)}})},restrictions:function(e){r.callApi({resource:"account.update",data:{accountId:f.id,data:f},success:function(t,n){s.success(r.i18n.active().toastrMessages.callRestrictionsUpdateSuccess,"",{timeOut:5e3}),e&&e(null,t.data)},error:function(t,n){s.error(r.i18n.active().toastrMessages.callRestrictionsUpdateError,"",{timeOut:5e3}),e&&e(null,null)}})}},function(e,s){i.pub("common.accountBrowser.getBreadcrumbsList",{container:t("#accounts_manager_view .content .top-bar"),callback:function(e){r.render({parentId:n.last(e).id,selectedId:f.id,breadcrumbs:e,selectedTab:"tab-limits"})}})}))}),o.find("#accountsmanager_callrestrictions_form").append(l)},getLimitsTabContent:function(e){var n=this,r=e.formattedClassifiers,s=e.limits||{},o=t(i.template(n,"limitsTabContent",{mode:e.hasOwnProperty("accountData")?"update":"create",balance:e.balance||0,classifiers:r,allowPrepay:s.hasOwnProperty("allow_prepay")?s.allow_prepay:!0,disableBraintree:i.config.disableBraintree})),u=s.twoway_trunks||0,a=o.find(".trunks-div.twoway"),f=s.inbound_trunks||0,l=o.find(".trunks-div.inbound"),c=s.outbound_trunks||0,h=o.find(".trunks-div.outbound"),p=function(e){var t=e.trunksDiv,n=t.find(".slider-value"),r=t.find(".trunks-value");t.find(".slider-div").slider({min:e.minValue,max:e.maxValue,range:"min",value:e.currentValue,slide:function(e,i){n.html(i.value).css("left",t.find(".ui-slider-handle").css("left")),r.val(i.value)},change:function(e,r){n.css("left",t.find(".ui-slider-handle").css("left"))}}),n.css("left",t.find(".ui-slider-handle").css("left"))};return p({trunksDiv:a,minValue:0,maxValue:100,currentValue:u}),p({trunksDiv:l,minValue:0,maxValue:100,currentValue:f}),p({trunksDiv:h,minValue:0,maxValue:100,currentValue:c}),a.find(".slider-value").html(u),l.find(".slider-value").html(f),h.find(".slider-value").html(c),i.ui.tooltips(o),o},renderRestrictionsTab:function(e){var r=this,o=e.parent,u=e.accountData,a=r.getRestrictionsTabContent(e);o.find("#accountsmanager_uirestrictions_form").append(a),i.ui.tooltips(o),o.find("#accountsmanager_uirestrictions_save").click(function(e){e.preventDefault();var o=i.ui.getFormData("accountsmanager_uirestrictions_form").account,a=["account","balance","billing","inbound","outbound","service_plan","transactions","user"];u.hasOwnProperty("ui_restrictions")&&a.forEach(function(e){u.ui_restrictions.hasOwnProperty("myaccount")&&delete u.ui_restrictions[e]}),r.updateData(u,o,function(e,o){i.pub("common.accountBrowser.getBreadcrumbsList",{container:t("#accounts_manager_view .content .top-bar"),callback:function(e){r.render({parentId:n.last(e).id,selectedId:u.id,breadcrumbs:e,selectedTab:"tab-restrictions",callback:function(){s.success(r.i18n.active().toastrMessages.uiRestrictionsUpdateSuccess,"",{timeOut:5e3})}})}})},function(e,t){s.error(r.i18n.active().toastrMessages.uiRestrictionsUpdateError,"",{timeOut:5e3})})})},getRestrictionsTabContent:function(e){var n=this,r=e.hasOwnProperty("accountData")&&e.accountData.hasOwnProperty("ui_restrictions")?e.accountData.ui_restrictions.myaccount||e.accountData.ui_restrictions:{},s=t(i.template(n,"restrictionsTabContent",{ui_restrictions:r}));return s.find(".restrictions-element input").each(function(){t(this).is(":checked")?t(this).closest("a").addClass("enabled"):t(this).closest("a").removeClass("enabled")}),s.find(".restrictions-element input").on("change",function(e){var n=t(this),r=n.closest("li"),i=r.data("content")?r.data("content"):!1;n.is(":checked")?(n.closest("a").addClass("enabled"),s.find(".restrictions-right ."+i+" input").prop("checked",!0)):(n.closest("a").removeClass("enabled"),s.find(".restrictions-right ."+i+" input").prop("checked",!1)),r.click()}),s.find(".restrictions-element[data-content]").on("click",function(){var e=t(this),n=e.data("content");e.find("input").is(":checked")?(s.find(".restrictions-menu .restrictions-element").each(function(){t(this).removeClass("active")}),s.find(".restrictions-right > div").each(function(){t(this).removeClass("active")}),s.find(".restrictions-right ."+n).addClass("active"),e.addClass("active")):(s.find(".restrictions-right ."+n).removeClass("active"),e.removeClass("active"))}),s.find(".restrictions-right input").on("change",function(e){var n=t(this).parents().eq(2),r=!1;n.data("content")!=="restrictions-balance"&&(n.find("input").each(function(){t(this).is(":checked")&&(r=!0)}),r||s.find('.restrictions-menu li[data-content="'+n.data("content")+'"] input').prop("checked",!1))}),s},adjustTabsWidth:function(e){var n=0;t.each(e,function(){t(this).width()>n&&(n=t(this).width())}),e.css("min-width",n+"px")},cleanMergedData:function(e){var t=this;return"reseller"in e&&delete e.reseller,"language"in e&&e.language==="auto"&&delete e.language,e},cleanFormData:function(e){return"enabled"in e&&(e.enabled=e.enabled==="false"?!1:!0),delete e.extra,e},updateData:function(e,n,r,i){var s=this,o=t.extend(!0,{},e,n);o=s.cleanMergedData(o),s.updateAccount(o,r,i)},updateAccount:function(e,t,n){var r=this;r.callApi({resource:"account.update",data:{accountId:e.id,data:e},success:function(e,n){t&&t(e,n)},error:function(e,t){n&&n(e,t)}})},autoGeneratePassword:function(){return i.util.randomString(4,"abcdefghjkmnpqrstuvwxyz")+i.util.randomString(4,"0123456789")},getDataNoMatchCallflow:function(e,t){var n=this,r={numbers:["no_match"],flow:{children:{},data:{},module:"offnet"}};return e!=="useBlended"&&(r.flow.module="resources",e==="useReseller"&&(r.flow.data.hunt_account_id=t)),r},createNoMatchCallflow:function(e,t){var n=this,r=i.config.whitelabel.hasOwnProperty("carrier")?i.config.whitelabel.carrier.choices[0]:!1,s=e.type||r||"useBlended",o=e.accountId,u=e.resellerId,a=n.getDataNoMatchCallflow(s,u);n.callApi({resource:"callflow.create",data:{accountId:o,data:a},success:function(e,n){t(e.data)},error:function(e){t()}})},updateNoMatchCallflow:function(e,t){var n=this,r=e.type,i=e.accountId,s=e.callflowId,o=e.resellerId,u=n.getDataNoMatchCallflow(r,o);n.callApi({resource:"callflow.update",data:{accountId:i,callflowId:s,data:u},success:function(e,n){t(e.data)}})},addCredit:function(e,t,n,r){var i=this,s={resource:"balance.add",data:{accountId:e,data:{amount:parseFloat(t)}},success:function(e,t){n&&n(e)}};r&&typeof r=="function"&&(s.data.generateError=!1,s.error=function(e,t){r&&r(e)}),i.callApi(s)},removeCredit:function(e,t,n,r){var i=this;i.callApi({resource:"balance.remove",data:{accountId:e,data:{amount:parseFloat(t)},generateError:!1},success:function(e,t){n&&n(e)},error:function(e,t){r&&r(e)}})},getBalance:function(e,t,n){var r=this;r.callApi({resource:"balance.get",data:{accountId:e},success:function(e,n){t&&t(e)},error:function(e,t){n&&n(e)}})}};return u});