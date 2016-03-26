define(["require","jquery","underscore","monster"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i={requests:{},subscribe:{"callflows.fetchActions":"mediaDefineActions","callflows.media.editPopup":"mediaPopupEdit","callflows.media.edit":"_mediaEdit"},mediaRender:function(e,n,i){function a(e){var n=e.val();switch(n){case"tts":t(".tts",o).show(),t(".file",o).hide();break;case"upload":t(".tts",o).hide(),t(".file",o).show()}}var s=this,o=t(r.template(s,"media-edit",e)),u=o.find("#media-form");r.ui.validate(u,{rules:{name:{required:!0}}}),t('*[rel=popover]:not([type="text"])',o).popover({trigger:"hover"}),t('*[rel=popover][type="text"]',o).popover({trigger:"focus"}),s.winkstartTabs(o),e.data.id&&t("#upload_div",o).hide(),t("#change_link",o).click(function(e){e.preventDefault(),t("#upload_div",o).show(),t(".player_file",o).hide()}),t("#download_link",o).click(function(t){t.preventDefault(),window.location.href=s.apiUrl+(s.apiUrl.substring(s.apiUrl.length-1)!="/"?"/":"")+"accounts/"+s.accountId+"/media/"+e.data.id+"/raw?auth_token="+s.authToken}),t("#file",o).bind("change",function(e){var t=e.target.files;if(t.length>0){var n=new FileReader;file="updating",n.onloadend=function(e){var t=e.target.result;file=t},n.readAsDataURL(t[0])}}),a(t("#media_type",o)),t("#media_type",o).change(function(){a(t(this))}),t(".media-save",o).click(function(n){n.preventDefault();if(r.ui.valid(u)){var a=r.ui.getFormData("media-form");a=s.mediaCleanFormData(a),s.mediaSave(a,e,function(n,u){a.tts?typeof i.save_success=="function"&&i.save_success(n,u):t("#upload_div",o).is(":visible")&&t("#file").val()!=""?file==="updating"?r.ui.alert(s.i18n.active().callflows.media.the_file_you_want_to_apply):s.mediaUpload(file,n.id,function(){typeof i.save_success=="function"&&i.save_success(n,u)},function(){e&&e.data&&e.data.id?s.mediaSave({},e,function(){typeof i.save_success=="function"&&i.save_success(n,u)}):s.mediaDelete(n.id,i.delete_success,i.delete_error),typeof i.save_error=="function"&&i.save_error(n,u)}):typeof i.save_success=="function"&&i.save_success(n,u)})}else r.ui.alert(s.i18n.active().callflows.media.there_were_errors_on_the_form)}),t(".media-delete",o).click(function(t){t.preventDefault(),r.ui.confirm(s.i18n.active().callflows.media.are_you_sure_you_want_to_delete,function(){s.mediaDelete(e.data.id,i.delete_success,i.delete_error)})}),n.empty().append(o)},mediaCleanFormData:function(e){return e.description=e.upload_media,e.description==""&&delete e.description,e.media_source=="tts"?e.description="tts file":delete e.tts,delete e.media_type,e},_mediaEdit:function(e){var t=this;t.mediaEdit(e.data,e.parent,e.target,e.callbacks,e.data_defaults)},mediaEdit:function(e,n,r,i,s){var o=this,u=n||t("#media-content"),a=r||t("#media-view",u),i=i||{},f={save_success:i.save_success,save_error:i.save_error,delete_success:i.delete_success,delete_error:i.delete_error,after_render:i.after_render},l={data:t.extend(!0,{streamable:!0},s||{})};typeof e=="object"&&e.id?o.mediaGet(e.id,function(e){o.mediaFormatData(e),o.mediaRender(t.extend(!0,l,{data:e}),a,f),typeof f.after_render=="function"&&f.after_render()}):(o.mediaRender(l,a,f),typeof f.after_render=="function"&&f.after_render())},mediaSave:function(e,n,r,i){var s=this,o=s.mediaNormalizeData(t.extend(!0,{},n.data,e));typeof n.data=="object"&&n.data.id?s.mediaUpdate(o,function(e,t){typeof r=="function"&&r(e,t,"update")}):s.mediaCreate(o,function(e,t){typeof r=="function"&&r(e,t,"create")})},mediaNormalizeData:function(e){return delete e.upload_media,"field_data"in e&&delete e.field_data,e.media_source=="upload"&&delete e.tts,e},mediaFormatData:function(e){return e.streamable=="false"?e.streamable=!1:e.streamable=="true"&&(e.streamable=!0),e.description!=undefined&&e.description.substr(0,12)=="C:\\fakepath\\"&&(e.description=e.description.substr(12)),e},mediaPopupEdit:function(e){var n=this,i=e.data,s=e.callback,o=e.data_defaults||{},u,a=t('<div class="inline_popup callflows-port"><div class="inline_content main_content"/></div>');n.mediaEdit(i,a,t(".inline_content",a),{save_success:function(e){u.dialog("close"),typeof s=="function"&&s(e)},delete_success:function(){u.dialog("close"),typeof s=="function"&&s({data:{}})},after_render:function(){u=r.ui.dialog(a,{title:i.id?n.i18n.active().callflows.media.edit_media:n.i18n.active().callflows.media.create_media})}},o)},mediaDefineActions:function(e){var n=this,i=e.actions;t.extend(i,{"play[id=*]":{name:n.i18n.active().callflows.media.play_media,icon:"play",category:n.i18n.active().oldCallflows.basic_cat,module:"play",tip:n.i18n.active().callflows.media.play_media_tip,data:{id:"null"},rules:[{type:"quantity",maxSize:"1"}],isUsable:"true",weight:10,caption:function(e,t){var n=e.getMetadata("id"),r="";return n in t&&(r=t[n].name),r},edit:function(e,i){var s=this;n.mediaList(function(s){var o,u;u=t(r.template(n,"media-callflowEdit",{items:r.util.sort(s),selected:e.getMetadata("id")||""})),t("#media_selector option:selected",u).val()==undefined&&t("#edit_link",u).hide(),t(".inline_action",u).click(function(r){var i=t(this).data("action")=="edit"?{id:t("#media_selector",u).val()}:{};r.preventDefault(),n.mediaPopupEdit({data:i,callback:function(t){e.setMetadata("id",t.id||"null"),e.caption=t.name||"",o.dialog("close")}})}),t("#add",u).click(function(){e.setMetadata("id",t("#media_selector",u).val()),e.caption=t("#media_selector option:selected",u).text(),o.dialog("close")}),o=r.ui.dialog(u,{title:n.i18n.active().callflows.media.media,minHeight:"0",beforeClose:function(){typeof i=="function"&&i()}})})},listEntities:function(e){n.callApi({resource:"media.list",data:{accountId:n.accountId,filters:{paginate:!1}},success:function(t,n){e&&e(t.data)}})},editEntity:"callflows.media.edit"}})},mediaList:function(e){var t=this;t.callApi({resource:"media.list",data:{accountId:t.accountId,filters:{paginate:!1}},success:function(t){e&&e(t.data)}})},mediaGet:function(e,t){var n=this;n.callApi({resource:"media.get",data:{accountId:n.accountId,mediaId:e},success:function(e){t&&t(e.data)}})},mediaCreate:function(e,t){var n=this;n.callApi({resource:"media.create",data:{accountId:n.accountId,data:e},success:function(e){t&&t(e.data)}})},mediaUpdate:function(e,t){var n=this;n.callApi({resource:"media.update",data:{accountId:n.accountId,mediaId:e.id,data:e},success:function(e){t&&t(e.data)}})},mediaDelete:function(e,t){var n=this;n.callApi({resource:"media.delete",data:{accountId:n.accountId,mediaId:e},success:function(e){t&&t(e.data)}})},mediaUpload:function(e,t,n){var r=this;r.callApi({resource:"media.upload",data:{accountId:r.accountId,mediaId:t,data:e},success:function(e,t){n&&n(e,t)}})}};return i});