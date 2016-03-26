define(["require","jquery","underscore","monster"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i={requests:{},subscribe:{"callflows.fetchActions":"menuDefineActions","callflows.menu.edit":"_menuEdit"},_menuEdit:function(e){var t=this;t.menuEdit(e.data,e.parent,e.target,e.callbacks,e.data_defaults)},menuEdit:function(e,i,s,o,u){var a=this,f=i||t("#menu-content"),l=s||t("#menu-view",f),o=o||{},c={save_success:o.save_success,save_error:o.save_error,delete_success:o.delete_success,delete_error:o.delete_error,after_render:o.after_render},h={data:t.extend(!0,{retries:"3",timeout:"10",max_extension_length:"4",media:{}},u||{}),field_data:{media:[]}};r.parallel({media_list:function(e){a.callApi({resource:"media.list",data:{accountId:a.accountId,filters:{paginate:!1}},success:function(t,r){n.each(t.data,function(e){e.media_source&&(e.name="["+e.media_source.substring(0,3).toUpperCase()+"] "+e.name)}),t.data.unshift({id:"",name:a.i18n.active().callflows.menu.not_set}),h.field_data.media=t.data,e(null,t)}})},menu_get:function(t){typeof e=="object"&&e.id?a.menuGet(e.id,function(e,n){a.menuformatData(e),t(null,{data:e})}):t(null,{})}},function(n,r){var i=h;typeof e=="object"&&e.id&&(i=t.extend(!0,h,r.menu_get)),a.menuRender(i,l,c),typeof c.after_render=="function"&&c.after_render()})},menuPopupEdit:function(e,n,i){var s=this,o,u=t('<div class="inline_popup callflows-port"><div class="inline_content main_content"/></div>');s.menuEdit(e,u,t(".inline_content",u),{save_success:function(e){o.dialog("close"),typeof n=="function"&&n(e)},delete_success:function(){o.dialog("close"),typeof n=="function"&&n({data:{}})},after_render:function(){o=r.ui.dialog(u,{title:e.id?s.i18n.active().callflows.menu.edit_menu:s.i18n.active().callflows.menu.create_menu})}},i)},menuRender:function(e,n,i){var s=this,o=t(r.template(s,"menu-edit",e)),u=o.find("#menu-form");r.ui.validate(u,{rules:{retries:{digits:!0},record_pin:{digits:!0},timeout:{number:!0,max:10},max_extension_length:{digits:!0}}}),t('*[rel=popover]:not([type="text"])',o).popover({trigger:"hover"}),t('*[rel=popover][type="text"]',o).popover({trigger:"focus"}),s.winkstartTabs(o),t("#media_greeting",o).val()||t("#edit_link_media",o).hide(),t("#media_greeting",o).change(function(){t("#media_greeting option:selected",o).val()?t("#edit_link_media",o).show():t("#edit_link_media",o).hide()}),t(".inline_action_media",o).click(function(e){var n=t(this).data("action")=="edit"?{id:t("#media_greeting",o).val()}:{},i=n.id;e.preventDefault(),r.pub("callflows.media.editPopup",{data:n,callback:function(e){i?"id"in e.data?t("#media_greeting #"+e.data.id,o).text(e.data.name):(t("#media_greeting #"+i,o).remove(),t("#edit_link_media",o).hide()):(t("#media_greeting",o).append('<option id="'+e.data.id+'" value="'+e.data.id+'">'+e.data.name+"</option>"),t("#media_greeting",o).val(e.data.id),t("#edit_link_media",o).show())}})}),t(".menu-save",o).click(function(t){t.preventDefault();if(r.ui.valid(u)){var n=r.ui.getFormData("menu-form");s.menuCleanFormData(n),"field_data"in e&&delete e.field_data,s.menuSave(n,e,i.save_success)}else r.ui.alert("error",s.i18n.active().callflows.menu.there_were_errors_on_the_form)}),t(".menu-delete",o).click(function(t){t.preventDefault(),r.ui.confirm(s.i18n.active().callflows.menu.are_you_sure_you_want_to_delete,function(){s.menuDelete(e.data.id,i.delete_success,i.delete_error)})}),n.empty().append(o)},menuSave:function(e,n,r){var i=this,s=i.menuNormalizeData(t.extend(!0,{},n.data,e));typeof n.data=="object"&&n.data.id?i.menuUpdate(s,function(e,t){r&&r(e,t,"update")}):i.menuCreate(s,function(e,t){r&&r(e,t,"create")})},menuformatData:function(e){e.timeout&&(e.timeout/=1e3),e.media&&(e.media.invalid_media===!1&&e.media.transfer_media===!1&&e.media.exit_media===!1?e.suppress_media=!0:e.suppress_media=!1)},menuCleanFormData:function(e){e.record_pin.length==0?e.max_extension_length=4:e.max_extension_length<e.record_pin.length&&(e.max_extension_length=e.record_pin.length),e.timeout=e.timeout*1e3,"suppress_media"in e&&(e.media=e.media||{},e.suppress_media===!0?(e.media.invalid_media=!1,e.media.transfer_media=!1,e.media.exit_media=!1):(e.media.invalid_media=!0,e.media.transfer_media=!0,e.media.exit_media=!0))},menuNormalizeData:function(e){return e.media.greeting||delete e.media.greeting,e.hunt_allow==""&&delete e.hunt_allow,e.hunt_deny==""&&delete e.hunt_deny,e.record_pin==""&&delete e.record_pin,e},menuDefineActions:function(e){var n=this,i=e.actions;t.extend(i,{"menu[id=*]":{name:n.i18n.active().callflows.menu.menu_title,icon:"menu1",category:n.i18n.active().oldCallflows.basic_cat,module:"menu",tip:n.i18n.active().callflows.menu.menu_tip,data:{id:"null"},rules:[{type:"quantity",maxSize:"12"}],isUsable:"true",weight:60,key_caption:function(e,t){var r=e.key;return r!="_"?r:n.i18n.active().callflows.menu.default_action},key_edit:function(e,i){var s,o;o=t(r.template(n,"menu-callflowKey",{items:{_:n.i18n.active().callflows.menu.default_action,0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9","*":"*","#":"#"},selected:e.key})),o.find("#add").on("click",function(){e.key=t("#menu_key_selector",s).val(),e.key_caption=t("#menu_key_selector option:selected",s).text(),s.dialog("close")}),s=r.ui.dialog(o,{title:n.i18n.active().callflows.menu.menu_option_title,minHeight:"0",beforeClose:function(){i&&i()}})},caption:function(e,t){var n=e.getMetadata("id"),r="";return n in t&&(r=t[n].name),r},edit:function(e,i){var s=this;n.menuList(function(s){var o,u;u=t(r.template(n,"menu-callflowEdit",{items:r.util.sort(s),selected:e.getMetadata("id")||""})),t("#menu_selector option:selected",u).val()==undefined&&t("#edit_link",u).hide(),t(".inline_action",u).click(function(r){var i=t(this).data("action")=="edit"?{id:t("#menu_selector",u).val()}:{};r.preventDefault(),n.menuPopupEdit(i,function(t){e.setMetadata("id",t.id||"null"),e.caption=t.name||"",o.dialog("close")})}),u.find("#add").on("click",function(){e.setMetadata("id",t("#menu_selector",o).val()),e.caption=t("#menu_selector option:selected",o).text(),o.dialog("close")}),o=r.ui.dialog(u,{title:n.i18n.active().callflows.menu.menu_title,minHeight:"0",beforeClose:function(){typeof i=="function"&&i()}})})},listEntities:function(e){n.callApi({resource:"menu.list",data:{accountId:n.accountId,filters:{paginate:!1}},success:function(t,n){e&&e(t.data)}})},editEntity:"callflows.menu.edit"}})},menuList:function(e){var t=this;t.callApi({resource:"menu.list",data:{accountId:t.accountId,filters:{paginate:!1}},success:function(t){e&&e(t.data)}})},menuGet:function(e,t){var n=this;n.callApi({resource:"menu.get",data:{accountId:n.accountId,menuId:e},success:function(e){t&&t(e.data)}})},menuCreate:function(e,t){var n=this;n.callApi({resource:"menu.create",data:{accountId:n.accountId,data:e},success:function(e){t&&t(e.data)}})},menuUpdate:function(e,t){var n=this;n.callApi({resource:"menu.update",data:{accountId:n.accountId,menuId:e.id,data:e},success:function(e){t&&t(e.data)}})},menuDelete:function(e,t){var n=this;n.callApi({resource:"menu.delete",data:{accountId:n.accountId,menuId:e},success:function(e){t&&t(e.data)}})}};return i});