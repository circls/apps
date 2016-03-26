define(["require","jquery","underscore","monster","monster-timezone"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("monster-timezone"),s={requests:{},subscribe:{"callflows.fetchActions":"vmboxDefineActions","callflows.vmbox.edit":"_vmboxEdit"},vmboxPopupEdit:function(e){var n=this,i=e.data,s=e.callback,o=e.data_defaults||{},u,a=t('<div class="inline_popup callflows-port"><div class="inline_content main_content"/></div>');n.vmboxEdit(i,a,t(".inline_content",a),{save_success:function(e){u.dialog("close"),typeof s=="function"&&s(e)},delete_success:function(){u.dialog("close"),typeof s=="function"&&s({data:{}})},after_render:function(){u=r.ui.dialog(a,{title:i.id?n.i18n.active().callflows.vmbox.edit_voicemail_box_title:n.i18n.active().callflows.vmbox.create_voicemail_box_title})}},o)},_vmboxEdit:function(e){var t=this;t.vmboxEdit(e.data,e.parent,e.target,e.callbacks,e.data_defaults)},vmboxEdit:function(e,n,i,s,o){var u=this,a=n||t("#vmbox-content"),f=i||t("#vmbox-view",a),s=s||{},l={save_success:s.save_success,save_error:s.save_error,delete_success:s.delete_success,delete_error:s.delete_error,after_render:s.after_render},c={data:t.extend(!0,{require_pin:!0,check_if_owner:!0,pin:"",media:{},timezone:"inherit"},o||{}),field_data:{users:[],media:[]}};r.parallel({media_list:function(e){u.vmboxMediaList(function(t){t.unshift({id:"",name:u.i18n.active().callflows.vmbox.not_set}),c.field_data.media=t,e(null,t)})},user_list:function(e){u.vmboxUserList(function(t){t.unshift({id:"",first_name:u.i18n.active().callflows.vmbox.no,last_name:u.i18n.active().callflows.vmbox.owner}),c.field_data.users=t,e(null,t)})},get_vmbox:function(t){typeof e=="object"&&e.id?u.vmboxGet(e.id,function(e){t(null,e)}):t(null,{})}},function(n,r){var i=c;typeof e=="object"&&e.id&&(i=t.extend(!0,c,{data:r.get_vmbox})),u.vmboxRender(i,f,l),typeof l.after_render=="function"&&l.after_render()})},vmboxRender:function(e,n,s){var o=this,u=t(r.template(o,"vmbox-edit",e)),a=u.find("#vmbox-form");i.populateDropdown(t("#timezone",u),e.data.timezone||"inherit",{inherit:o.i18n.active().defaultTimezone}),r.ui.validate(a,{rules:{mailbox:{required:!0,digits:!0},pin:{digits:!0,minlength:4},name:{required:!0}}}),t('*[rel=popover]:not([type="text"])',u).popover({trigger:"hover"}),t('*[rel=popover][type="text"]',u).popover({trigger:"focus"}),o.winkstartTabs(u),t("#owner_id",u).change(function(){t(this).val()&&o.callApi({resource:"user.get",data:{accountId:o.accountId,userId:t(this).val()},success:function(e){"timezone"in e.data&&t("#timezone",u).val(e.data.timezone)}})}),t("#owner_id",u).val()||t("#edit_link",u).hide(),t("#owner_id",u).change(function(){t("#owner_id option:selected",u).val()?t("#edit_link",u).show():(t("#edit_link",u).hide(),t("#timezone",u).val(i.getLocaleTimezone()))}),t(".inline_action",u).click(function(e){var n=t(this).data("action")=="edit"?{id:t("#owner_id",u).val()}:{},i=n.id;e.preventDefault(),r.pub("callflows.user.popupEdit",{data:n,callback:function(e){i?"id"in e.data?(t("#owner_id #"+e.data.id,u).text(e.data.first_name+" "+e.data.last_name),t("#timezone",u).val(e.data.timezone)):(t("#owner_id #"+i,u).remove(),t("#edit_link",u).hide(),t("#timezone",u).val("America/Los_Angeles")):(t("#owner_id",u).append('<option id="'+e.data.id+'" value="'+e.data.id+'">'+e.data.first_name+" "+e.data.last_name+"</option>"),t("#owner_id",u).val(e.data.id),t("#edit_link",u).show(),t("#timezone",u).val(e.data.timezone))}})}),t("#media_unavailable",u).val()||t("#edit_link_media",u).hide(),t("#media_unavailable",u).change(function(){t("#media_unavailable option:selected",u).val()?t("#edit_link_media",u).show():t("#edit_link_media",u).hide()}),t(".inline_action_media",u).click(function(e){var n=t(this).data("action")=="edit"?{id:t("#media_unavailable",u).val()}:{},i=n.id;e.preventDefault(),r.pub("callflows.media.editPopup",{data:n,callback:function(e){i?"id"in e.data?t("#media_unavailable #"+e.data.id,u).text(e.data.name):(t("#media_unavailable #"+i,u).remove(),t("#edit_link_media",u).hide()):(t("#media_unavailable",u).append('<option id="'+e.data.id+'" value="'+e.data.id+'">'+e.data.name+"</option>"),t("#media_unavailable",u).val(e.data.id),t("#edit_link_media",u).show())}})}),t(".vmbox-save",u).click(function(t){t.preventDefault();if(r.ui.valid(a)){var n=r.ui.getFormData("vmbox-form");"field_data"in e&&delete e.field_data,o.vmboxSave(n,e,s.save_success)}}),t(".vmbox-delete",u).click(function(t){t.preventDefault(),r.ui.confirm(o.i18n.active().callflows.vmbox.are_you_sure_you_want_to_delete,function(){o.vmboxDelete(e.data.id,s.delete_success)})}),n.empty().append(u)},vmboxSave:function(e,n,r,i){var s=this,o=s.vmboxNormalizeData(t.extend(!0,{},n.data,e));typeof n.data=="object"&&n.data.id?s.vmboxUpdate(o,function(e,t){typeof r=="function"&&r(e,t,"update")}):s.vmboxCreate(o,function(e,t){typeof r=="function"&&r(e,t,"create")})},vmboxNormalizeData:function(e){return e.owner_id||delete e.owner_id,e.media.unavailable||delete e.media.unavailable,e.pin===""&&delete e.pin,e.timezone&&e.timezone==="inherit"&&delete e.timezone,e.not_configurable=!e.extra.allow_configuration,delete e.extra,e},vmboxDefineActions:function(e){var n=this,i=e.actions;t.extend(i,{"voicemail[id=*]":{name:n.i18n.active().callflows.vmbox.voicemail,icon:"voicemail",category:n.i18n.active().oldCallflows.basic_cat,module:"voicemail",tip:n.i18n.active().callflows.vmbox.voicemail_tip,data:{id:"null"},rules:[{type:"quantity",maxSize:"1"}],isUsable:"true",weight:50,caption:function(e,t){var n=e.getMetadata("id"),r="";return n in t&&(r=t[n].name),r},edit:function(e,i){var s=this;n.vmboxList(function(s){var o,u;u=t(r.template(n,"vmbox-callflowEdit",{items:r.util.sort(s),selected:e.getMetadata("id")||""})),t("#vmbox_selector option:selected",u).val()==undefined&&t("#edit_link",u).hide(),t(".inline_action",u).click(function(r){var i=t(this).data("action")=="edit"?{id:t("#vmbox_selector",u).val()}:{};r.preventDefault(),n.vmboxPopupEdit({data:i,callback:function(t){e.setMetadata("id",t.id||"null"),e.caption=t.name||"",o.dialog("close")}})}),t("#add",u).click(function(){e.setMetadata("id",t("#vmbox_selector",u).val()),e.caption=t("#vmbox_selector option:selected",u).text(),o.dialog("close")}),o=r.ui.dialog(u,{title:n.i18n.active().callflows.vmbox.voicemail_title,minHeight:"0",beforeClose:function(){typeof i=="function"&&i()}})})},listEntities:function(e){n.callApi({resource:"voicemail.list",data:{accountId:n.accountId,filters:{paginate:!1}},success:function(t,n){e&&e(t.data)}})},editEntity:"callflows.vmbox.edit"},"voicemail[action=check]":{name:n.i18n.active().callflows.vmbox.check_voicemail,icon:"voicemail",category:n.i18n.active().oldCallflows.advanced_cat,module:"voicemail",tip:n.i18n.active().callflows.vmbox.check_voicemail_tip,data:{action:"check"},rules:[{type:"quantity",maxSize:"1"}],isUsable:"true",weight:120,caption:function(e,t){return""},edit:function(e,t){typeof t=="function"&&t()}}})},vmboxList:function(e){var t=this;t.callApi({resource:"voicemail.list",data:{accountId:t.accountId,filters:{paginate:!1}},success:function(t){e&&e(t.data)}})},vmboxGet:function(e,t){var n=this;n.callApi({resource:"voicemail.get",data:{accountId:n.accountId,voicemailId:e},success:function(e){t&&t(e.data)}})},vmboxCreate:function(e,t){var n=this;n.callApi({resource:"voicemail.create",data:{accountId:n.accountId,data:e},success:function(e){t&&t(e.data)}})},vmboxUpdate:function(e,t){var n=this;n.callApi({resource:"voicemail.update",data:{accountId:n.accountId,voicemailId:e.id,data:e},success:function(e){t&&t(e.data)}})},vmboxDelete:function(e,t){var n=this;n.callApi({resource:"voicemail.delete",data:{accountId:n.accountId,voicemailId:e},success:function(e){t&&t(e.data)}})},vmboxMediaList:function(e){var t=this;t.callApi({resource:"media.list",data:{accountId:t.accountId,filters:{paginate:!1}},success:function(t){e&&e(t.data)}})},vmboxUserList:function(e){var t=this;t.callApi({resource:"user.list",data:{accountId:t.accountId,filters:{paginate:!1}},success:function(t){e&&e(t.data)}})}};return s});