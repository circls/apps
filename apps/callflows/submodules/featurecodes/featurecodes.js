define(["require","jquery","underscore","monster","toastr"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("toastr"),s={requests:{},subscribe:{"callflows.featurecode.render":"featureCodeRender"},featureCodeRender:function(e){var n=this,i={},s={},o=e||t(".callflow-edition");n.featureCodesDefine(i),t.each(i,function(e,t){this.tag=e,this.number=typeof t.number=="undefined"?t.default_number:t.number,t.hasOwnProperty("category")&&(s[t.category]=s[t.category]||[],s[t.category].push(t))}),n.featureCodeGetData(function(e){var u=n.featureCodeFormatData(e,i),a=t(r.template(n,"featurecodes-view",{categories:s}));n.featureCodeBindEvents(a,i),o.empty().append(a)})},featureCodeGetData:function(e){var t=this;t.featureCodeList(function(t){e&&e(t)})},featureCodeFormatData:function(e,t){var r=this;return n.each(e,function(e){e.hasOwnProperty("featurecode")&&e.featurecode!==!1&&t.hasOwnProperty(e.featurecode.name)&&(t[e.featurecode.name].id=e.id,t[e.featurecode.name].enabled=!0,t[e.featurecode.name].number=e.featurecode.number.replace("\\",""))}),t},featureCodeBindEvents:function(e,n){var i=this;r.ui.tooltips(e),e.find(".featurecode_enabled").each(function(){var e=t(this).parents(".action_wrapper"),n=e.find(".featurecode-number");t(this).is(":checked")?t(n).removeAttr("disabled"):t(n).attr("disabled","")}),e.find(".featurecode-number").on("blur keyup focus",function(){var e=t(this).parents(".action_wrapper");e.data("number",t(this).val()),t(this).val()!==n[e.data("action")].number?e.addClass("changed"):e.removeClass("changed")}),e.find(".featurecode_enabled").on("change",function(){var e=t(this),n=e.parents(".action_wrapper"),r=n.find(".featurecode-number");!e.is(":checked")&&n.data("enabled")===!0?n.addClass("disabled"):e.is(":checked")&&n.data("enabled")===""?n.addClass("enabled"):(n.removeClass("enabled"),n.removeClass("disabled")),e.is(":checked")?r.removeAttr("disabled"):r.attr("disabled","")}),e.find(".featurecode-save").on("click",function(t){t.preventDefault();var r=i.featureCodeCleanFormData(e,n);i.featureCodeMassUpdate(r)})},featureCodeList:function(e){var t=this;t.callApi({resource:"callflow.list",data:{accountId:t.accountId,filters:{paginate:!1}},success:function(t){e&&e(t.data)}})},featureCodeCleanFormData:function(e,n){var r=this,i={created_callflows:[],deleted_callflows:[],updated_callflows:[]};return e.find(".enabled").each(function(){var e=t(this).data();e.number+="",e.flow={data:n[e.action].data,module:n[e.action].module,children:{}},e.type==="patterns"&&typeof e.number=="string"&&(e.number=e.number.replace(/([*])/g,"\\$1")),e[e.type]=[n[e.action].build_regex(e.number)],i.created_callflows.push(e)}),e.find(".disabled").each(function(){var e=t(this).data();e.number+="",i.deleted_callflows.push(e)}),e.find(".changed:not(.enabled, .disabled)").each(function(){if(t(this).data("enabled")){var e=t(this).data();e.number+="",e.flow={data:n[e.action].data,module:n[e.action].module,children:{}},e.type==="patterns"&&(e.number=e.number.replace(/([*])/g,"\\$1")),e[e.type]=[n[e.action].build_regex(e.number)],i.updated_callflows.push(e)}}),i},featureCodeCreate:function(e,t){var n=this;n.callApi({resource:"callflow.create",data:{accountId:n.accountId,data:e},success:function(e){t&&t(e.data)}})},featureCodeDelete:function(e,t){var n=this;n.callApi({resource:"callflow.delete",data:{accountId:n.accountId,callflowId:e},success:function(e){t&&t(e.data)}})},featureCodeUpdate:function(e,t,n){var r=this;r.callApi({resource:"callflow.update",data:{accountId:r.accountId,callflowId:e,data:t},success:function(e){n&&n(e.data)}})},featureCodeMassUpdate:function(e){var t=this,s=e.created_callflows.length+e.deleted_callflows.length+e.updated_callflows.length;if(s){var o={};n.each(e.created_callflows,function(e){o["create_"+e.action]=function(n){var r={flow:e.flow,patterns:e.patterns,numbers:e.numbers,featurecode:{name:e.action,number:e.number}};t.featureCodeCreate(r,function(e){n&&n(null,e)})}}),n.each(e.updated_callflows,function(e){o["update_"+e.action]=function(n){var r={flow:e.flow,patterns:e.patterns,numbers:e.numbers,featurecode:{name:e.action,number:e.number}};t.featureCodeUpdate(e.id,r,function(e){n&&n(null,e)})}}),n.each(e.deleted_callflows,function(e){o["delete_"+e.action]=function(n){t.featureCodeDelete(e.id,function(e){n&&n(null,e)})}}),r.parallel(o,function(e,n){i.success(t.i18n.active().callflows.featureCodes.successUpdate),t.featureCodeRender()})}else i.error(t.i18n.active().callflows.featureCodes.nothing_to_save)},featureCodesDefine:function(e){var n=this;t.extend(e,{"call_forward[action=activate]":{name:n.i18n.active().callflows.featureCodes.enable_call_forward,icon:"phone",category:n.i18n.active().callflows.featureCodes.call_forward_cat,module:"call_forward",number_type:"numbers",data:{action:"activate"},enabled:!1,default_number:"72",number:this.default_number,build_regex:function(e){return"*"+e}},"call_forward[action=deactivate]":{name:n.i18n.active().callflows.featureCodes.disable_call_forward,icon:"phone",category:n.i18n.active().callflows.featureCodes.call_forward_cat,module:"call_forward",number_type:"numbers",data:{action:"deactivate"},enabled:!1,default_number:"73",number:this.default_number,build_regex:function(e){return"*"+e}},"call_forward[action=toggle]":{name:n.i18n.active().callflows.featureCodes.toggle_call_forward,icon:"phone",category:n.i18n.active().callflows.featureCodes.call_forward_cat,module:"call_forward",number_type:"patterns",data:{action:"toggle"},enabled:!1,default_number:"74",number:this.default_number,build_regex:function(e){return"^\\*"+e+"([0-9]*)$"}},"call_forward[action=update]":{name:n.i18n.active().callflows.featureCodes.update_call_forward,icon:"phone",category:n.i18n.active().callflows.featureCodes.call_forward_cat,module:"call_forward",number_type:"numbers",data:{action:"update"},enabled:!1,default_number:"56",number:this.default_number,build_regex:function(e){return"*"+e}},"hotdesk[action=login]":{name:n.i18n.active().callflows.featureCodes.enable_hot_desking,icon:"phone",category:n.i18n.active().callflows.featureCodes.hot_desking_cat,module:"hotdesk",number_type:"numbers",data:{action:"login"},enabled:!1,default_number:"11",number:this.default_number,build_regex:function(e){return"*"+e}},"hotdesk[action=logout]":{name:n.i18n.active().callflows.featureCodes.disable_hot_desking,icon:"phone",category:n.i18n.active().callflows.featureCodes.hot_desking_cat,module:"hotdesk",number_type:"numbers",data:{action:"logout"},enabled:!1,default_number:"12",number:this.default_number,build_regex:function(e){return"*"+e}},"hotdesk[action=toggle]":{name:n.i18n.active().callflows.featureCodes.toggle_hot_desking,icon:"phone",category:n.i18n.active().callflows.featureCodes.hot_desking_cat,module:"hotdesk",number_type:"numbers",data:{action:"toggle"},enabled:!1,default_number:"13",number:this.default_number,build_regex:function(e){return"*"+e}},"voicemail[action=check]":{name:n.i18n.active().callflows.featureCodes.check_voicemail,icon:"phone",category:n.i18n.active().callflows.featureCodes.miscellaneous_cat,module:"voicemail",number_type:"numbers",data:{action:"check"},enabled:!1,default_number:"97",number:this.default_number,build_regex:function(e){return"*"+e}},'voicemail[action="direct"]':{name:n.i18n.active().callflows.featureCodes.direct_to_voicemail,category:n.i18n.active().callflows.featureCodes.miscellaneous_cat,module:"voicemail",number_type:"patterns",data:{action:"compose"},enabled:!1,default_number:"*",number:this.default_number,build_regex:function(e){return"^\\*"+e+"([0-9]*)$"}},intercom:{name:n.i18n.active().callflows.featureCodes.intercom,icon:"phone",category:n.i18n.active().callflows.featureCodes.miscellaneous_cat,module:"intercom",number_type:"patterns",data:{},enabled:!1,default_number:"0",number:this.default_number,build_regex:function(e){return"^\\*"+e+"([0-9]*)$"}},"privacy[mode=full]":{name:n.i18n.active().callflows.featureCodes.privacy,icon:"phone",category:n.i18n.active().callflows.featureCodes.miscellaneous_cat,module:"privacy",number_type:"patterns",data:{mode:"full"},enabled:!1,default_number:"67",number:this.default_number,build_regex:function(e){return"^\\*"+e+"([0-9]*)$"}},park_and_retrieve:{name:n.i18n.active().callflows.featureCodes.park_and_retrieve,icon:"phone",category:n.i18n.active().callflows.featureCodes.parking_cat,module:"park",number_type:"patterns",data:{action:"auto"},enabled:!1,default_number:"3",number:this.default_number,build_regex:function(e){return"^\\*"+e+"([0-9]*)$"}},valet:{name:n.i18n.active().callflows.featureCodes.valet,icon:"phone",category:n.i18n.active().callflows.featureCodes.parking_cat,module:"park",number_type:"numbers",data:{action:"park"},enabled:!1,default_number:"4",number:this.default_number,build_regex:function(e){return"*"+e}},retrieve:{name:n.i18n.active().callflows.featureCodes.retrieve,icon:"phone",category:n.i18n.active().callflows.featureCodes.parking_cat,module:"park",number_type:"patterns",data:{action:"retrieve"},enabled:!1,default_number:"5",number:this.default_number,build_regex:function(e){return"^\\*"+e+"([0-9]*)$"}}})}};return s});