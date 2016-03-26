define(["require","jquery","underscore","monster","mask"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("mask"),s={requests:{"callflows.device.getProvisionerPhones":{apiRoot:r.config.api.provisioner,url:"phones/",verb:"GET",headers:{Accept:"*/*"}}},subscribe:{"callflows.fetchActions":"deviceDefineActions","callflows.device.popupEdit":"devicePopupEdit","callflows.device.edit":"_deviceEdit"},devicePopupEdit:function(e){var n=this,i,s,o=e.data,u=e.callback,a=e.data_defaults;s=t('<div class="inline_popup callflows-port"><div class="inline_content main_content"/></div>'),n.deviceEdit(o,s,t(".inline_content",s),{save_success:function(e){i.dialog("close"),typeof u=="function"&&u(e)},delete_success:function(){i.dialog("close"),typeof u=="function"&&u({data:{}})},after_render:function(){i=r.ui.dialog(s,{title:o.id?n.i18n.active().callflows.device.edit_device:n.i18n.active().callflows.device.create_device})}},a)},_deviceEdit:function(e){var t=this;t.deviceEdit(e.data,e.parent,e.target,e.callbacks,e.data_defaults)},deviceEdit:function(e,i,s,o,u){var a=this,f=i||t("#device-content"),l=s||t("#device-view",f),o=o||{},c={save_success:o.save_success,save_error:o.save_error||function(e,t,n){t==200&&n=="mac_address"&&r.ui.alert(a.i18n.active().callflows.device.this_mac_address_is_already_in_use)},delete_success:o.delete_success,delete_error:o.delete_error,after_render:o.after_render},h={data:t.extend(!0,{enabled:!0,caller_id:{external:{},internal:{},emergency:{}},ringtones:{},call_restriction:{closed_groups:"inherit"},media:{secure_rtp:"none",peer_to_peer:"auto",audio:{codecs:["PCMU","PCMA"]},video:{codecs:[]},fax:{option:"false"},fax_option:!1},sip:{method:"password",invite_format:"username",username:"user_"+r.util.randomString(6),password:r.util.randomString(12),expire_seconds:"360"},contact_list:{exclude:!1},call_forward:{},music_on_hold:{}},u||{}),field_data:{users:[],call_restriction:{},sip:{methods:{password:a.i18n.active().callflows.device.password,ip:"IP"},invite_formats:{username:"Username",npan:"NPA NXX XXXX",e164:"E. 164"}},media:{secure_rtp:{value:"none",options:{none:a.i18n.active().callflows.device.none,srtp:a.i18n.active().callflows.device.srtp,zrtp:a.i18n.active().callflows.device.zrtp}},peer_to_peer_options:{auto:a.i18n.active().callflows.device.automatic,"true":a.i18n.active().callflows.device.always,"false":a.i18n.active().callflows.device.never},fax:{options:{auto:a.i18n.active().callflows.device.auto_detect,"true":a.i18n.active().callflows.device.always_force,"false":a.i18n.active().callflows.device.disabled}},audio:{codecs:{OPUS:"OPUS","CELT@32000h":"Siren @ 32Khz","G7221@32000h":"G722.1 @ 32khz","G7221@16000h":"G722.1 @ 16khz",G722:"G722","speex@32000h":"Speex @ 32khz","speex@16000h":"Speex @ 16khz",PCMU:"G711u / PCMU - 64kbps (North America)",PCMA:"G711a / PCMA - 64kbps (Elsewhere)",G729:"G729 - 8kbps (Requires License)",GSM:"GSM","CELT@48000h":"Siren (HD) @ 48kHz","CELT@64000h":"Siren (HD) @ 64kHz"}},video:{codecs:{VP8:"VP8",H264:"H264",H263:"H263",H261:"H261"}}},hide_owner:e.hide_owner||!1,outbound_flags:e.outbound_flags?e.outbound_flags.join(", "):e.outbound_flags},functions:{inArray:function(e,n){return n?t.inArray(e,n)==-1?!1:!0:!1}}},p=function(i){r.parallel({list_classifier:function(e){a.callApi({resource:"numbers.listClassifiers",data:{accountId:a.accountId,filters:{paginate:!1}},success:function(n){"data"in n&&t.each(n.data,function(e,t){h.field_data.call_restriction[e]={friendly_name:t.friendly_name},h.data.call_restriction[e]={action:"inherit"}}),e(null,n)}})},account:function(e){a.callApi({resource:"account.get",data:{accountId:a.accountId},success:function(n,r){t.extend(h.field_data.sip,{realm:n.data.realm}),e(null,n)}})},user_list:function(e){a.callApi({resource:"user.list",data:{accountId:a.accountId,filters:{paginate:!1}},success:function(t,r){t.data.sort(function(e,t){return(e.first_name+e.last_name).toLowerCase()<(t.first_name+t.last_name).toLowerCase()?-1:1}),t.data.unshift({id:"",first_name:"- No",last_name:"owner -"});if(i.hasOwnProperty("device_type")&&i.device_type==="mobile"){var s=n.find(t.data,function(e,t){return e.id===i.owner_id});s?h.field_data.users=s:h.field_data.users={first_name:"- No",last_name:"owner -"}}else h.field_data.users=t.data;e(null,t)}})},media_list:function(e){a.callApi({resource:"media.list",data:{accountId:a.accountId,filters:{paginate:!1}},success:function(t,n){t.data.unshift({id:"",name:a.i18n.active().callflows.device.default_music},{id:"silence_stream://300000",name:a.i18n.active().callflows.device.silence}),h.field_data.music_on_hold=t.data,e(null,t)}})},provisionerData:function(e){r.config.api.hasOwnProperty("provisioner")&&r.config.api.provisioner?a.deviceGetDataProvisoner(function(t){e(null,t)}):e(null,{})}},function(n,r){var s=a.devicePrepareDataForTemplate(e,h,t.extend(!0,r,{get_device:i}));a.deviceRender(s,l,c),typeof c.after_render=="function"&&c.after_render()})};typeof e=="object"&&e.id?a.deviceGet(e.id,function(e,t){h.data.device_type="sip_device","media"in e&&"encryption"in e.media&&(h.field_data.media.secure_rtp.value=e.media.encryption.enforce_security?e.media.encryption.methods[0]:"none"),"sip"in e&&"realm"in e.sip&&(h.field_data.sip.realm=e.sip.realm),a.deviceMigrateData(e),p(e)}):p(h)},devicePrepareDataForTemplate:function(e,r,i){var s=this,o=i.get_device,u=i.provisionerData;typeof e=="object"&&e.id&&(r=t.extend(!0,r,{data:o})),o.hasOwnProperty("media")&&o.media.hasOwnProperty("audio")&&(o.media.audio.hasOwnProperty("codecs")&&(r.data.media.audio.codecs=o.media.audio.codecs),o.media.video.hasOwnProperty("codecs")&&(r.data.media.video.codecs=o.media.video.codecs)),n.each(r.field_data.call_restriction,function(e,t){e.value=r.data.call_restriction[t].action}),r.field_data.provisioner=u,r.field_data.provisioner.isEnabled=!n.isEmpty(u);if(r.field_data.provisioner.isEnabled){var a={endpoint_brand:"yealink",endpoint_model:"t22",voicemail_beep:1,time_format:"12",hotline:"",vlan:{enable:!1,number:""},date_format:"middle-endian"};r.data.provision=t.extend(!0,{},a,r.data.provision)}return r},deviceGetValidationByDeviceType:function(e){var t={sip_uri:{},sip_device:{mac_address:{mac:!0},sip_expire_seconds:{digits:!0}},fax:{mac_address:{mac:!0},sip_expire_seconds:{digits:!0}},cellphone:{},smartphone:{sip_expire_seconds:{digits:!0}},landline:{},softphone:{sip_expire_seconds:{digits:!0}},mobile:{mdn:{digits:!0},sip_expire_seconds:{digits:!0}}};return{rules:t[e]}},deviceRender:function(e,n,i){var s=this,o,u;"media"in e.data&&"fax_option"in e.data.media&&(e.data.media.fax_option=e.data.media.fax_option==="auto"||e.data.media.fax_option===!0);if(typeof e.data=="object"&&e.data.device_type){o=t(r.template(s,"device-"+e.data.device_type,e));var a=o.find("#device-form");r.config.api.hasOwnProperty("provisioner")&&r.config.api.provisioner&&s.deviceSetProvisionerStuff(o,e),t.inArray(e.data.device_type,["fax","softphone","sip_device","smartphone","mobile"])>-1&&r.ui.protectField(o.find("#sip_password"),o),r.ui.validate(a,s.deviceGetValidationByDeviceType(e.data.device_type)),t("#owner_id",o).val()||t("#edit_link",o).hide(),o.find("#mac_address").mask("hh:hh:hh:hh:hh:hh",{placeholder:" "}),t("#owner_id",o).change(function(){t("#owner_id option:selected",o).val()?t("#edit_link",o).show():t("#edit_link",o).hide()}),t(".inline_action",o).click(function(e){var n=t(this).data("action")=="edit"?{id:t("#owner_id",o).val()}:{},i=n.id;e.preventDefault(),r.pub("callflows.user.popupEdit",{data:n,callback:function(e){i?n.hasOwnProperty("id")?t("#owner_id #"+e.id,o).text(e.first_name+" "+e.last_name):(t("#owner_id #"+i,o).remove(),t("#edit_link",o).hide()):(t("#owner_id",o).append('<option id="'+e.id+'" value="'+e.id+'">'+e.first_name+" "+e.last_name+"</option>"),t("#owner_id",o).val(e.id),t("#edit_link",o).show())}})}),t(".device-save",o).click(function(n){n.preventDefault();if(r.ui.valid(a)){var u=r.ui.getFormData("device-form");s.deviceCleanFormData(u),u.hasOwnProperty("provision")&&u.provision.hasOwnProperty("endpoint_brand")&&(u.provision.endpoint_model=t('.dropdown_family[data-brand="'+u.provision.endpoint_brand+'"]',o).val(),u.provision.endpoint_family=t("#"+u.provision.endpoint_model,o).parents("optgroup").data("family")),s.deviceSave(u,e,i.save_success)}else r.ui.alert("error",s.i18n.active().callflows.device.there_were_errors_on_the_form)}),e.device_type!=="mobile"&&t(".device-delete",o).click(function(t){t.preventDefault(),r.ui.confirm(s.i18n.active().callflows.device.are_you_sure_you_want_to_delete,function(){s.deviceDelete(e.data.id,i.delete_success)})}),t("#music_on_hold_media_id",o).val()||t("#edit_link_media",o).hide(),e.data.sip&&e.data.sip.method==="ip"?t("#username_block",o).hide():t("#ip_block",o).hide(),o.find("#sip_method").on("change",function(){t("#sip_method option:selected",o).val()==="ip"?(t("#ip_block",o).slideDown(),t("#username_block",o).slideUp()):(t("#username_block",o).slideDown(),t("#ip_block",o).slideUp())}),t("#music_on_hold_media_id",o).change(function(){t("#music_on_hold_media_id option:selected",o).val()?t("#edit_link_media",o).show():t("#edit_link_media",o).hide()}),t(".inline_action_media",o).click(function(e){var n=t(this).data("action")=="edit"?{id:t("#music_on_hold_media_id",o).val()}:{},i=n.id;e.preventDefault(),r.pub("callflows.media.editPopup",{data:n,callback:function(e){i?e.hasOwnProperty("id")?t("#music_on_hold_media_id #"+e.id,o).text(e.name):(t("#music_on_hold_media_id #"+i,o).remove(),t("#edit_link_media",o).hide()):(t("#music_on_hold_media_id",o).append('<option id="'+e.id+'" value="'+e.id+'">'+e.name+"</option>"),t("#music_on_hold_media_id",o).val(e.id),t("#edit_link_media",o).show())}})})}else o=t(r.template(s,"device-general_edit")),t(".media_pane",o).hide(),t(".media_tabs .buttons",o).click(function(){var n=t(this);t(".media_pane",o).show(),n.hasClass("current")||(t(".media_tabs .buttons").removeClass("current"),n.addClass("current"),e.data.device_type=n.attr("device_type"),s.deviceFormatData(e),s.deviceRender(e,t(".media_pane",o),i))});t('*[rel=popover]:not([type="text"])',o).popover({trigger:"hover"}),t('*[rel=popover][type="text"]',o).popover({trigger:"focus"}),s.winkstartTabs(o),n.empty().append(o),t('.media_tabs .buttons[device_type="sip_device"]',o).trigger("click")},deviceSetProvisionerStuff:function(e,n){var r=this,i=function(t,r){t in n.field_data.provisioner.brands&&(e.find("#dropdown_brand").val(t),e.find(".dropdown_family").hide(),e.find('.dropdown_family[data-brand="'+t+'"]').show().val(r))},s=n.data.provision,o={"00085d":"aastra","0010bc":"aastra","00036b":"cisco","00000c":"cisco","000142":"cisco","000143":"cisco","000163":"cisco","000164":"cisco","000196":"cisco","000197":"cisco","0001c7":"cisco","0001c9":"cisco","000f23":"cisco","0013c4":"cisco","0016c8":"cisco","001818":"cisco","00175a":"cisco","001795":"cisco","001A2f":"cisco","001c58":"cisco","001dA2":"cisco","002155":"cisco","000e84":"cisco","000e38":"cisco","00070e":"cisco","001bd4":"cisco","001930":"cisco","0019aa":"cisco","001d45":"cisco","001ef7":"cisco","000e08":"cisco","1cdf0f":"cisco",e05fb9:"cisco","5475d0":"cisco",c46413:"cisco","000Ffd3":"digium","000b82":"grandstream","08000f":"mitel","1045bE":"norphonic","0050c2":"norphonic","0004f2":"polycom","00907a":"polycom","000413":"snom","001f9f":"thomson","00147f":"thomson",642400:"xorcom","001565":"yealink"};i(s.endpoint_brand,s.endpoint_model),e.find("#dropdown_brand").on("change",function(){i(t(this).val())}),e.find("#mac_address").on("keyup",function(){var e=t(this).val().replace(/[^0-9a-fA-F]/g,"");e in o&&i(o[e])})},deviceFormatData:function(e){e.data.device_type==="smartphone"||e.data.device_type==="landline"||e.data.device_type==="cellphone"?e.data.call_forward={enabled:!0,require_keypress:!0,keep_caller_id:!0}:e.data.call_forward={enabled:!1},e.data.device_type==="sip_uri"&&(e.data.sip.invite_format="route"),e.data.device_type==="mobile"&&("mobile"in e.data||(e.data.mobile={mdn:""})),e.data.device_type==="fax"?(e.data.media.fax_option=!0,e.data.media.fax.option="true"):(e.data.media.fax_option=!1,e.data.media.fax.option="false")},deviceMigrateData:function(e){var t=this;if(e.hasOwnProperty("media")&&e.media.hasOwnProperty("audio")&&e.media.audio.hasOwnProperty("codecs")){var r={Speex:"speex@16000h",G722_16:"G7221@16000h",G722_32:"G7221@32000h",CELT_48:"CELT@48000h",CELT_64:"CELT@64000h"},i=[];n.each(e.media.audio.codecs,function(e){r.hasOwnProperty(e)?i.push(r[e]):i.push(e)}),e.media.audio.codecs=i}return e.device_type=="cell_phone"&&(e.device_type="cellphone"),typeof e.media=="object"&&typeof e.media.fax=="object"&&"codecs"in e.media.fax&&delete e.media.fax.codecs,"status"in e&&(e.enabled=e.status,delete e.status),e.hasOwnProperty("ignore_complete_elsewhere")&&(e.ignore_completed_elsewhere=e.ignore_complete_elsewhere,delete e.ignore_complete_elsewhere),e},deviceNormalizeData:function(e){"provision"in e&&e.provision.voicemail_beep!==0&&delete e.provision.voicemail_beep,e.hasOwnProperty("media")&&e.media.hasOwnProperty("fax_option")&&e.media.fax_option==="auto"&&delete e.media.fax_option,"media"in e&&"fax"in e.media&&"fax_option"in e.media&&(e.media.fax.option=e.media.fax_option.toString()),"media"in e&&"secure_rtp"in e.media&&delete e.media.secure_rtp,"media"in e&&"bypass_media"in e.media&&delete e.media.bypass_media,e.caller_id.internal.number==""&&e.caller_id.internal.name==""&&delete e.caller_id.internal,e.caller_id.external.number==""&&e.caller_id.external.name==""&&delete e.caller_id.external,e.caller_id.emergency.number==""&&e.caller_id.emergency.name==""&&delete e.caller_id.emergency,e.music_on_hold.media_id||delete e.music_on_hold.media_id,e.owner_id||delete e.owner_id,t.isEmptyObject(e.call_forward)&&delete e.call_forward,e.mac_address||delete e.mac_address,e.sip.method!="ip"&&delete e.sip.ip;if(typeof e.outbound_flags=="string"){e.outbound_flags=e.outbound_flags.split(/,/);var n=[];t.each(e.outbound_flags,function(e,t){t.replace(/\s/g,"")!==""&&n.push(t)}),e.outbound_flags=n}return e.device_type==="fax"&&("outbound_flags"in e?e.outbound_flags.indexOf("fax")<0&&e.outbound_flags.splice(0,0,"fax"):e.outbound_flags=["fax"]),e.ringtones&&"internal"in e.ringtones&&e.ringtones.internal===""&&delete e.ringtones.internal,e.ringtones&&"external"in e.ringtones&&e.ringtones.external===""&&delete e.ringtones.external,t.inArray(e.device_type,["fax","mobile","softphone","sip_device","smartphone"])<0&&delete e.call_restriction,e.hasOwnProperty("presence_id")&&e.presence_id===""&&delete e.presence_id,e},deviceCleanFormData:function(e){"provision"in e&&e.provision.voicemail_beep===!0&&(e.provision.voicemail_beep=0),e.mac_address&&(e.mac_address=e.mac_address.toLowerCase(),e.mac_address.match(/^(((\d|([a-f]|[A-F])){2}-){5}(\d|([a-f]|[A-F])){2})$/)?e.mac_address=e.mac_address.replace(/-/g,":"):e.mac_address.match(/^(((\d|([a-f]|[A-F])){2}){5}(\d|([a-f]|[A-F])){2})$/)&&(e.mac_address=e.mac_address.replace(/(.{2})/g,"$1:").slice(0,-1))),e.caller_id&&(e.caller_id.internal.number=e.caller_id.internal.number.replace(/\s|\(|\)|\-|\./g,""),e.caller_id.external.number=e.caller_id.external.number.replace(/\s|\(|\)|\-|\./g,""),e.caller_id.emergency.number=e.caller_id.emergency.number.replace(/\s|\(|\)|\-|\./g,"")),"media"in e&&"audio"in e.media&&(e.media.audio.codecs=t.map(e.media.audio.codecs,function(e){return e?e:null})),"media"in e&&"video"in e.media&&(e.media.video.codecs=t.map(e.media.video.codecs,function(e){return e?e:null}));if(e.device_type=="smartphone"||e.device_type=="landline"||e.device_type=="cellphone")e.call_forward.number=e.call_forward.number.replace(/\s|\(|\)|\-|\./g,""),e.enabled=e.call_forward.enabled;return"extra"in e&&e.extra.notify_unregister===!0?e.suppress_unregister_notifications=!1:e.suppress_unregister_notifications=!0,"extra"in e&&"closed_groups"in e.extra&&(e.call_restriction.closed_groups={action:e.extra.closed_groups?"deny":"inherit"}),t.inArray(e.device_type,["sip_device","mobile","softphone"])>-1&&"extra"in e&&(e.media.encryption=e.media.encryption||{},t.inArray(e.extra.encryptionMethod,["srtp","zrtp"])>-1?(e.media.encryption.enforce_security=!0,e.media.encryption.methods=[e.extra.encryptionMethod]):(e.media.encryption.methods=[],e.media.encryption.enforce_security=!1)),delete e.extra,e},deviceFixArrays:function(e,t){return typeof e.media=="object"&&typeof t.media=="object"&&((e.media.audio||{}).codecs=(t.media.audio||{}).codecs,(e.media.video||{}).codecs=(t.media.video||{}).codecs),"media"in t&&"encryption"in t.media&&"methods"in t.media.encryption&&(e.media.encryption=e.media.encryption||{},e.media.encryption.methods=t.media.encryption.methods),e},deviceSave:function(e,n,r){var i=this,s=typeof n.data=="object"&&n.data.id?n.data.id:undefined,o=i.deviceFixArrays(i.deviceNormalizeData(t.extend(!0,{},n.data,e)),e);s?i.deviceUpdate(o,function(e,t){r&&r(e,t,"update")}):i.deviceCreate(o,function(e,t){r&&r(e,t,"create")})},deviceList:function(e){var t=this;t.callApi({resource:"device.list",data:{accountId:t.accountId,filters:{paginate:!1}},success:function(t){e&&e(t.data)}})},deviceGet:function(e,t){var n=this;n.callApi({resource:"device.get",data:{accountId:n.accountId,deviceId:e},success:function(e){t&&t(e.data)}})},deviceCreate:function(e,t){var n=this;n.callApi({resource:"device.create",data:{accountId:n.accountId,data:e},success:function(e){t&&t(e.data)}})},deviceUpdate:function(e,t){var n=this;n.callApi({resource:"device.update",data:{accountId:n.accountId,deviceId:e.id,data:e},success:function(e){t&&t(e.data)}})},deviceDelete:function(e,t){var n=this;n.callApi({resource:"device.delete",data:{accountId:n.accountId,deviceId:e},success:function(e){t&&t(e.data)}})},deviceGetDataProvisoner:function(e){var t=this;r.request({resource:"callflows.device.getProvisionerPhones",data:{},success:function(n){n=t.deviceFormatDataProvisioner(n.data),e&&e(n)}})},deviceFormatDataProvisioner:function(e){var t=this,n={brands:e};return n},deviceDefineActions:function(e){var n=this,i=e.actions;t.extend(i,{"device[id=*]":{name:n.i18n.active().callflows.device.device,icon:"phone",category:n.i18n.active().oldCallflows.advanced_cat,module:"device",tip:n.i18n.active().callflows.device.device_tip,data:{id:"null"},rules:[{type:"quantity",maxSize:"1"}],isUsable:"true",weight:10,caption:function(e,t){var n=e.getMetadata("id"),r="";return n in t&&(r=t[n].name),r},edit:function(e,i){var s=this;n.deviceList(function(s){var o,u;u=t(r.template(n,"device-callflowEdit",{can_call_self:e.getMetadata("can_call_self")||!1,parameter:{name:"timeout (s)",value:e.getMetadata("timeout")||"20"},objects:{items:r.util.sort(s),selected:e.getMetadata("id")||""}})),t("#device_selector option:selected",u).val()==undefined&&t("#edit_link",u).hide(),t(".inline_action",u).click(function(r){var i=t(this).data("action")==="edit"?{id:t("#device_selector",u).val()}:{};r.preventDefault(),n.devicePopupEdit({data:i,callback:function(n){e.setMetadata("id",n.id||"null"),e.setMetadata("timeout",t("#parameter_input",u).val()),e.setMetadata("can_call_self",t("#device_can_call_self",u).is(":checked")),e.caption=n.name||"",o.dialog("close")}})}),t("#add",u).click(function(){e.setMetadata("id",t("#device_selector",u).val()),e.setMetadata("timeout",t("#parameter_input",u).val()),e.setMetadata("can_call_self",t("#device_can_call_self",u).is(":checked")),e.caption=t("#device_selector option:selected",u).text(),o.dialog("close")}),o=r.ui.dialog(u,{title:n.i18n.active().callflows.device.device_title,beforeClose:function(){typeof i=="function"&&i()}})})},listEntities:function(e){n.callApi({resource:"device.list",data:{accountId:n.accountId,filters:{paginate:!1}},success:function(t,n){e&&e(t.data)}})},editEntity:"callflows.device.edit"}})}};return s});