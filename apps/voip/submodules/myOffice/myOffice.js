define(["require","jquery","underscore","monster","chart"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("chart"),s={requests:{},subscribe:{"voip.myOffice.render":"myOfficeRender","auth.continueTrial":"myOfficeWalkthroughRender","myaccount.closed":"myOfficeAfterMyaccountClosed"},chartColors:["#B588B9","#698BF7","#009AD6","#6CC5E9","#719B11","#BDE55F","#F1E87C","#EF8F25","#6F7C7D"],myOfficeRender:function(e){var i=this,s=e.parent||t(".right-content"),o=e.callback;i.myOfficeLoadData(function(e){var u={isCnamEnabled:r.util.isNumberFeatureEnabled("cnam"),account:e.account,totalUsers:e.users.length,totalDevices:e.devices.length,unregisteredDevices:e.devices.length-e.devicesStatus.length,totalNumbers:n.size(e.numbers),totalConferences:e.totalConferences,totalChannels:e.totalChannels,mainNumbers:e.mainNumbers||[],confNumbers:e.confNumbers||[],faxingNumbers:e.faxingNumbers||[],faxNumbers:e.faxNumbers||[],topMessage:e.topMessage,devicesList:n.toArray(e.devicesData).sort(function(e,t){return t.count-e.count}),assignedNumbersList:n.toArray(e.assignedNumbersData).sort(function(e,t){return t.count-e.count}),classifiedNumbers:e.classifiedNumbers,directoryUsers:e.directory.users&&e.directory.users.length||0,directoryLink:e.directoryLink},a=t(r.template(i,"myOffice-layout",u)),f={animateScale:!0,segmentShowStroke:!1,animationSteps:50,animationEasing:"easeOutCirc",percentageInnerCutout:60},l=(new Chart(a.find("#dashboard_devices_chart").get(0).getContext("2d"))).Doughnut(e.devicesData.totalCount>0?t.map(e.devicesData,function(e){return typeof e=="object"?{value:e.count,color:e.color}:null}).sort(function(e,t){return t.value-e.value}):[{value:1,color:"#DDD"}],f),c=(new Chart(a.find("#dashboard_assigned_numbers_chart").get(0).getContext("2d"))).Doughnut(e.assignedNumbersData.totalCount>0?t.map(e.assignedNumbersData,function(e){return typeof e=="object"?{value:e.count,color:e.color}:null}).sort(function(e,t){return t.value-e.value}):[{value:1,color:"#DDD"}],f),h=(new Chart(a.find("#dashboard_number_types_chart").get(0).getContext("2d"))).Doughnut(e.classifiedNumbers.length>0?t.map(e.classifiedNumbers,function(e,t){return typeof e=="object"?{value:e.count,color:e.color}:null}):[{value:1,color:"#DDD"}],f);e.classifiedNumbers.length<=3&&a.find(".number-types-legend").addClass("size-"+e.classifiedNumbers.length),i.myOfficeBindEvents({parent:s,template:a,myOfficeData:e}),s.empty().append(a),i.myOfficeCheckWalkthrough(),o&&o()})},myOfficeCheckWalkthrough:function(){var e=this;r.apps.auth.currentAccount.hasOwnProperty("trial_time_left")||r.pub("myaccount.hasToShowWalkthrough",function(t){t===!1&&e.myOfficeWalkthroughRender()})},myOfficeAfterMyaccountClosed:function(){var e=this;r.apps.auth.currentAccount.hasOwnProperty("trial_time_left")||e.myOfficeWalkthroughRender()},myOfficeCreateMainVMBoxIfMissing:function(e){var t=this;t.myOfficeHasMainVMBox(function(t){e(t)},function(){t.myOfficeCreateMainVMBox(function(t){e(t)})})},myOfficeCreateMainVMBox:function(e){var t=this,n={mailbox:"0",type:"mainVMBox",name:t.i18n.active().myOffice.mainVMBoxName,delete_after_notify:!0};t.callApi({resource:"voicemail.create",data:{accountId:t.accountId,data:n},success:function(t){e&&e(t.data)}})},myOfficeHasMainVMBox:function(e,t){var n=this;n.callApi({resource:"voicemail.list",data:{accountId:n.accountId,filters:{filter_type:"mainVMBox"}},success:function(n){n.data.length>0?e&&e(n[0]):t&&t()}})},myOfficeLoadData:function(e){var t=this;r.parallel({account:function(e){t.callApi({resource:"account.get",data:{accountId:t.accountId},success:function(t){e&&e(null,t.data)}})},mainVoicemailBox:function(e){t.myOfficeCreateMainVMBoxIfMissing(function(t){e(null,t)})},users:function(e){t.callApi({resource:"user.list",data:{accountId:t.accountId,filters:{paginate:"false"}},success:function(t){e&&e(null,t.data)}})},devices:function(e){t.callApi({resource:"device.list",data:{accountId:t.accountId,filters:{paginate:"false"}},success:function(t){e&&e(null,t.data)}})},devicesStatus:function(e){t.callApi({resource:"device.getStatus",data:{accountId:t.accountId,filters:{paginate:"false"}},success:function(t){e&&e(null,t.data)}})},numbers:function(e){t.callApi({resource:"numbers.list",data:{accountId:t.accountId,filters:{paginate:"false"}},success:function(t){e&&e(null,t.data.numbers)}})},numberFeatures:function(e){r.pub("common.numbers.getListFeatures",function(t){e(null,t)})},channels:function(e){t.callApi({resource:"channel.list",data:{accountId:t.accountId,filters:{paginate:"false"}},success:function(t){e&&e(null,t.data)}})},callflows:function(e){t.callApi({resource:"callflow.list",data:{filters:{has_type:"type",paginate:"false"},accountId:t.accountId},success:function(t){e&&e(null,t.data)}})},classifiers:function(e){t.callApi({resource:"numbers.listClassifiers",data:{accountId:t.accountId},success:function(t){e&&e(null,t.data)}})},directory:function(e){t.callApi({resource:"directory.list",data:{accountId:t.accountId},success:function(r,i){var s=n.find(r.data,function(e){return e.name==="SmartPBX Directory"});s?t.callApi({resource:"directory.get",data:{accountId:t.accountId,directoryId:s.id},success:function(t,n){e&&e(null,t.data)},error:function(t,n){e&&e(null,{})}}):e&&e(null,{})},error:function(t,n){e&&e(null,{})}})}},function(n,r){e&&e(t.myOfficeFormatData(r))})},myOfficeFormatData:function(e){var i=this,s={sip_device:{label:i.i18n.active().devices.types.sip_device,count:0,color:i.chartColors[5]},cellphone:{label:i.i18n.active().devices.types.cellphone,count:0,color:i.chartColors[3]},smartphone:{label:i.i18n.active().devices.types.smartphone,count:0,color:i.chartColors[2]},mobile:{label:i.i18n.active().devices.types.mobile,count:0,color:i.chartColors[1]},softphone:{label:i.i18n.active().devices.types.softphone,count:0,color:i.chartColors[0]},landline:{label:i.i18n.active().devices.types.landline,count:0,color:i.chartColors[6]},fax:{label:i.i18n.active().devices.types.fax,count:0,color:i.chartColors[7]},ata:{label:i.i18n.active().devices.types.ata,count:0,color:i.chartColors[8]},sip_uri:{label:i.i18n.active().devices.types.sip_uri,count:0,color:i.chartColors[4]},totalCount:0},o={spare:{label:i.i18n.active().myOffice.numberChartLegend.spare,count:0,color:i.chartColors[8]},assigned:{label:i.i18n.active().myOffice.numberChartLegend.assigned,count:0,color:i.chartColors[3]},totalCount:0},u=0,a=[],f={},l={};n.each(e.numbers,function(t,r){n.find(e.classifiers,function(e,t){return t in f||(f[t]=new RegExp(e.regex)),f[t].test(r)?(t in l?l[t]++:l[t]=1,!0):!1})}),e.classifiedNumbers=n.map(l,function(t,n){return{key:n,label:n in e.classifiers?e.classifiers[n].friendly_name:n,count:t}}).sort(function(e,t){return t.count-e.count});var c=i.chartColors.length;if(e.classifiedNumbers.length>c){e.classifiedNumbers[c-1].key="merged_others",e.classifiedNumbers[c-1].label="Others";while(e.classifiedNumbers.length>c)e.classifiedNumbers[c-1].count+=e.classifiedNumbers.pop().count}return n.each(e.classifiedNumbers,function(e,t){e.color=i.chartColors[t]}),n.each(e.devices,function(e){e.device_type in s?(s[e.device_type].count++,s.totalCount++):console.log("Unknown device type: "+e.device_type)}),n.each(e.numbers,function(e){"used_by"in e&&e.used_by.length>0?o.assigned.count++:o.spare.count++,o.totalCount++}),n.each(e.users,function(e){e.features.indexOf("conferencing")>=0&&u++}),n.each(e.callflows,function(r){var i="";r.type==="main"&&r.name==="MainCallflow"?i="mainNumbers":r.type==="conference"&&r.name==="MainConference"?i="confNumbers":r.type==="faxing"&&r.name==="MainFaxing"&&(i="faxingNumbers"),i.length>0&&(i in e||(e[i]=[]),n.each(r.numbers,function(r){if(r!=="0"&&r!=="undefined"&&r!=="undefinedconf"&&r!=="undefinedfaxing"){var s={number:r,features:t.extend(!0,{},e.numberFeatures)};r in e.numbers&&n.each(e.numbers[r].features,function(e){s.features[e].active="active"}),e[i].push(s)}}))}),n.each(e.channels,function(e){a.indexOf(e.bridge_id)<0&&a.push(e.bridge_id)}),e.mainNumbers&&e.mainNumbers.length>0&&(!("caller_id"in e.account)||!("emergency"in e.account.caller_id)||!("number"in e.account.caller_id.emergency)||!(e.account.caller_id.emergency.number in e.numbers)||e.numbers[e.account.caller_id.emergency.number].features.indexOf("dash_e911")<0)&&(r.util.isNumberFeatureEnabled("cnam")&&r.util.isNumberFeatureEnabled("e911")?e.topMessage={"class":"btn-danger",message:i.i18n.active().myOffice.missingCnamE911Message}:r.util.isNumberFeatureEnabled("cnam")?e.topMessage={"class":"btn-danger",message:i.i18n.active().myOffice.missingCnamMessage}:r.util.isNumberFeatureEnabled("e911")&&(e.topMessage={"class":"btn-danger",message:i.i18n.active().myOffice.missingE911Message})),e.totalChannels=a.length,e.devicesData=s,e.assignedNumbersData=o,e.totalConferences=u,e.directory&&e.directory.id&&(e.directoryLink=i.apiUrl+"accounts/"+i.accountId+"/directories/"+e.directory.id+"?accept=pdf&auth_token="+i.authToken),e},myOfficeBindEvents:function(e){var n=this,i=e.parent,s=e.template,o=e.myOfficeData;s.find(".link-box").on("click",function(e){var n=t(this),s=n.data("category"),o=n.data("subcategory");t(".category").removeClass("active");switch(s){case"users":t(".category#users").addClass("active"),r.pub("voip.users.render",{parent:i});break;case"devices":t(".category#devices").addClass("active"),r.pub("voip.devices.render",{parent:i});break;case"numbers":t(".category#numbers").addClass("active"),r.pub("voip.numbers.render",{parent:i});break;case"strategy":t(".category#strategy").addClass("active"),r.pub("voip.strategy.render",{parent:i,openElement:o})}}),s.find(".header-link.music-on-hold").on("click",function(e){e.preventDefault(),n.myOfficeRenderMusicOnHoldPopup({account:o.account})}),r.util.isNumberFeatureEnabled("cnam")&&s.find(".header-link.caller-id:not(.disabled)").on("click",function(e){e.preventDefault(),n.myOfficeRenderCallerIdPopup({parent:i,myOfficeData:o})}),s.find(".header-link.caller-id.disabled").on("click",function(e){r.ui.alert(n.i18n.active().myOffice.missingMainNumberForCallerId)}),r.ui.tooltips(s)},myOfficeRenderMusicOnHoldPopup:function(e){var n=this,i=e.account,s="silence_stream://300000";n.myOfficeListMedias(function(e){var o={silenceMedia:s,mediaList:e,media:"music_on_hold"in i&&"media_id"in i.music_on_hold?i.music_on_hold.media_id:undefined},u=t(r.template(n,"myOffice-musicOnHoldPopup",o)),a=r.ui.dialog(u,{title:n.i18n.active().myOffice.musicOnHold.title,position:["center",20]});n.myOfficeMusicOnHoldPopupBindEvents({popupTemplate:u,popup:a,account:i})})},myOfficeMusicOnHoldPopupBindEvents:function(e){var n=this,i=e.popupTemplate,s=e.popup,o=e.account,u=function(e){mediaToUpload=undefined,i.find(".upload-div input").val(""),i.find(".upload-div").slideUp(function(){i.find(".upload-toggle").removeClass("active")});if(e){var t=i.find(".media-dropdown");t.append('<option value="'+e.id+'">'+e.name+"</option>"),t.val(e.id)}};i.find(".upload-input").fileUpload({inputOnly:!0,wrapperClass:"file-upload input-append",btnText:n.i18n.active().myOffice.musicOnHold.audioUploadButton,btnClass:"monster-button",maxSize:5,success:function(e){mediaToUpload=e[0]},error:function(e){e.hasOwnProperty("size")&&e.size.length>0&&r.ui.alert(n.i18n.active().myOffice.musicOnHold.fileTooBigAlert),i.find(".upload-div input").val(""),mediaToUpload=undefined}}),i.find(".cancel-link").on("click",function(){s.dialog("close").remove()}),i.find(".upload-toggle").on("click",function(){t(this).hasClass("active")?i.find(".upload-div").stop(!0,!0).slideUp():i.find(".upload-div").stop(!0,!0).slideDown()}),i.find(".upload-cancel").on("click",function(){u()}),i.find(".upload-submit").on("click",function(){mediaToUpload?n.callApi({resource:"media.create",data:{accountId:n.accountId,data:{streamable:!0,name:mediaToUpload.name,media_source:"upload",description:mediaToUpload.name}},success:function(e,t){var r=e.data;n.callApi({resource:"media.upload",data:{accountId:n.accountId,mediaId:r.id,data:mediaToUpload.file},success:function(e,t){u(r)},error:function(e,t){n.callApi({resource:"media.delete",data:{accountId:n.accountId,mediaId:r.id,data:{}},success:function(e,t){}})}})}}):r.ui.alert(n.i18n.active().myOffice.musicOnHold.emptyUploadAlert)}),i.find(".save").on("click",function(){var e=i.find(".media-dropdown option:selected").val();"music_on_hold"in o||(o.music_on_hold={}),e&&e.length>0?o.music_on_hold={media_id:e}:o.music_on_hold={},n.myOfficeUpdateAccount(o,function(e){s.dialog("close").remove()})})},myOfficeRenderCallerIdPopup:function(e){var n=this,i=e.parent,s=e.myOfficeData,o={isE911Enabled:r.util.isNumberFeatureEnabled("e911"),mainNumbers:s.mainNumbers,selectedMainNumber:"caller_id"in s.account&&"external"in s.account.caller_id?s.account.caller_id.external.number||"none":"none"},u=t(r.template(n,"myOffice-callerIdPopup",o)),a=r.ui.dialog(u,{title:n.i18n.active().myOffice.callerId.title,position:["center",20]});if(r.util.isNumberFeatureEnabled("e911")){var f=u.find(".emergency-form > form");r.ui.validate(f,{messages:{postal_code:{required:"*"},street_address:{required:"*"},locality:{required:"*"},region:{required:"*"}}}),r.ui.valid(f)}n.myOfficeCallerIdPopupBindEvents({parent:i,popupTemplate:u,popup:a,account:s.account})},myOfficeCallerIdPopupBindEvents:function(e){var n=this,i=e.parent,s=e.popupTemplate,o=e.popup,u=e.account,a=s.find(".caller-id-select"),f=s.find(".caller-id-name"),l=s.find(".caller-id-emergency-zipcode"),c=s.find(".caller-id-emergency-address1"),h=s.find(".caller-id-emergency-address2"),p=s.find(".caller-id-emergency-city"),d=s.find(".caller-id-emergency-state"),v=function(e){e&&n.myOfficeGetNumber(e,function(e){"cnam"in e?f.val(e.cnam.display_name):f.val(""),r.util.isNumberFeatureEnabled("e911")&&("dash_e911"in e?(l.val(e.dash_e911.postal_code),c.val(e.dash_e911.street_address),h.val(e.dash_e911.extended_address),p.val(e.dash_e911.locality),d.val(e.dash_e911.region)):(l.val(""),c.val(""),h.val(""),p.val(""),d.val("")))})};s.find(".cancel-link").on("click",function(){o.dialog("close").remove()}),s.find(".upload-cancel").on("click",function(){closeUploadDiv()}),a.on("change",function(){var e=t(this).val();e?(s.find(".number-feature").slideDown(),v(e)):s.find(".number-feature").slideUp()}),l.on("blur",function(){t.getJSON("http://www.geonames.org/postalCodeLookupJSON?&country=US&callback=?",{postalcode:t(this).val()},function(e){e&&e.postalcodes.length&&e.postalcodes[0].placeName&&(p.val(e.postalcodes[0].placeName),d.val(e.postalcodes[0].adminName1))})}),s.find(".save").on("click",function(){var e=a.val(),l=function(){n.myOfficeUpdateAccount(u,function(e){o.dialog("close").remove(),n.myOfficeRender({parent:i})})},c=function(r){var i=f.val();u.caller_id=t.extend(!0,{},u.caller_id,{external:{number:e},emergency:{number:e}}),n.myOfficeGetNumber(e,function(s){e?t.extend(!0,s,{cnam:{display_name:i}}):delete s.cnam,r&&t.extend(!0,s,{dash_e911:r}),n.myOfficeUpdateNumber(s,function(e){l()})})},h;r.util.isNumberFeatureEnabled("e911")&&(h=s.find(".emergency-form > form"));if(e)if(r.util.isNumberFeatureEnabled("e911"))if(r.ui.valid(h)){var p=r.ui.getFormData(h[0]);c(p)}else r.ui.alert(n.i18n.active().myOffice.callerId.mandatoryE911Alert);else c();else delete u.caller_id.external,delete u.caller_id.emergency,l()}),v(a.val())},myOfficeWalkthroughRender:function(){var e=this;e.isActive()&&e.myOfficeHasWalkthrough(function(){e.myOfficeShowWalkthrough(function(){e.myOfficeUpdateWalkthroughFlagUser()})})},myOfficeHasWalkthrough:function(e){var t=this,n=t.uiFlags.user.get("showDashboardWalkthrough");n!==!1&&e&&e()},myOfficeShowWalkthrough:function(e){var n=this,i=t("#voip_container"),s=[{element:i.find(".category#myOffice")[0],intro:n.i18n.active().myOffice.walkthrough.steps[1],position:"right"},{element:i.find(".category#users")[0],intro:n.i18n.active().myOffice.walkthrough.steps[2],position:"right"},{element:i.find(".category#groups")[0],intro:n.i18n.active().myOffice.walkthrough.steps[3],position:"right"},{element:i.find(".category#strategy")[0],intro:n.i18n.active().myOffice.walkthrough.steps[4],position:"right"}];r.ui.stepByStep(s,function(){e&&e()})},myOfficeUpdateWalkthroughFlagUser:function(e){var t=this,n=t.uiFlags.user.set("showDashboardWalkthrough",!1);t.myOfficeUpdateOriginalUser(n,function(t){e&&e(t)})},myOfficeGetNumber:function(e,t,n){var r=this;r.callApi({resource:"numbers.get",data:{accountId:r.accountId,phoneNumber:encodeURIComponent(e)},success:function(e,n){t&&t(e.data)},error:function(e,t){n&&n(e)}})},myOfficeUpdateNumber:function(e,t,n){var r=this;r.callApi({resource:"numbers.update",data:{accountId:r.accountId,phoneNumber:encodeURIComponent(e.id),data:e},success:function(e,n){t&&t(e.data)},error:function(e,t){n&&n(e)}})},myOfficeListMedias:function(e){var t=this;t.callApi({resource:"media.list",data:{accountId:t.accountId,filters:{key_missing:"type"}},success:function(t){e&&e(t.data)}})},myOfficeUpdateAccount:function(e,t){var n=this;delete e.extra,n.callApi({resource:"account.update",data:{accountId:n.accountId,data:e},success:function(e){t&&t(e.data)}})},myOfficeUpdateOriginalUser:function(e,t){var n=this;n.callApi({resource:"user.update",data:{userId:e.id,accountId:r.apps.auth.originalAccount.id,data:e},success:function(e){t&&t(e.data)}})}};return s});