define(["require","jquery","underscore","monster","toastr"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i=e("toastr"),s={name:"tutorial",externalScripts:["example"],css:["app"],i18n:{"en-US":{customCss:!1},"fr-FR":{customCss:!0}},requests:{"skeleton.listNumbers":{url:"phone_numbers?prefix={pattern}&quantity={size}",verb:"GET"}},subscribe:{"pbxsManager.activate":"_render"},load:function(e){var t=this;t.initApp(function(){e&&e(t)})},initApp:function(e){var t=this;r.pub("auth.initApp",{app:t,callback:e})},render:function(e){var t=this;t._render(e)},_render:function(e){var i=this,s=t(r.template(i,"layout")),o=n.isEmpty(e)?t("#monster-content"):e;i.bindEvents(s),o.empty().append(s)},bindEvents:function(e){var t=this;e.find("#search").on("click",function(n){t.searchNumbers(415,15,function(n){var i=r.template(t,"results",n);e.find(".results").empty().append(i)})})},searchNumbers:function(e,t,n){var i=this;r.request({resource:"skeleton.listNumbers",data:{pattern:e,size:t},success:function(e){n&&n(e.data)}})}};return s});