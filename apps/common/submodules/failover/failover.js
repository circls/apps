define(["require","jquery","underscore","monster","toastr"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("toastr"),s={requests:{},subscribe:{"common.failover.renderPopup":"failoverEdit"},failoverRender:function(e,s){var o=this,u="";"failover"in e&&(u="e164"in e.failover?"number":"sip");var a={radio:u,failover:e.failover,phoneNumber:e.id},f=t(r.template(o,"failover-dialog",a)),l;f.find('.failover-block[data-type="'+u+'"]').addClass("selected"),f.find('.failover-block:not([data-type="'+u+'"]) input').val(""),f.find(".failover-block input").on("keyup",function(){f.find(".failover-block").removeClass("selected"),f.find('.failover-block:not([data-type="'+t(this).parents(".failover-block").first().data("type")+'"]) input[type="text"]').val(""),t(this).parents(".failover-block").addClass("selected")}),f.find(".submit_btn").on("click",function(t){t.preventDefault();var u={failover:{}},a=f.find(".failover-block.selected").data("type"),c;a==="number"||a==="sip"?(u.rawInput=f.find('.failover-block[data-type="'+a+'"] input').val(),u.rawInput.match(/^sip:/)?u.failover.sip=u.rawInput:u.failover.e164=u.rawInput,delete u.rawInput,n.extend(e,u),e.failover.e164||e.failover.sip?o.failoverUpdateNumber(e.id,e,function(e){var t=r.util.formatPhoneNumber(e.data.id),n=r.template(o,"!"+o.i18n.active().failover.successFailover,{phoneNumber:t});i.success(n),l.dialog("destroy").remove(),s.success&&s.success(e)},function(e){r.ui.alert(o.i18n.active().failover.errorUpdate+""+e.data.message),s.error&&s.error(e)}):r.ui.alert(o.i18n.active().failover.invalidFailoverNumber)):r.ui.alert(o.i18n.active().failover.noDataFailover)}),f.find(".remove_failover").on("click",function(t){t.preventDefault(),delete e.failover,o.failoverUpdateNumber(e.id,e,function(e){var t=r.util.formatPhoneNumber(e.data.id),n=r.template(o,"!"+o.i18n.active().failover.successRemove,{phoneNumber:t});i.success(n),l.dialog("destroy").remove(),s.success&&s.success(e)},function(e){r.ui.alert(o.i18n.active().failover.errorUpdate+""+e.data.message),s.error&&s.error(e)})}),l=r.ui.dialog(f,{title:o.i18n.active().failover.failoverTitle,width:"540px"})},failoverEdit:function(e){var t=this;t.failoverGetNumber(e.phoneNumber,function(n){t.failoverRender(n.data,e.callbacks)})},failoverGetNumber:function(e,t,n){var r=this;r.callApi({resource:"numbers.get",data:{accountId:r.accountId,phoneNumber:encodeURIComponent(e)},success:function(e,n){typeof t=="function"&&t(e)},error:function(e,t){typeof n=="function"&&n(e)}})},failoverUpdateNumber:function(e,t,n,r){var i=this;i.callApi({resource:"numbers.update",data:{accountId:i.accountId,phoneNumber:encodeURIComponent(e),data:t},success:function(e,t){typeof n=="function"&&n(e)},error:function(e,t){typeof r=="function"&&r(e)}})}};return s});