define(["require","jquery","underscore","monster","toastr","isotope"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("toastr"),s=e("isotope"),o={name:"appstore",css:["app"],i18n:{"en-US":{customCss:!1},"fr-FR":{customCss:!1},"ru-RU":{customCss:!1}},requests:{},subscribe:{},load:function(e){var t=this;t.initApp(function(){e&&e(t)})},initApp:function(e){var t=this;r.pub("auth.initApp",{app:t,callback:e})},render:function(e){var n=this,i=t(r.template(n,"app")),s=e||t("#monster-content");n.loadData(function(e){n.renderApps(i,e),n.bindEvents(i,e)}),s.empty().append(i)},bindEvents:function(e,n){var r=this,i=e.find(".search-bar input.search-query");setTimeout(function(){i.focus()}),e.find(".app-filter").on("click",function(n){var r=t(this),s=r.data("filter");e.find(".app-filter").removeClass("active"),r.addClass("active"),e.find(".app-list").isotope({filter:".app-element"+(s?"."+s:"")}),i.val("").focus()}),e.find(".app-list-container").on("click",".app-element",function(e){r.showAppPopup(t(this).data("id"),n)}),i.on("keyup",function(n){var r=t(this).val(),i=e.find(".app-filter.active").data("filter"),s=".app-element"+(i?"."+i:"");r&&(s+='[data-name*="'+r+'"]'),e.find(".app-list").isotope({filter:".app-element"+s})})},loadData:function(e){var t=this;r.parallel({apps:function(e){t.callApi({resource:"appsStore.list",data:{accountId:t.accountId},success:function(t,n){e(null,t.data)}})},account:function(e){t.callApi({resource:"account.get",data:{accountId:t.accountId},success:function(t,n){e(null,t.data)}})},users:function(e){t.callApi({resource:"user.list",data:{accountId:t.accountId},success:function(t,n){e(null,t.data)}})}},function(i,s){var o=function(e,n){t.callApi({resource:"appsStore.getIcon",data:{accountId:t.accountId,appId:e,generateError:!1},success:function(r,i){n&&n(t.apiUrl+"accounts/"+t.accountId+"/apps_store/"+e+"/icon?auth_token="+t.authToken)},error:function(e,t){n&&n(null)}})},u=[];s.apps.forEach(function(e,t){if(e.hasOwnProperty("allowed_users")&&e.allowed_users!=="specific"||e.hasOwnProperty("users")&&e.users.length>0)e.tags?e.tags.push("installed"):e.tags=["installed"];var n=e.i18n[r.config.whitelabel.language]||e.i18n["en-US"];e.label=n.label,e.description=n.description,u.push(function(t){o(e.id,function(e){t(null,e)})}),delete e.i18n}),r.parallel(u,function(t,r){n.each(s.apps,function(e,t){e.icon=r[t]}),e(s)})})},renderApps:function(e,n){var i=this,s=n.apps,o=t(r.template(i,"appList",{apps:s}));e.find(".app-list-container").empty().append(o),e.find(".app-list").isotope({getSortData:{name:function(e){return e.find(".app-title").text()}},sortBy:"name"})},showAppPopup:function(e,i){var s=this,o=t.extend(!0,[],i.users);s.callApi({resource:"appsStore.get",data:{accountId:s.accountId,appId:e},success:function(e,u){var a=e.data,f=a.i18n[r.config.whitelabel.language]||a.i18n["en-US"],l=t.extend(!0,a,{extra:{label:f.label,description:f.description,extendedDescription:f.extended_description,features:f.features,icon:n.find(i.apps,function(e){return e.id===a.id}).icon,screenshots:n.map(a.screenshots||[],function(e,t){return s.apiUrl+"apps_store/"+a.id+"/screenshot/"+t+"?auth_token="+s.authToken})}}),c=l.users?l.users.length:0,h=n.map(l.users||[],function(e){return e.id}),p=n.map(o,function(e,t){return h.indexOf(e.id)>=0&&(e.selected=!0),e}),d=t(r.template(s,"appPopup",{isWhitelabeling:r.util.isWhitelabeling(),app:l,users:p,i18n:{selectedUsers:c,totalUsers:p.length}})),v=d.find(".left-container"),m=d.find(".right-container"),g=m.find(".user-list");!l.hasOwnProperty("allowed_users")||l.allowed_users==="specific"&&(l.users||[]).length===0?(m.find("#app_switch").prop("checked",!1),m.find(".permissions-bloc").hide()):l.allowed_users==="admins"?m.find("#app_popup_admin_only_radiobtn").prop("checked",!0):l.users&&l.users.length>0&&(m.find("#app_popup_specific_users_radiobtn").prop("checked",!0),m.find(".permissions-link").show(),m.find("#app_popup_select_users_link").html(r.template(s,"!"+s.i18n.active().selectUsersLink,{selectedUsers:c}))),s.bindPopupEvents(d,l,i),m.find(".selected-users-number").html(c),m.find(".total-users-number").html(p.length),r.ui.dialog(d,{title:l.extra.label}),d.find("#screenshot_carousel").carousel()}})},bindPopupEvents:function(e,i,s){var o=this,u=e.find(".user-list"),a=function(e,n,r){var s=e.hasOwnProperty("allowed_users")?i.hasOwnProperty("allowed_users")?"appsStore.update":"appsStore.add":"appsStore.delete";o.callApi({resource:s,data:{accountId:o.accountId,appId:i.id,data:e},success:function(e,r){t("#apploader").remove(),n&&n()},error:function(e,t){r&&r()}})};e.find("#app_switch").on("change",function(){t(this).is(":checked")?e.find(".permissions-bloc").slideDown():e.find(".permissions-bloc").slideUp()}),e.find('.permissions-bloc input[name="permissions"]').on("change",function(n){var r=t(this).val();r==="specific"?e.find(".permissions-link").show():e.find(".permissions-link").hide()}),e.find("#app_popup_select_users_link").on("click",function(t){t.preventDefault(),e.find(".app-details-view").hide(),e.find(".user-list-view").show(),e.find(".search-query").focus(),e.find(".user-list").css("height",e.find(".user-list-buttons").position().top-(e.find(".user-list-links").position().top+e.find(".user-list-links").outerHeight())+"px")}),u.on("change","input",function(t){e.find(".selected-users-number").html(u.find('input[type="checkbox"]:checked').length)}),e.find(".user-list-links a").on("click",function(n){n.preventDefault(),u.find('input[type="checkbox"]').prop("checked",t(this).data("action")==="check"),e.find(".selected-users-number").html(u.find('input[type="checkbox"]:checked').length)}),e.find(".user-list-filter input.search-query").on("keyup",function(e){var n=t(this).val().toLowerCase();n?t.each(u.find(".user-list-element"),function(){var e=t(this);e.data("name").toLowerCase().indexOf(n)>=0?e.show():e.hide()}):u.find(".user-list-element").show()}),e.find("#user_list_cancel").on("click",function(n){n.preventDefault(),t.each(u.find("input"),function(){var e=t(this);e.prop("checked",e.data("original")==="check")}),e.find(".user-list-view").hide(),e.find(".app-details-view").show()}),e.find("#user_list_save").on("click",function(n){n.preventDefault();var i=r.ui.getFormData("app_popup_user_list_form").users;i?(t.each(u.find("input"),function(){t(this).data("original",this.checked?"check":"uncheck")}),e.find("#app_popup_select_users_link").html(r.template(o,"!"+o.i18n.active().selectUsersLink,{selectedUsers:i.length})),e.find(".user-list-view").hide(),e.find(".app-details-view").show()):r.ui.alert(o.i18n.active().alerts.noUserSelected)}),e.find("#appstore_popup_cancel").on("click",function(){e.closest(":ui-dialog").dialog("close")}),e.find("#appstore_popup_save").on("click",function(){if(e.find("#app_switch").is(":checked")){var s=e.find('.permissions-bloc input[name="permissions"]:checked').val(),u=r.ui.getFormData("app_popup_user_list_form").users||[];s==="specific"&&u.length===0?r.ui.alert(o.i18n.active().alerts.noUserSelected):a({allowed_users:s,users:s==="specific"?t.map(u,function(e){return{id:e}}):[]},function(){var s=r.config.whitelabel.language,u=s.substr(0,3).concat(s.substr(s.length-2,2).toUpperCase()),a=i.i18n.hasOwnProperty(u)?u:"en-US",f={api_url:i.api_url,icon:o.apiUrl+"accounts/"+o.accountId+"/apps_store/"+i.id+"/icon?auth_token="+o.authToken,id:i.id,label:i.i18n[a].label,name:i.name};i.hasOwnProperty("source_url")&&(f.source_url=i.source_url),!r.util.isMasquerading()&&!n.find(r.apps.auth.installedApps,function(e){return e.id===i.id})&&r.apps.auth.installedApps.push(f),t('#appstore_container .app-element[data-id="'+i.id+'"]').addClass("installed"),t("#appstore_container .app-filter.active").click(),e.closest(":ui-dialog").dialog("close")})}else a({},function(){r.util.isMasquerading()||(r.apps.auth.installedApps=r.apps.auth.installedApps.filter(function(e,t){return e.id!==i.id})),t('#appstore_container .app-element[data-id="'+i.id+'"]').removeClass("installed"),t("#appstore_container .app-filter.active").click(),e.closest(":ui-dialog").dialog("close")})})}};return o});