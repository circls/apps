define(["require","jquery","underscore","monster"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),i={requests:{},subscribe:{"common.ringingDurationControl.render":"ringingDurationControlRender","common.ringingDurationControl.addEndpoint":"ringingDurationControlAddEndpoint","common.ringingDurationControl.getEndpoints":"ringingDurationControlGetEndpoints"},ringingDurationControlRender:function(e){var n=this,i=e.container,s=e.endpoints,o=e.callback,u=t(r.template(n,"ringingDurationControl-layout",e));i.empty().append(u),r.ui.tooltips(u),u.find(".grid-time").sortable({items:".grid-time-row:not(.title)",placeholder:"grid-time-row-placeholder"}),n.ringingDurationControlRenderSliders(u,s),n.ringingDurationControlBindEvents(t.extend(e,{template:u})),o&&o({template:u,data:s})},ringingDurationControlBindEvents:function(e){var n=this,r=e.template,i=e.endpoints;r.find(".distribute-button").on("click",function(){var e=r.find(".grid-time-row:not(.disabled) .slider-time");max=e.first().slider("option","max"),section=Math.floor(max/e.length),current=0,t.each(e,function(){t(this).slider("values",[current,current+=section])})}),r.find(".disable-row").on("change",function(){var e=t(this).parents(".grid-time-row");t(this).prop("checked")?(e.find(".times").stop().animate({opacity:0}),e.find(".name").stop().animate({opacity:.5}),e.addClass("disabled")):(e.find(".times").stop().animate({opacity:1}),e.find(".name").stop().animate({opacity:1}),e.removeClass("disabled"))}),r.on("click",".grid-time-row.title .scale-max",function(){var e=t(this),n=e.siblings(".scale-max-input");n.show().focus().select(),e.hide()}),r.on("blur",".grid-time-row.title .scale-max-input",function(e){var i=t(this),s=i.val();intValue=parseInt(i.val());if(s!=i.data("current")&&!isNaN(intValue)&&intValue>=30){var o=n.ringingDurationControlGetEndpoints({container:r,includeDisabled:!0});n.ringingDurationControlRenderSliders(r,o,intValue)}else i.val(i.data("current")).hide(),i.siblings(".scale-max").show()}),r.on("keydown",".grid-time-row.title .scale-max-input",function(e){var n=e.which?e.which:event.keyCode;if(n>57&&n<96)return!1;if(n===13)t(this).blur();else if(n===27){var r=t(this);r.val(r.data("current")).blur()}}),r.on("click",".remove-user",function(){var e=t(this).parents(".grid-time-row"),n=e.data("id");r.find('.add-user[data-id="'+n+'"]').removeClass("in-use"),e.remove()})},ringingDurationControlRenderSliders:function(e,r,i){var s=this,o=6,u=i&&i>=30?i:120;if(!i){var a=0;n.each(r,function(e){a=e.delay+e.timeout>a?e.delay+e.timeout:a}),u=a>u?Math.ceil(a/60)*60:u}var f=function(e,n){var r=n.value,i='<div class="slider-tooltip"><div class="slider-tooltip-inner">'+r+"</div></div>";t(n.handle).html(i)},l=function(t,n,r,i){var s=i.slider("values",0),o=i.slider("values",1),u='<div class="slider-tooltip"><div class="slider-tooltip-inner">'+s+"</div></div>",a='<div class="slider-tooltip"><div class="slider-tooltip-inner">'+o+"</div></div>";e.find('.grid-time-row[data-id="'+r+'"] .slider-time .ui-slider-handle').first().html(u),e.find('.grid-time-row[data-id="'+r+'"] .slider-time .ui-slider-handle').last().html(a)},c=function(n){var r=e.find('.grid-time-row[data-id="'+n.id+'"]'),i=r.find(".slider-time").slider({range:!0,min:0,max:u,values:[n.delay,n.delay+n.timeout],slide:f,change:f,create:function(e,r){l(e,r,n.id,t(this))}});r.hasClass("deleted")&&i.slider("disable"),h(r)},h=function(e,t){var n=e.find(".scale-container");t=t||!1,n.empty();for(var r=1;r<=o;r++){var i='<div class="scale-element" style="width:'+100/o+'%;">'+(t?(r==o?'<input type="text" value="'+u+'" data-current="'+u+'" class="scale-max-input" maxlength="3"><span class="scale-max">':"<span>")+Math.floor(r*u/o)+" Sec</span>":"")+"</div>";n.append(i)}t&&n.append("<span>0 Sec</span>")};n.each(r,function(e){c(e)}),h(e.find(".grid-time-row.title"),!0)},ringingDurationControlAddEndpoint:function(e){var t=this,n=e.container;n.find(".grid-time").append(r.template(t,"ringingDurationControl-row",e)),t.ringingDurationControlRenderSliders(n,[e.endpoint],parseInt(n.find(".grid-time-row.title .scale-max-input").val()))},ringingDurationControlGetEndpoints:function(e){var n=this,r=e.container,i=e.includeDisabled,s=t.map(r.find(".grid-time-row[data-id]"),function(e){var n=t(e),r=n.find(".slider-time").slider("values");if(i||!n.hasClass("disabled"))return{id:n.data("id"),delay:r[0],timeout:r[1]-r[0],name:n.find(".name").text()}});return e.callback&&e.callback(s),s}};return i});