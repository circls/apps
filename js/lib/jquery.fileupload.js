(function(e){var t=0;defaultOptions={bigBtnText:"Select a file",btnText:"Select a file",inputOnly:!1,multiple:!1,resultType:"[]",dataFormat:"dataURL"},e.fn.fileUpload=function(n){var r=n&&n.hasOwnProperty("success")?n.success:undefined,i=n&&n.hasOwnProperty("error")?n.error:undefined,s=e.extend({},defaultOptions,n),o=e(this).css("display","none").prop("multiple",s.multiple),u=e('<div id="file_upload_wrapper_'+ ++t+'">'),a=e('<input type="text" id="file_upload_input_'+t+'">'),f=e('<button type="button" id="file_upload_button_'+t+'">'+s.btnText+"</button>"),l=e('<button type="button" id="file_upload_bigButton_'+t+'">'+s.bigBtnText+"</button>");s.hasOwnProperty("btnClass")&&f.addClass(s.btnClass),s.hasOwnProperty("inputClass")&&a.addClass(s.inputClass),s.hasOwnProperty("bigBtnClass")&&l.addClass(s.bigBtnClass),s.hasOwnProperty("wrapperClass")&&u.addClass(s.wrapperClass),s.inputOnly||s.hasOwnProperty("filesList")&&s.filesList.length>0?(s.hasOwnProperty("filesList")&&s.filesList.length>0&&a.val(s.filesList.join(", ")),u.insertAfter(o).append(o,a,f)):(u.insertAfter(o).append(o,a,f),l.insertBefore(u),u.hide(),e("body").delegate("#file_upload_bigButton_"+t,"click",function(){o.focus().trigger("click")})),u.delegate("#file_upload_button_"+t,"click",function(){o.focus().trigger("click")}),u.delegate('input[type="file"]',"change",function(e){var t=Array.prototype.slice.call(e.target.files),n=[],o=[],c=!1,h={mimeTypes:[],size:[]},p,d;s.resultType==="[]"?p=[]:s.resultType==="{}"&&(p={}),t.forEach(function(e){var t=!0;s.hasOwnProperty("mimeTypes")&&s.mimeTypes.indexOf(e.type)===-1&&(h.mimeTypes.push(e.name),c=!0,t=!1),s.hasOwnProperty("maxSize")&&e.size>s.maxSize*1e6&&(h.size.push(e.name),c=!0,t=!1),t&&(o.push(e),n.push(e.name))});if(o.length>0){var v=o.length;o.forEach(function(e){var t=new FileReader;t["readAs".concat(s.dataFormat.charAt(0).toUpperCase(),s.dataFormat.slice(1))](e),t.onloadend=function(){s.resultType==="[]"?p.push({name:e.name,file:t.result}):s.resultType==="{}"&&(p[e.name]=t.result),--v===0&&(r&&r(p),f.trigger("blur"))}}),!s.inputOnly&&l.is(":visible")&&l.fadeOut(function(){u.fadeIn()}),d=n.join(", ");if(d!=="")if(a.val()!==""){var m=a.css("color"),g=a.css("backgroundColor");a.animate({color:g},300,function(){a.val(d),a.animate({color:m},300)})}else a.val(d)}c&&(i&&i(h),l.is(":visible")?l.trigger("blur"):f.trigger("blur"))}),u.delegate("#file_upload_input_".concat(t),"blur",function(){o.trigger("blur")}),u.delegate("#file_upload_input_".concat(t),"keydown",function(e){switch(e.which){case 8:case 46:o.replaceWith(o=o.clone(!0)),o.trigger("change"),a.val("");break;case 9:return;case 13:o.trigger("click");break;default:return!1}})}})(jQuery);