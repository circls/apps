define(["require","jquery","underscore","chosen","monster","monster-timezone"],function(e){var t=e("jquery"),n=e("underscore"),r=e("chosen"),i=e("monster"),s=e("monster-timezone"),o={subscribe:{"myaccount.user.renderContent":"_userRenderContent"},_userRenderContent:function(e){var n=this;n.callApi({resource:"user.get",data:{accountId:i.apps.auth.originalAccount.id,userId:n.userId},success:function(r,s){var r={user:r.data},o=t(i.template(n,"user-layout",r));n.userBindingEvents(o,r),i.pub("myaccount.renderSubmodule",o),typeof e.callback=="function"&&e.callback(o)}})},userBindingEvents:function(e,t){var n=this;s.populateDropdown(e.find("#user_timezone"),t.user.timezone||"inherit",{inherit:n.i18n.active().defaultTimezone}),e.find("#user_timezone").chosen({search_contains:!0,width:"220px"}),i.ui.showPasswordStrength(e.find("#password")),i.pub("myaccount.events",{template:e,data:t})}};return o});