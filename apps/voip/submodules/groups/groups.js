define(["require","jquery","underscore","monster","monster-timezone","toastr"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("monster-timezone"),s=e("toastr"),o={requests:{},subscribe:{"voip.groups.render":"groupsRender"},groupsRender:function(e){var i=this,e=e||{},s=e.parent||t(".right-content"),o=e.groupId,u=e.callback,a=!0;i.groupsRemoveOverlay(),i.groupsGetData(function(e){var f=n.find(e.callflows,function(e){return!e.hasOwnProperty("type")});if(f)r.ui.alert("error",i.i18n.active().groups.outdatedGroupsError);else{var l=i.groupsFormatListData(e),c=t(r.template(i,"groups-layout",{countGroups:Object.keys(l.groups).length})),h;n.each(l.groups,function(e){h=r.template(i,"groups-row",e),c.find(".groups-rows").append(h)}),i.groupsBindEvents(c,s),s.empty().append(c),i.groupsCheckWalkthrough();if(o){var p=s.find(".grid-row[data-id="+o+"] .grid-cell");r.ui.highlight(p)}for(var d in l.groups)a=typeof l.groups[d]=="undefined"?!0:!1;a?(s.find(".grid-row.title").css("display","none"),s.find(".no-groups-row").css("display","block")):(s.find(".grid-row.title").css("display","block"),s.find(".no-groups-row").css("display","none")),u&&u()}})},groupsFormatListData:function(e){var t=this,r={};return n.each(e.groups,function(e){r[e.id]=e,r[e.id].extra=t.groupsGetGroupFeatures(e)}),n.each(e.callflows,function(e){if(e.group_id in r)if(e.type==="userGroup"){var t=[],i=[];n.each(e.numbers,function(e){e.length<7?t.push(e):i.push(e)}),r[e.group_id].extra.listCallerId=[],t.length>0&&(r[e.group_id].extra.extension=t[0],n.each(t,function(t){r[e.group_id].extra.listCallerId.push(t)})),r[e.group_id].extra.additionalExtensions=t.length>1,i.length>0&&(r[e.group_id].extra.mainNumber=i[0],n.each(i,function(t){r[e.group_id].extra.listCallerId.push(t)})),r[e.group_id].extra.additionalNumbers=i.length>1,r[e.group_id].extra.callflowId=e.id}else e.type==="baseGroup"&&(r[e.group_id].extra.baseCallflowId=e.id)}),e.groups=r,e},groupsGetGroupFeatures:function(e){var t=this,r={mapFeatures:{call_recording:{icon:"fa fa-microphone",iconColor:"monster-blue",title:t.i18n.active().groups.callRecording.title},ringback:{icon:"fa fa-music",iconColor:"monster-yellow",title:t.i18n.active().groups.ringback.title},next_action:{icon:"fa fa-arrow-right",iconColor:"monster-green",title:t.i18n.active().groups.nextAction.title},forward:{icon:"fa fa-mail-forward",iconColor:"monster-orange",title:t.i18n.active().groups.forward.title},prepend:{icon:"fa fa-file-text-o",iconColor:"monster-pink",title:t.i18n.active().groups.prepend.title}},hasFeatures:!1};return n.each(r.mapFeatures,function(t,n){if("features"in e&&e.features.indexOf(n)>=0||"smartpbx"in e&&n in e.smartpbx&&e.smartpbx[n].enabled)t.active=!0,r.hasFeatures=!0}),r},groupsBindEvents:function(e,i){var s=this;setTimeout(function(){e.find(".search-query").focus()}),e.find(".grid-row:not(.title) .grid-cell").on("click",function(){var n=t(this),i=n.data("type"),o=n.parents(".grid-row"),u=o.data("id");e.find(".edit-groups").slideUp("400",function(){t(this).empty()}),n.hasClass("active")?(e.find(".grid-cell").removeClass("active"),e.find(".grid-row").removeClass("active"),s.groupsRemoveOverlay(),n.css({position:"inline-block","z-index":"0"}),n.parent().siblings(".edit-groups").css({position:"block","z-index":"0","border-top-color":"#a6a7a9"})):(e.find(".grid-cell").removeClass("active"),e.find(".grid-row").removeClass("active"),n.toggleClass("active"),o.toggleClass("active"),n.css({position:"relative","z-index":"2"}),n.parents(".groups-cells").siblings(".edit-groups").css({position:"relative","z-index":"2","border-top-color":"transparent"}),s.groupsGetTemplate(i,u,function(e,n){r.ui.tooltips(e),o.find(".edit-groups").append(e).slideDown(),t("body").append(t('<div id="groups_container_overlay"></div>'))}))}),e.find(".groups-header .search-query").on("keyup",function(){var r=t(this).val().toLowerCase(),i=e.find(".groups-rows .grid-row:not(.title)"),s=e.find(".groups-rows .empty-search-row");n.each(i,function(e){var n=t(e);n.data("search").toLowerCase().indexOf(r)<0?n.hide():n.show()}),i.size()>0&&(i.is(":visible")?s.hide():s.show())}),e.on("click",".cancel-link",function(){e.find(".edit-groups").slideUp("400",function(){t(this).empty(),e.find(".grid-cell.active").css({position:"inline-block","z-index":"0"}),e.find(".grid-row.active .edit-groups").css({position:"block","z-index":"0"}),e.find(".grid-row.active").removeClass("active"),s.groupsRemoveOverlay(),e.find(".grid-cell.active").removeClass("active")})}),e.find(".groups-header .add-group").on("click",function(){s.groupsGetCreationData(function(e){var n=t(r.template(s,"groups-creation",e)),i=n.find("#form_group_creation");r.ui.validate(i),n.find("#create_group").on("click",function(){if(r.ui.valid(i)){var t=s.groupsCreationMergeData(e,n);s.groupsCreate(t,function(e){o.dialog("close").remove(),s.groupsRender({groupId:e.id})})}}),n.find("#group_user_selector .selected-users, #group_user_selector .available-users").sortable({connectWith:".connectedSortable"}).disableSelection();var o=r.ui.dialog(n,{title:s.i18n.active().groups.dialogCreationGroup.title})})}),t("body").on("click","#groups_container_overlay",function(){e.find(".edit-groups").slideUp("400",function(){t(this).empty()}),s.groupsRemoveOverlay(),e.find(".grid-cell.active").css({position:"inline-block","z-index":"0"}),e.find(".grid-row.active").parent().siblings(".edit-groups").css({position:"block","z-index":"0"}),e.find(".grid-cell.active").removeClass("active"),e.find(".grid-row.active").removeClass("active")})},groupsCreationMergeData:function(e,n){var i=r.ui.getFormData("form_group_creation"),s="20",o="0",u={timeout:s,delay:o,endpoint_type:"user"},a=[],f={};n.find(".selected-users li").each(function(){var e=t(this).data("user_id"),n=t.extend(!0,{},u,{id:e});f[e]={type:"user"},a.push(n)});var l={group:{name:i.name,endpoints:f},baseCallflow:{numbers:[r.util.randomString(25)],name:i.name+" Base Group",flow:{module:"ring_group",children:{},data:{strategy:"simultaneous",timeout:parseInt(s)+parseInt(o),endpoints:a}},type:"baseGroup"},callflow:{numbers:[i.extra.extension],name:i.name+" Ring Group",flow:{module:"callflow",children:{_:{module:"play",children:{},data:{id:"system_media/vm-not_available_no_voicemail"}}},data:{id:""}},type:"userGroup"}};return l},groupsGetTemplate:function(e,t,n){var r=this,i;e==="name"?r.groupsGetNameTemplate(t,n):e==="numbers"?r.groupsGetNumbersTemplate(t,n):e==="extensions"?r.groupsGetExtensionsTemplate(t,n):e==="features"?r.groupsGetFeaturesTemplate(t,n):e==="members"&&r.groupsGetMembersTemplate(t,n)},groupsGetFeaturesTemplate:function(e,n){var i=this;i.groupsGetFeaturesData(e,function(e){template=t(r.template(i,"groups-features",e.group)),i.groupsBindFeatures(template,e),n&&n(template,e)})},groupsGetNameTemplate:function(e,n){var i=this;i.groupsGetNameData(e,function(e){template=t(r.template(i,"groups-name",e)),i.groupsBindName(template,e),n&&n(template,e)})},groupsGetNumbersTemplate:function(e,n){var i=this;i.groupsGetNumbersData(e,function(e){i.groupsFormatNumbersData(e,function(e){template=t(r.template(i,"groups-numbers",t.extend(!0,{},e,{isCnamEnabled:r.util.isNumberFeatureEnabled("cnam"),isE911Enabled:r.util.isNumberFeatureEnabled("e911")}))),i.groupsBindNumbers(template,e),n&&n(template,e)})})},groupsGetExtensionsTemplate:function(e,n){var i=this;i.groupsGetNumbersData(e,function(e){i.groupsFormatNumbersData(e,function(e){template=t(r.template(i,"groups-extensions",e)),i.groupsBindExtensions(template,e),n&&n(template,e)})})},groupsGetMembersTemplate:function(e,n){var i=this;i.groupsGetMembersData(e,function(e){var e=i.groupsFormatMembersData(e);template=t(r.template(i,"groups-members",e)),r.pub("common.ringingDurationControl.render",{container:template.find(".members-container"),endpoints:e.extra.ringGroup,hasRemoveColumn:!0}),i.groupsBindMembers(template,e),n&&n(template,e)})},groupsBindFeatures:function(e,t){var n=this;e.find('.feature[data-feature="call_recording"]').on("click",function(){n.groupsRenderCallRecording(t)}),e.find('.feature[data-feature="ringback"]').on("click",function(){n.groupsRenderRingback(t)}),e.find('.feature[data-feature="next_action"]').on("click",function(){n.groupsRenderNextAction(t)}),e.find('.feature[data-feature="forward"]').on("click",function(){n.groupsRenderForward(t)}),e.find('.feature[data-feature="prepend"]').on("click",function(){n.groupsRenderPrepend(t)})},groupsRenderCallRecording:function(e){var n=this,i=r.util.findCallflowNode(e.callflow,"record_call"),s=t.extend(!0,{group:e.group},e.group.extra.mapFeatures.call_recording.active&&i?{url:i.data.url,format:i.data.format,timeLimit:i.data.time_limit}:{}),o=t(r.template(n,"groups-feature-call_recording",s)),u=o.find(".switch-state"),a=o.find("#call_recording_form"),f;r.ui.validate(a,{rules:{time_limit:{digits:!0}}}),o.find(".cancel-link").on("click",function(){f.dialog("close").remove()}),u.on("change",function(){t(this).prop("checked")?o.find(".content").slideDown():o.find(".content").slideUp()}),o.find(".save").on("click",function(){if(r.ui.valid(a)){var i=r.ui.getFormData("call_recording_form"),s=u.prop("checked");"smartpbx"in e.group||(e.group.smartpbx={}),"call_recording"in e.group.smartpbx||(e.group.smartpbx.call_recording={enabled:!1});if(e.group.smartpbx.call_recording.enabled||s){e.group.smartpbx.call_recording.enabled=s;var o=t.extend(!0,{},e.callflow),l=r.util.findCallflowNode(o,"record_call")||r.util.findCallflowNode(o,"callflow");s?l.module==="record_call"?l.data=t.extend(!0,{action:"start"},i):(l.children={_:t.extend(!0,{},l)},l.module="record_call",l.data=t.extend(!0,{action:"start"},i)):l.module==="record_call"&&(l.module=l.children._.module,l.data=l.children._.data,l.children=l.children._.children),n.groupsUpdateCallflow(o,function(t){n.groupsUpdate(e.group,function(t){f.dialog("close").remove(),n.groupsRender({groupId:e.group.id})})})}else f.dialog("close").remove(),n.groupsRender({groupId:e.group.id})}}),f=r.ui.dialog(o,{title:e.group.extra.mapFeatures.call_recording.title,position:["center",20]})},groupsRenderRingback:function(e){var n=this,i="silence_stream://300000",s=e.baseCallflow.flow,o=undefined;while(s.module!=="ring_group"&&"_"in s.children)s=s.children._;n.groupsListMedias(function(u){var a={group:e.group,silenceMedia:i,mediaList:u,media:s.data.ringback||""},f=t(r.template(n,"groups-feature-ringback",a)),l=f.find(".switch-state"),c,h=function(e){o=undefined,f.find(".upload-div input").val(""),f.find(".upload-div").slideUp(function(){f.find(".upload-toggle").removeClass("active")});if(e){var t=f.find(".media-dropdown");t.append('<option value="'+e.id+'">'+e.name+"</option>"),t.val(e.id)}};f.find(".upload-input").fileUpload({inputOnly:!0,wrapperClass:"file-upload input-append",btnText:n.i18n.active().groups.ringback.audioUploadButton,btnClass:"monster-button",maxSize:5,success:function(e){o=e[0]},error:function(e){e.hasOwnProperty("size")&&e.size.length>0&&r.ui.alert(n.i18n.active().groups.ringback.fileTooBigAlert),f.find(".upload-div input").val(""),o=undefined}}),f.find(".cancel-link").on("click",function(){c.dialog("close").remove()}),l.on("change",function(){t(this).prop("checked")?f.find(".content").slideDown():f.find(".content").slideUp()}),f.find(".upload-toggle").on("click",function(){t(this).hasClass("active")?f.find(".upload-div").stop(!0,!0).slideUp():f.find(".upload-div").stop(!0,!0).slideDown()}),f.find(".upload-cancel").on("click",function(){h()}),f.find(".upload-submit").on("click",function(){o?n.callApi({resource:"media.create",data:{accountId:n.accountId,data:{streamable:!0,name:o.name,media_source:"upload",description:o.name}},success:function(e,t){var r=e.data;n.callApi({resource:"media.upload",data:{accountId:n.accountId,mediaId:r.id,data:o.file},success:function(e,t){h(r)},error:function(e,t){n.callApi({resource:"media.delete",data:{accountId:n.accountId,mediaId:r.id,data:{}},success:function(e,t){}})}})}}):r.ui.alert(n.i18n.active().groups.ringback.emptyUploadAlert)}),f.find(".save").on("click",function(){var t=f.find(".media-dropdown option:selected").val(),r=l.prop("checked");"smartpbx"in e.group||(e.group.smartpbx={});if(r)s.data.ringback=t,"ringback"in e.group.smartpbx?e.group.smartpbx.ringback.enabled=!0:e.group.smartpbx.ringback={enabled:!0},n.groupsUpdateCallflow(e.baseCallflow,function(){n.groupsUpdate(e.group,function(t){c.dialog("close").remove(),n.groupsRender({groupId:e.group.id})})});else if(s.data.ringback||e.group.smartpbx.ringback&&e.group.smartpbx.ringback.enabled)delete s.data.ringback,"ringback"in e.group.smartpbx&&(e.group.smartpbx.ringback.enabled=!1),n.groupsUpdateCallflow(e.baseCallflow,function(){n.groupsUpdate(e.group,function(t){c.dialog("close").remove(),n.groupsRender({groupId:e.group.id})})})}),c=r.ui.dialog(f,{title:e.group.extra.mapFeatures.ringback.title,position:["center",20]})})},groupsRenderNextAction:function(e){var i=this,s=e.callflow.flow,o=null;while(s.module!="callflow")s=s.children._;"_"in s.children&&(o=s.children._.data.id);var u=t.extend(!0,{selectedEntity:o},e),a=t(r.template(i,"groups-feature-next_action",u)),f=a.find(".switch-state"),l;a.find(".cancel-link").on("click",function(){l.dialog("close").remove()}),f.on("change",function(){t(this).prop("checked")?a.find(".content").slideDown():a.find(".content").slideUp()}),a.find(".save").on("click",function(){var s=a.find(".next-action-select option:selected"),o=f.prop("checked");"smartpbx"in e.group||(e.group.smartpbx={}),"next_action"in e.group.smartpbx||(e.group.smartpbx.next_action={enabled:!1});if(e.group.smartpbx.next_action.enabled||o){e.group.smartpbx.next_action.enabled=o;var u=t.extend(!0,{},e.callflow),c=r.util.findCallflowNode(u,"callflow");n.isArray(c)&&(c=c[0]),c.children={},o?c.children._={children:{},module:s.data("module"),data:{id:s.val()}}:c.children._={module:"play",children:{},data:{id:"system_media/vm-not_available_no_voicemail"}},i.groupsUpdateCallflow(u,function(t){i.groupsUpdate(e.group,function(t){l.dialog("close").remove(),i.groupsRender({groupId:e.group.id})})})}else l.dialog("close").remove(),i.groupsRender({groupId:e.group.id})}),l=r.ui.dialog(a,{title:e.group.extra.mapFeatures.next_action.title,position:["center",20]})},groupsRenderForward:function(e){var n=this,i=t(r.template(n,"groups-feature-forward",e)),s=i.find(".switch-state"),o;i.find(".cancel-link").on("click",function(){o.dialog("close").remove()}),i.find(".save").on("click",function(){var t=s.prop("checked"),i=!t;e.group.smartpbx=e.group.smartpbx||{},e.group.smartpbx.forward=e.group.smartpbx.forward||{},e.group.smartpbx.forward.enabled=t,e.group.ignore_forward=i,e.baseCallflow.flow.data.ignore_forward=i,r.parallel({groups:function(t){n.groupsUpdate(e.group,function(e){t(null,e)})},ringGroup:function(t){n.groupsUpdateCallflow(e.baseCallflow,function(e){t(null,e)})}},function(e,t){o.dialog("close").remove(),n.groupsRender({groupId:t.groups.id})})}),o=r.ui.dialog(i,{title:e.group.extra.mapFeatures.forward.title,position:["center",20]})},groupsRenderPrepend:function(e){var n=this,i=r.util.findCallflowNode(e.callflow,"prepend_cid"),s=t.extend(!0,{group:e.group},e.group.extra.mapFeatures.prepend.active&&i?{caller_id_name_prefix:i.data.caller_id_name_prefix,caller_id_number_prefix:i.data.caller_id_number_prefix}:{}),o=t(r.template(n,"groups-feature-prepend",s)),u=o.find(".switch-state"),a;o.find(".cancel-link").on("click",function(){a.dialog("close").remove()}),u.on("change",function(){t(this).prop("checked")?o.find(".content").slideDown():o.find(".content").slideUp()}),o.find(".save").on("click",function(){var s=u.prop("checked"),o=t.extend(!0,{action:"prepend"},r.ui.getFormData("prepend_form"));"smartpbx"in e.group||(e.group.smartpbx={}),"prepend"in e.group.smartpbx||(e.group.smartpbx.prepend={enabled:!1});if(e.group.smartpbx.prepend.enabled||s){e.group.smartpbx.prepend.enabled=s;var f=t.extend(!0,{},e.callflow);s?f.flow.module!=="prepend_cid"?f.flow={children:{_:t.extend(!0,{},e.callflow.flow)},module:"prepend_cid",data:o}:f.flow.data=o:i&&(f.flow=t.extend(!0,{},i.children._)),n.groupsUpdateCallflow(f,function(t){n.groupsUpdate(e.group,function(t){a.dialog("close").remove(),n.groupsRender({groupId:e.group.id})})})}else a.dialog("close").remove(),n.groupsRender({groupId:e.group.id})}),a=r.ui.dialog(o,{title:e.group.extra.mapFeatures.prepend.title,position:["center",20]})},groupsBindName:function(e,n){var i=this,o=e.find("#form-name");r.ui.validate(o),e.find(".save-group").on("click",function(){if(r.ui.valid(o)){var e=r.ui.getFormData("form-name");n=t.extend(!0,{},n,e),i.groupsUpdate(n,function(e){i.groupsRender({groupId:e.id})})}}),e.find(".delete-group").on("click",function(){r.ui.confirm(i.i18n.active().groups.confirmDeleteGroup,function(){i.groupsDelete(n.id,function(e){s.success(r.template(i,"!"+i.i18n.active().groups.groupDeleted,{name:e.group.name})),i.groupsRender()})})})},groupsBindNumbers:function(e,i){var o=this,u=o.i18n.active().groups.toastrMessages,a="",f=[];e.on("click",".list-assigned-items .remove-number",function(){var n=t(this),r=n.parents(".item-row");f.push(r.data("id")),r.slideUp(function(){r.remove(),e.find(".list-assigned-items .item-row").is(":visible")||e.find(".list-assigned-items .empty-row").slideDown(),e.find(".spare-link").removeClass("disabled")})}),e.on("keyup",".list-wrapper .unassigned-list-header .search-query",function(){var r=e.find(".list-unassigned-items .item-row"),i=e.find(".list-unassigned-items .empty-search-row"),s;a=t(this).val().toLowerCase(),n.each(r,function(e){s=t(e),s.data("search").toLowerCase().indexOf(a)<0?s.hide():s.show()}),r.size()>0&&(r.is(":visible")?i.hide():i.show())}),r.util.isNumberFeatureEnabled("e911")&&e.on("click",".e911-number",function(){var e=t(this).parents(".item-row").first(),n=e.data("id");if(n){var i={phoneNumber:n,callbacks:{success:function(n){t.isEmptyObject(n.data.dash_e911)?e.find(".features i.feature-dash_e911").removeClass("active"):e.find(".features i.feature-dash_e911").addClass("active")}}};r.pub("common.e911.renderPopup",i)}}),r.util.isNumberFeatureEnabled("cnam")&&e.on("click",".callerId-number",function(){var e=t(this).parents(".item-row").first(),n=e.data("id");if(n){var i={phoneNumber:n,callbacks:{success:function(t){"cnam"in t.data&&t.data.cnam.display_name?e.find(".features i.feature-outbound_cnam").addClass("active"):e.find(".features i.feature-outbound_cnam").removeClass("active"),"cnam"in t.data&&t.data.cnam.inbound_lookup?e.find(".features i.feature-inbound_cnam").addClass("active"):e.find(".features i.feature-inbound_cnam").removeClass("active")}}};r.pub("common.callerId.renderPopup",i)}}),e.on("click",".prepend-number",function(){var e=t(this).parents(".item-row").first(),n=e.data("id");if(n){var i={phoneNumber:n,callbacks:{success:function(t){"prepend"in t.data&&t.data.prepend.enabled?e.find(".features i.feature-prepend").addClass("active"):e.find(".features i.feature-prepend").removeClass("active")}}};r.pub("common.numberPrepend.renderPopup",i)}}),e.on("click",".actions .spare-link:not(.disabled)",function(i){i.preventDefault();var s=t(this),u={accountName:r.apps.auth.currentAccount.name,accountId:o.accountId,ignoreNumbers:t.map(e.find(".item-row"),function(e){return t(e).data("id")}),extraNumbers:f,callback:function(i,s){e.find(".empty-row").hide(),n.each(i,function(i,s){i.isLocal=i.features.indexOf("local")>-1,e.find(".list-assigned-items").append(t(r.template(o,"groups-numbersItemRow",{isCnamEnabled:r.util.isNumberFeatureEnabled("cnam"),isE911Enabled:r.util.isNumberFeatureEnabled("e911"),number:i}))),f=n.without(f,i.phoneNumber)}),r.ui.tooltips(e),s===0&&e.find(".spare-link").addClass("disabled")}};r.pub("common.numbers.dialogSpare",u)}),e.on("click",".actions .buy-link",function(i){i.preventDefault(),r.pub("common.buyNumbers",{searchType:t(this).data("type"),callbacks:{success:function(i){r.pub("common.numbers.getListFeatures",function(s){n.each(i,function(n,i){n.viewFeatures=t.extend(!0,{},s),n.phoneNumber=n.id;var u=t(r.template(o,"groups-numbersItemRow",{isCnamEnabled:r.util.isNumberFeatureEnabled("cnam"),isE911Enabled:r.util.isNumberFeatureEnabled("e911"),number:n}));r.ui.tooltips(u),e.find(".list-unassigned-items .empty-row").hide(),e.find(".list-unassigned-items").append(u)})})}}})}),e.on("click",".save-numbers",function(){var n=t(this),i=n.parents(".grid-row"),a=i.data("callflow_id"),f=i.data("name");dataNumbers=[],e.find(".item-row").each(function(e,n){dataNumbers.push(t(n).data("id"))}),o.groupsUpdateNumbers(a,dataNumbers,function(e){s.success(r.template(o,"!"+u.numbersUpdated,{name:f})),o.groupsRender({groupId:e.group_id})})})},groupsBindExtensions:function(e,i){var o=this,u=o.i18n.active().groups.toastrMessages,a=[];e.on("click",".save-extensions",function(){var n=[],i=t(this).parents(".grid-row"),a=i.data("callflow_id"),f=i.data("name");e.find(".list-assigned-items .item-row").each(function(e,r){var r=t(r),i;i=(r.data("id")?r.data("id"):r.find(".input-extension").val())+"",n.push(i)}),o.groupsUpdateExtensions(a,n,function(e){s.success(r.template(o,"!"+u.numbersUpdated,{name:f})),o.groupsRender({groupId:e.group_id})})}),e.on("click","#add_extensions",function(){var i=function(n){var n=a[a.length-1]+1,i={recommendedExtension:n},s=t(r.template(o,"groups-newExtension",i)),u=e.find(".list-assigned-items");a.push(n),u.find(".empty-row").hide(),u.append(s)};n.isEmpty(a)?o.groupsListExtensions(function(e){a=e,i()}):i()}),e.on("click",".remove-extension",function(){var e=t(this).parents(".item-row"),n=e.siblings(".empty-row");e.siblings(".item-row").size()===0&&n.show(),e.remove()}),e.on("click",".cancel-extension-link",function(){var e=parseInt(t(this).siblings("input").val()),n=a.indexOf(e);n>-1&&a.splice(n,1),t(this).parents(".item-row").remove()})},groupsBindMembers:function(e,i){var s=this;e.find(".save-groups").on("click",function(){var t=i.id;r.pub("common.ringingDurationControl.getEndpoints",{container:e,callback:function(e){n.each(e,function(e){delete e.name,e.endpoint_type="user"}),s.groupsUpdateBaseRingGroup(t,e,function(e){s.groupsRender({groupId:t})})}})}),e.on("click",".add-user-link",function(){var s=t.map(e.find(".grid-time-row[data-id]"),function(e){return t(e).data("id")}),o=n.filter(i.extra.remainingUsers,function(e){return s.indexOf(e.id)===-1});r.pub("common.monsterListing.render",{dataList:o,dataType:"users",okCallback:function(t){n.each(t,function(t){var n={id:t.id,timeout:20,delay:0,endpoint_type:"user",name:t.name};r.pub("common.ringingDurationControl.addEndpoint",{container:e.find(".members-container"),endpoint:n,hasRemoveColumn:!0})})}})})},groupsGetCreationData:function(e){var t=this;t.groupsListUsers(function(t){t.sort(function(e,t){return e.last_name>t.last_name});var n={extra:{listUsers:t}};e&&e(n)})},groupsListUsers:function(e){var t=this;t.callApi({resource:"user.list",data:{accountId:t.accountId,filters:{paginate:"false"}},success:function(t){e&&e(t.data)}})},groupsGetFeaturesData:function(e,t){var i=this;r.parallel({group:function(t){i.groupsGetGroup(e,function(e){t(null,e)})},users:function(e){i.groupsListUsers(function(t){e(null,t)})},callflow:function(t){i.groupsGetRingGroup(e,function(e){t(null,e)})},baseCallflow:function(t){i.groupsGetBaseRingGroup(e,function(e){t(null,e)})},voicemails:function(e){i.groupsListVMBoxes(function(t){e(null,t)})},mainMenu:function(e){i.callApi({resource:"callflow.list",data:{accountId:i.accountId,filters:{filter_type:"main"}},success:function(t){e(null,t.data&&t.data.length>0?n.find(t.data,function(e){return e.numbers[0]==="MainOpenHoursMenu"}):null)}})},userCallflows:function(e){i.callApi({resource:"callflow.list",data:{accountId:i.accountId,filters:{has_key:"owner_id",filter_type:"mainUserCallflow"}},success:function(t){e(null,t.data)}})}},function(e,r){r.group.extra=i.groupsGetGroupFeatures(r.group),r.userCallflows=n.filter(r.userCallflows,function(e){var t=n.find(r.users,function(t){return e.owner_id===t.id});return t?(e.userName=t.first_name+" "+t.last_name,!0):!1}),t&&t(r)})},groupsGetNameData:function(e,t){var n=this;n.groupsGetGroup(e,function(e){t&&t(e)})},groupsFormatNumbersData:function(e,i){var s=this,o={emptyExtensions:!0,extensions:[],emptyAssigned:!0,assignedNumbers:{},countSpare:0,unassignedNumbers:{}};r.pub("common.numbers.getListFeatures",function(r){n.each(e.numbers.numbers,function(e,i){e.viewFeatures=t.extend(!0,{},r),e.localityEnabled="locality"in e?!0:!1,n.each(e.features,function(t){t in e.viewFeatures&&(e.viewFeatures[t].active="active")}),e.used_by===""&&(o.unassignedNumbers[i]=e,o.countSpare++)}),"groupCallflow"in e.callflow&&"numbers"in e.callflow.groupCallflow&&n.each(e.callflow.groupCallflow.numbers,function(t){t in e.numbers.numbers?(e.numbers.numbers[t].isLocal=e.numbers.numbers[t].features.indexOf("local")>-1,o.assignedNumbers[t]=e.numbers.numbers[t]):o.extensions.push(t)}),o.emptyExtensions=n.isEmpty(o.extensions),o.emptyAssigned=n.isEmpty(o.assignedNumbers),o.emptySpare=n.isEmpty(o.unassignedNumbers),i&&i(o)})},groupsGetNumbersData:function(e,t){var n=this;r.parallel({callflow:function(t){var r={};n.callApi({resource:"callflow.list",data:{accountId:n.accountId,filters:{filter_group_id:e,filter_type:"userGroup"}},success:function(e){e.data.length>0?n.groupsGetCallflow(e.data[0].id,function(e){r.groupCallflow=e,t&&t(null,r)}):t&&t(null,null)}})},numbers:function(e){n.callApi({resource:"numbers.list",data:{accountId:n.accountId,filters:{paginate:"false"}},success:function(t){e&&e(null,t.data)}})}},function(e,n){t&&t(n)})},groupsGetMembersData:function(e,t){var n=this;r.parallel({users:function(e){n.groupsListUsers(function(t){e(null,t)})},group:function(t){n.groupsGetGroup(e,function(e){t(null,e)})},baseCallflow:function(t){n.groupsGetBaseRingGroup(e,function(e){t(null,e)})}},function(e,n){t&&t(n)})},groupsFormatMembersData:function(e){var t=this,r={},i=e.baseCallflow.flow;n.each(e.users,function(e){r[e.id]=e});var s=i.data.endpoints;return n.each(s,function(e){e.delay=parseInt(e.delay),e.timeout=parseInt(e.timeout),e.id in r?e.name=r[e.id].first_name+" "+r[e.id].last_name:(e.name=t.i18n.active().groups.userDeleted,e.deleted=!0)}),e.group.extra={ringGroup:s,remainingUsers:r},e.group},groupsUpdateNumbers:function(e,t,r){var i=this;i.groupsGetCallflow(e,function(e){n.each(e.numbers,function(e){e.length<7&&t.push(e)}),e.numbers=t,i.groupsUpdateCallflow(e,function(e){r&&r(e)})})},groupsUpdateExtensions:function(e,t,r){var i=this;i.groupsGetCallflow(e,function(e){n.each(e.numbers,function(e){e.length>6&&t.push(e)}),e.numbers=t,i.groupsUpdateCallflow(e,function(e){r&&r(e)})})},groupsListExtensions:function(e){var t=this,r=[];t.groupsListCallflows(function(t){n.each(t,function(e){n.each(e.numbers,function(e){if(e.length<7){var t=parseInt(e);t>1&&r.push(t)}})}),r.sort(function(e,t){var n=parseInt(e),r=parseInt(t),i=-1;return n>0&&r>0&&(i=n>r),i}),e&&e(r)})},groupsCheckWalkthrough:function(){var e=this;e.groupsHasWalkthrough(function(){e.groupsShowWalkthrough(function(){e.groupsUpdateWalkthroughFlagUser()})})},groupsHasWalkthrough:function(e){var t=this,n=t.uiFlags.user.get("showGroupsWalkthrough");n!==!1&&e&&e()},groupsUpdateWalkthroughFlagUser:function(e){var t=this,n=t.uiFlags.user.set("showGroupsWalkthrough",!1);t.groupsUpdateOriginalUser(n,function(t){e&&e(t)})},groupsShowWalkthrough:function(e){var n=this,i=t("#voip_container"),s=i.find(".grid-row:not(.title):first"),o=[{element:i.find(".add-group")[0],intro:n.i18n.active().groups.walkthrough.steps[1],position:"right"},{element:s.find(".walkthrough-group")[0],intro:n.i18n.active().groups.walkthrough.steps[2],position:"right"},{element:s.find(".phone-number")[0],intro:n.i18n.active().groups.walkthrough.steps[3],position:"bottom"},{element:s.find(".features")[0],intro:n.i18n.active().groups.walkthrough.steps[4],position:"left"}];r.ui.stepByStep(o,function(){e&&e()})},groupsListCallflows:function(e){var t=this;t.callApi({resource:"callflow.list",data:{accountId:t.accountId,filters:{paginate:"false"}},success:function(t){e&&e(t.data)}})},groupsListMedias:function(e){var t=this;t.callApi({resource:"media.list",data:{accountId:t.accountId,filters:{paginate:"false",key_missing:"type"}},success:function(t){e&&e(t.data)}})},groupsListVMBoxes:function(e){var t=this;t.callApi({resource:"voicemail.list",data:{accountId:t.accountId,filters:{paginate:"false"}},success:function(t){e&&e(t.data)}})},groupsCreate:function(e,t){var n=this;n.callApi({resource:"group.create",data:{accountId:n.accountId,data:e.group},success:function(r){e.callflow.group_id=r.data.id,e.baseCallflow.group_id=r.data.id,n.callApi({resource:"callflow.create",data:{accountId:n.accountId,data:e.baseCallflow},success:function(i){e.callflow.flow.data.id=i.data.id,n.callApi({resource:"callflow.create",data:{accountId:n.accountId,data:e.callflow},success:function(e){t&&t(r.data)},error:function(){n.callApi({resource:"group.delete",data:{accountId:n.accountId,groupId:r.data.id}}),n.callApi({resource:"callflow.delete",data:{accountId:n.accountId,callflowId:i.data.id}})}})},error:function(){n.callApi({resource:"group.delete",data:{accountId:n.accountId,groupId:r.data.id}})}})}})},groupsGetRingGroup:function(e,t,n){var r=this;r.callApi({resource:"callflow.list",data:{accountId:r.accountId,filters:{filter_group_id:e,filter_type:"userGroup"}},success:function(e){e.data.length>0?r.groupsGetCallflow(e.data[0].id,function(e){t&&t(e)}):(n&&n(e),s.error(r.i18n.active().groups.ringGroupMissing))},error:function(e){n&&n(e)}})},groupsGetBaseRingGroup:function(e,t,n){var r=this;r.callApi({resource:"callflow.list",data:{accountId:r.accountId,filters:{filter_group_id:e,filter_type:"baseGroup"}},success:function(e){e.data.length>0?r.groupsGetCallflow(e.data[0].id,function(e){t&&t(e)}):(n&&n(e),s.error(r.i18n.active().groups.ringGroupMissing))},error:function(e){n&&n(e)}})},groupsComputeTimeout:function(e){var t=0;return n.each(e,function(e){var n=parseInt(e.delay),r=parseInt(e.timeout),i=n+r;i>t&&(t=i)}),t},groupsUpdateBaseRingGroup:function(e,t,i){var s=this;r.parallel({group:function(r){s.groupsGetGroup(e,function(e){var i=!1;n.each(t,function(t){if(!(t.id in e.endpoints))return i=!0,!1;delete e.endpoints[t.id]}),n.isEmpty(e.endpoints)||(i=!0),i?(e.endpoints={},n.each(t,function(t){e.endpoints[t.id]={type:"user"}}),s.groupsUpdate(e,function(e){r&&r(null,e)})):r&&r(null,e)})},callflow:function(n){s.groupsGetBaseRingGroup(e,function(e){e.flow.data.endpoints=t,e.flow.data.timeout=s.groupsComputeTimeout(t),s.groupsUpdateCallflow(e,function(e){n&&n(null,e)})})}},function(e,t){i&&i(t)})},groupsUpdate:function(e,t){var n=this;delete e.extra,n.callApi({resource:"group.update",data:{accountId:n.accountId,groupId:e.id,data:e},success:function(e){t&&t(e.data)}})},groupsUpdateCallflow:function(e,t){var n=this;delete e.metadata,n.callApi({resource:"callflow.update",data:{accountId:n.accountId,callflowId:e.id,data:e},success:function(e){t&&t(e.data)}})},groupsGetGroup:function(e,t){var n=this;n.callApi({resource:"group.get",data:{groupId:e,accountId:n.accountId},success:function(e){t&&t(e.data)}})},groupsDelete:function(e,t){var n=this;r.parallel({group:function(t){n.callApi({resource:"group.delete",data:{accountId:n.accountId,groupId:e},success:function(e){t&&t(null,e.data)}})},callflow:function(t){n.groupsGetRingGroup(e,function(e){n.callApi({resource:"callflow.delete",data:{accountId:n.accountId,callflowId:e.id},success:function(e){t&&t(null,e)}})},function(e){t&&t(null,e)})},baseCallflow:function(t){n.groupsGetBaseRingGroup(e,function(e){n.callApi({resource:"callflow.delete",data:{accountId:n.accountId,callflowId:e.id},success:function(e){t&&t(null,e)}})},function(e){t&&t(null,e)})}},function(e,n){t&&t(n)})},groupsGetCallflow:function(e,t){var n=this;n.callApi({resource:"callflow.get",data:{accountId:n.accountId,callflowId:e},success:function(e){t&&t(e.data)}})},groupsGetData:function(e){var t=this;r.parallel({groups:function(e){t.callApi({resource:"group.list",data:{accountId:t.accountId,filters:{paginate:"false"}},success:function(t){e(null,t.data)}})},callflows:function(e){t.callApi({resource:"callflow.list",data:{accountId:t.accountId,filters:{has_key:"group_id"}},success:function(t){e(null,t.data)}})}},function(t,n){e&&e(n)})},groupsRemoveOverlay:function(){t("body").find("#groups_container_overlay").remove()},groupsUpdateOriginalUser:function(e,t){var n=this;n.callApi({resource:"user.update",data:{userId:e.id,accountId:r.apps.auth.originalAccount.id,data:e},success:function(e){t&&t(e.data)}})}};return o});