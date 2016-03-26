define(["require","jquery","underscore","monster","toastr","ddslick"],function(e){var t=e("jquery"),n=e("underscore"),r=e("monster"),s=e("toastr"),o=e("ddslick"),u={externalScripts:["buyNumbers-googleMapsLoader"],requests:{"phonebook.search":{apiRoot:r.config.api.phonebook,url:"numbers/us/search?prefix={pattern}&limit={limit}&offset={offset}",verb:"GET"},"phonebook.searchBlocks":{apiRoot:r.config.api.phonebook,url:"blocks/us/search?prefix={pattern}&limit={limit}&offset={offset}&size={size}",verb:"GET"},"phonebook.searchByAddress":{apiRoot:r.config.api.phonebook,url:"locality/address",verb:"POST",generateError:!1}},subscribe:{"common.buyNumbers":"buyNumbersRender"},appFlags:{searchLimit:15,selectedCountryCode:"US",isPhonebookConfigured:r.config.api.hasOwnProperty("phonebook"),isSelectedNumbersEmpty:!0},buyNumbersRender:function(e){var t=this,e=e||{},n={searchType:e.searchType||"regular",singleSelect:e.singleSelect||!1};t.assignedAccountId=e.accountId||t.accountId,t.buyNumbersGetAvailableCountries(function(r){n.availableCountries=r,t.buyNumbersShowPopup(n,e.callbacks)})},buyNumbersGetAvailableCountries:function(e){var t=this;e({US:{local:!0,toll_free:[800,844,855,866,877,888],vanity:!0,prefix:1,name:"United States"}})},buyNumbersShowPopup:function(e,n){var i=this,s=e.searchType,o=e.availableCountries,u=t(r.template(i,"buyNumbers-layout",{isPhonebookConfigured:i.appFlags.isPhonebookConfigured}));e.popup=r.ui.dialog(u,{title:i.i18n.active().buyNumbers.buyDialogTitle,width:"600px",position:["center",20]}),t.extend(!0,e,{container:u,displayedNumbers:[],selectedNumbers:[],isSearchFunctionEnabled:!1}),u.find(".start-hidden").hide(),u.find(".regular-search").hide(),u.find(".vanity-search").hide(),u.find(".tollfree-search").hide();switch(s){case"tollfree":i.buyNumbersRenderTollfree(e);break;case"vanity":i.buyNumbersRenderVanity(e,n||{});break;case"regular":default:i.buyNumbersRenderRegular(e)}i.buyNumbersBindEvents(e,n||{})},buyNumbersBindEvents:function(e,i){var s=this,o=e.container,u=o.find("#search_result_div"),a=u.find(".left-div"),f=function(){var t=s.buyNumbersSelectedNumbersToArray(e.selectedNumbers,e.availableCountries[s.appFlags.selectedCountryCode].prefix),u=o.find("#processing_purchase_div");u.show(),u.find("i.fa-spinner").addClass("fa-spin"),s.buyNumbersRequestActivateBlock({data:{accountId:s.assignedAccountId,data:{numbers:t}},success:function(t){t.hasOwnProperty("success")&&!n.isEmpty(t.success)&&i.hasOwnProperty("success")&&i.success(t.success),e.popup.dialog("close")},error:function(t){if(!n.isEmpty(t)){var o=s.i18n.active().buyNumbers.partialPurchaseFailure+" "+Object.keys(t).join(" ");r.ui.alert("error",o)}e.popup.dialog("close"),i.hasOwnProperty("error")&&i.error()},cancel:function(){s.buyNumbersShowSearchResults(e),u.hide()}})};u.on("click","i.remove-number",function(n){n.preventDefault();var r=t(this),i=r.data("index"),u=r.data("array_index");e.singleSelect&&(t.each(o.find(".add-number"),function(e,n){t(this).removeClass("disabled").prop("disabled",!1)}),s.appFlags.isSelectedNumbersEmpty=!0,o.find("#single_select_info").removeClass("hidden")),e.selectedNumbers.splice(i,1),s.buyNumbersRefreshSelectedNumbersList(e),delete e.displayedNumbers[u].selected,o.find("#"+u+"_div").show()}),u.on("click","button.add-number",function(n){n.preventDefault();var r=t(this).data("array_index");e.singleSelect&&(t.each(o.find(".add-number"),function(e,n){t(this).addClass("disabled").prop("disabled",!0)}),s.appFlags.isSelectedNumbersEmpty=!1,o.find("#single_select_info").addClass("hidden")),e.selectedNumbers.push(e.displayedNumbers[r]),s.buyNumbersRefreshSelectedNumbersList(e),e.displayedNumbers[r].selected=!0,o.find("#"+r+"_div").hide("slide",{direction:"right"},300),a.children(".number-box").height()*a.children(".number-box:visible").length<=a.innerHeight()&&a.scroll()}),o.find("#buy_numbers_button").on("click",function(t){t.preventDefault();var n=s.buyNumbersGetTotalNumbers(e.selectedNumbers);n>0?(o.find("#search_top_div").hide(),o.find("#search_result_div").hide(),o.find("#check_numbers_div").show(),s.buyNumbersToggleCheckingDiv(o,!0),setTimeout(function(){s.buyNumbersToggleCheckingDiv(o,!1);var e=[];e.length>0?o.find("#check_numbers_div .unavailable-div .unavailable-numbers").empty().append(r.template(s,"buyNumbers-unavailableNumbers",{numbers:e})):(o.find("#check_numbers_div").hide(),f())},1e3)):r.ui.alert("error",s.i18n.active().buyNumbers.noSelectedNumAlert)}),o.find("#back_to_results_link").on("click",function(t){t.preventDefault(),s.buyNumbersShowSearchResults(e),o.find("#check_numbers_div").hide()}),o.find("#continue_buy_button").on("click",function(e){e.preventDefault(),o.find("#check_numbers_div").hide(),f()})},buyNumbersRenderCountrySelect:function(e,t){var n=this,r=e.container,i=e.countryData;countrySelect=e.countrySelect,countrySelectFunction=e.countrySelectFunction},buyNumbersRenderVanity:function(e,n,r){var i=this,s=e.container,o=e.availableCountries,u=[];t.each(o,function(e,t){t.vanity&&(e==="US"?u.splice(0,0,i.buyNumbersFormatCountryListElement(e,t)):u.push(i.buyNumbersFormatCountryListElement(e,t)))}),i.buyNumbersRenderCountrySelect({container:s,countryData:u,countrySelect:s.find("#vanity_country_select"),countrySelectFunction:function(e){var t=s.find("#vanity_search_div"),n=t.find(".vanity-input."+e.selectedData.value+"-input");t.find(".vanity-input").hide(),n.length>=1?n.show():t.find(".vanity-input.default-input").show(),t.find("#back_to_vanity_search").click()}}),s.find(".vanity-search").show(),i.buyNumbersBindVanityEvents(e,n)},buyNumbersBindVanityEvents:function(e,i){var s=this,o=e.container,u=o.find("#vanity_search_div"),a=e.availableCountries,f="";u.find(".vanity-input input").on("keydown",function(e){var n=t(this),r=n.nextAll("input").first(),i=n.prevAll("input").first();r.length===1&&this.selectionStart===n.prop("maxlength")&&(e.keyCode>=48&&e.keyCode<=57||e.keyCode>=65&&e.keyCode<=90||e.keyCode==39)?(e.keyCode==39&&e.preventDefault(),r.focus(),r[0].selectionStart=r[0].selectionEnd=0):i.length===1&&this.selectionStart===0&&(e.keyCode==8||e.keyCode==37)&&(e.keyCode==37&&e.preventDefault(),i.focus(),i[0].selectionStart=i[0].selectionEnd=i.val().length)}),u.find("#vanity_search_button").on("click",function(e){e.preventDefault();var n=u.find(".vanity-input-div"),i=t(this),o=!1;n.find(".vanity-input:visible input:text").each(function(e,n){f+=t(n).val().toUpperCase()});switch(s.appFlags.selectedCountryCode){case"US":o=f.length===10;break;default:o=f.length>0&&f.length<=20}n.children("i").hide(),n.children("i.fa-spinner").show(),i.prop("disabled",!0),o?s.buyNumbersRequestSearchNumbers({data:{pattern:f,offset:0,limit:1},success:function(e){e&&e.length>0?(n.children("i.fa-check").show(),u.find("#vanity_buy_button").show(),u.find("#back_to_vanity_search").show(),i.hide(),n.find("input:text").prop("disabled",!0)):(n.children("i.fa-times").show(),f=""),n.children("i.fa-spinner").hide(),i.prop("disabled",!1)},error:function(){r.ui.alert("error",s.i18n.active().buyNumbers.unavailableServiceAlert),n.children("i.fa-spinner").hide(),i.prop("disabled",!1)}}):(r.ui.alert("error",s.i18n.active().buyNumbers.partialNumAlert),f="",n.children("i.fa-spinner").hide(),i.prop("disabled",!1))}),u.find("#back_to_vanity_search").on("click",function(e){e.preventDefault();var n=u.find(".vanity-input-div");n.children("i").hide(),n.find(".vanity-input:visible input:text").prop("disabled",!1).val("").first().focus(),u.find("#vanity_search_button").show(),u.find("#vanity_buy_button").hide(),t(this).hide()}),u.find("#vanity_buy_button").on("click",function(t){t.preventDefault(),f.length>0&&s.buyNumbersRequestActivateBlock({data:{accountId:s.assignedAccountId,data:{numbers:["+"+e.availableCountries[s.appFlags.selectedCountryCode].prefix+f]}},success:function(t){if(t.hasOwnProperty("success")&&!n.isEmpty(t.success))i.hasOwnProperty("success")&&i.success(t.success);else{if(!n.isEmpty(t)){var o=s.i18n.active().buyNumbers.partialPurchaseFailure+"<br/>"+Object.keys(t.error).join("<br/>");r.ui.alert("error",o)}i.hasOwnProperty("error")&&i.error()}e.popup.dialog("close")}})})},buyNumbersRenderTollfree:function(e,n){var i=this,s=e.container,o=e.availableCountries,u=[];t.each(o,function(e,t){t.toll_free&&t.toll_free.length>0&&(e==="US"?u.splice(0,0,i.buyNumbersFormatCountryListElement(e,t)):u.push(i.buyNumbersFormatCountryListElement(e,t)))});var a=o[i.appFlags.selectedCountryCode].toll_free,f=s.find("#tollfree_radio_group");f.empty().append(r.template(i,"buyNumbers-tollfree",{tollfreePrefixes:a})),f.find("input:radio:first").prop("checked",!0),s.find(".tollfree-search").show(),i.buyNumbersBindTollfreeEvents(e)},buyNumbersBindTollfreeEvents:function(e){var n=this,i=e.container,s=e.availableCountries,o=i.find("#search_result_div"),u=o.find(".left-div"),a=function(e,t,n){},f=!1,l=0;i.find("#tollfree_search_button").on("click",function(c){c.preventDefault();var h=i.find('#tollfree_radio_group input[type="radio"]:checked').val();a=function(i,o,a){f=!0,u.append(r.template(n,"buyNumbers-loadingNumbers",{})),u[0].scrollTop=u[0].scrollHeight,n.buyNumbersRequestSearchNumbers({data:{pattern:h,offset:i,limit:o},success:function(r){r&&r.length>0?(t.each(r,function(t,r){var i=r.number,o="+"+s[n.appFlags.selectedCountryCode].prefix;i.indexOf(o)===0&&(i=i.substring(o.length)),e.displayedNumbers.push({array_index:e.displayedNumbers.length,number_value:i,formatted_value:n.buyNumbersFormatNumber(i,n.appFlags.selectedCountryCode)})}),l+=o):e.isSearchFunctionEnabled=!1,a&&a(),f=!1},error:function(){r.ui.alert("error",n.i18n.active().buyNumbers.unavailableServiceAlert),a&&a(),f=!1}})},e.displayedNumbers=[],e.selectedNumbers=[],l=0,e.isSearchFunctionEnabled=!0,u.empty(),a(l,n.appFlags.searchLimit,function(){n.buyNumbersRefreshDisplayedNumbersList(e),n.buyNumbersRefreshSelectedNumbersList(e)}),o.css("display")==="none"&&o.slideDown()}),u.on("scroll",function(r){var i=t(this);e.isSearchFunctionEnabled&&!f&&i.scrollTop()>=i[0].scrollHeight-i.innerHeight()-20&&a(l,n.appFlags.searchLimit,function(){n.buyNumbersRefreshDisplayedNumbersList(e)})})},buyNumbersRenderRegular:function(e,n){var r=this,i=e.container,s=e.availableCountries,o=[];t.each(s,function(e,t){t.local&&(e==="US"?o.splice(0,0,r.buyNumbersFormatCountryListElement(e,t)):o.push(r.buyNumbersFormatCountryListElement(e,t)))}),r.buyNumbersRenderCountrySelect({container:i,countryData:o,countrySelect:i.find("#regular_country_select"),countrySelectFunction:function(e){}}),i.find(".regular-search").show(),r.buyNumbersBindRegularEvents(e)},buyNumbersBindRegularEvents:function(e){var n=this,i=e.container,o,u={},a=i.find("#search_result_div"),f=a.find(".left-div"),l=function(e,t,n){},c=!1,h=e.availableCountries,p=0;i.find("#city_input").autocomplete({source:function(e,r){i.find("#area_code_radio_div").empty().slideUp(),o=undefined,e.term.match(/^\d+/)||n.buyNumbersRequestSearchNumbersByCity({data:{city:e.term},success:function(e){e&&(u=e,r(t.map(u,function(e,t){return{label:t+", "+e.state+" ("+(e.prefixes.length<=2?e.prefixes.join(", "):e.prefixes.slice(0,2).join(", ")+",...")+")",value:t}}).sort(function(e,t){return e.value.toLowerCase()>t.value.toLowerCase()}).slice(0,10)))}})},minLength:2,delay:500,select:function(e,t){var s=u[t.item.value].prefixes.sort(),a=i.find("#area_code_radio_div");o=t.item.value,a.empty().append(r.template(n,"buyNumbers-areaCodes",{areaCodes:s})).find("input:radio:first").prop("checked",!0),s.length>1?a.slideDown():a.slideUp(),e.stopPropagation()}}),i.find("#seq_num_checkbox").change(function(){var e=i.find("#seq_num_input_span"),t=i.find("#search_numbers_button");this.checked?(e.slideDown(),t.animate({marginTop:"46px"})):(e.slideUp(),t.animate({marginTop:"0"}))}),i.on("keydown",'#city_input, input[name="area_code_radio"], #seq_num_input, #seq_num_checkbox',function(e){e.keyCode==13&&(i.find("#search_numbers_button").click(),t(this).blur())}),i.find("#search_numbers_button").on("click",function(u){u.preventDefault();var d=parseInt(i.find("#seq_num_input").val(),10)||1,v=i.find("#seq_num_checkbox").prop("checked"),m=i.find("#city_input").val(),g=m.match(/^\d+$/)?m:i.find('#area_code_radio_div input[type="radio"]:checked').val(),y=(m.match(/^\d{3}$/)?n.i18n.active().buyNumbers.areaCode+" "+m:o+" ("+g+")")+(v?" "+r.template(n,"!"+n.i18n.active().buyNumbers.seqNumParamLabel,{sequentialNumbers:d}):"");n.appFlags.isPhonebookConfigured&&n.appFlags.selectedCountryCode==="US"&&m.match(/^\d{5}$/)?n.buyNumbersRequestSearchAreaCodeByAddress({data:{address:parseInt(m,10)},success:function(e){i.find("#area_code_map").slideDown(400,function(){n.buyNumbersInitAreaCodeMap(e)})},error:function(){i.find("#area_code_map").slideUp(function(){t(this).empty()}),s.error(n.i18n.active().buyNumbers.zipCodeDoesNotExist)}}):!g||n.appFlags.selectedCountryCode==="US"&&!g.match(/^\d{3}$/)?r.ui.alert("error",n.i18n.active().buyNumbers.noInputAlert):!v||d>1?(v?l=function(i,s,o){c=!0,f.append(r.template(n,"buyNumbers-loadingNumbers",{})),n.buyNumbersRequestSearchBlockOfNumbers({data:{pattern:"+"+h[n.appFlags.selectedCountryCode].prefix+g,size:d,offset:i,limit:s},success:function(r){r&&r.length>0?(t.each(r,function(t,r){var i=r.start_number,s=r.end_number,o="+"+h[n.appFlags.selectedCountryCode].prefix;i.indexOf(o)===0&&(i=i.substring(o.length)),s.indexOf(o)===0&&(s=s.substring(o.length)),e.displayedNumbers.push({array_index:e.displayedNumbers.length,number_value:i+"_"+r.size,formatted_value:n.buyNumbersFormatNumber(i,n.appFlags.selectedCountryCode,s)})}),p+=s):e.isSearchFunctionEnabled=!1,o&&o(),c=!1},error:function(){r.ui.alert("error",n.i18n.active().buyNumbers.unavailableServiceAlert),o&&o(),c=!1}})}:l=function(i,s,o){c=!0,f.append(r.template(n,"buyNumbers-loadingNumbers",{})),f[0].scrollTop=f[0].scrollHeight,n.buyNumbersRequestSearchNumbers({data:{pattern:g,offset:i,limit:s},success:function(r){r&&r.length>0?(t.each(r,function(t,r){var i=r.number,s="+"+h[n.appFlags.selectedCountryCode].prefix;i.indexOf(s)===0&&(i=i.substring(s.length)),e.displayedNumbers.push({array_index:e.displayedNumbers.length,number_value:i,formatted_value:n.buyNumbersFormatNumber(i,n.appFlags.selectedCountryCode)})}),p+=s):e.isSearchFunctionEnabled=!1,o&&o(),c=!1},error:function(){r.ui.alert("error",n.i18n.active().buyNumbers.unavailableServiceAlert),o&&o(),c=!1}})},i.find("#search_parameters").html(y),e.displayedNumbers=[],e.selectedNumbers=[],p=0,e.isSearchFunctionEnabled=!0,f.empty(),l(p,n.appFlags.searchLimit,function(){n.buyNumbersRefreshDisplayedNumbersList(e),n.buyNumbersRefreshSelectedNumbersList(e)}),i.find("#search_top_div").slideUp(function(){a.slideDown()})):r.ui.alert("error",n.i18n.active().buyNumbers.seqNumAlert)}),i.find("#back_to_search").click(function(e){e.preventDefault(),a.find(".result-content-div .left-div").scrollTop(0),a.slideUp(function(){i.find("#search_top_div").slideDown()})}),f.on("scroll",function(r){var i=t(this);e.isSearchFunctionEnabled&&!c&&i.scrollTop()>=i[0].scrollHeight-i.innerHeight()-20&&l(p,n.appFlags.searchLimit,function(){n.buyNumbersRefreshDisplayedNumbersList(e)})})},buyNumbersFormatNumber:function(e,t,n,r){var i=this,s=e.toString(),t=t||"US",n=n?n.toString():s,o=s;switch(t){case"US":o=(r?"+"+r+" ":"")+s.replace(/(\d{3})(\d{3})(\d{4})/,"($1) $2-$3");break;default:o=(r?"+"+r:"")+s}return n.length===s.length&&n!==s&&(o+=" "+i.i18n.active().buyNumbers.to+" "+n.substr(n.length-4)),o},buyNumbersGetTotalNumbers:function(e){var n,r=0;return t.each(e,function(e,t){n=t.number_value.match(/\d+_(\d+)/),n?r+=parseInt(n[1],10):r+=1}),r},buyNumbersFormatCountryListElement:function(e,t){return{text:t.name,value:e,imageSrc:"http://192.168.1.182:8888/number_manager/img/flags/"+e+".png"}},buyNumbersRefreshSelectedNumbersList:function(e){var t=this,n=e.container,i=r.template(t,"buyNumbers-selectedNumbers",{numbers:e.selectedNumbers,isSingleSelect:e.singleSelect}),s=t.buyNumbersGetTotalNumbers(e.selectedNumbers);n.find("#search_result_div .right-div .center-div").empty().append(i),n.find("#total_num_span").html(s),textAdded=s===0||s===1?t.i18n.active().buyNumbers.numberAddedSingle:t.i18n.active().buyNumbers.numberAddedPlural,n.find(".number-added").html(textAdded)},buyNumbersRefreshDisplayedNumbersList:function(e){var n=this,i=e.container,s=r.template(n,"buyNumbers-searchResults",{numbers:e.displayedNumbers}),o=i.find("#search_result_div .left-div");o.empty().append(s),e.singleSelect&&(n.appFlags.isSelectedNumbersEmpty||t.each(o.find(".add-number"),function(e,n){t(this).addClass("disabled").prop("disabled",!0)})),!e.isSearchFunctionEnabled&&o[0].scrollHeight>o.height()&&o.children(".number-box.number-wrapper").last().css("border-bottom","none")},buyNumbersShowSearchResults:function(e){var t=this,n=e.container,r=n.find("#search_result_div"),i=e.searchType;i==="tollfree"&&n.find("#search_top_div").show(),r.show(),t.buyNumbersRefreshDisplayedNumbersList({container:r,displayedNumbers:e.displayedNumbers,isSearchFunctionEnabled:e.isSearchFunctionEnabled}),t.buyNumbersRefreshSelectedNumbersList({container:r,selectedNumbers:e.selectedNumbers})},buyNumbersToggleCheckingDiv:function(e,t){var n=e.find("#check_numbers_div .checking-div"),r=e.find("#check_numbers_div .unavailable-div");t?(r.hide(),n.show(),n.find("i.fa-spinner").addClass("fa-spin")):(r.show(),n.hide(),n.find("i.fa-spinner").removeClass("fa-spin"))},buyNumbersSelectedNumbersToArray:function(e,t){var r=[],t=t.toString().indexOf("+")<0?"+"+t:t;return n.each(e,function(e){var n=e.number_value.match(/([0-9]+)_([0-9]+)/),s=n?n[1]:e.number_value;if(n)for(i=0;i<parseInt(n[2]);i++)r.push(t+(parseInt(s)+i));else r.push(t+s)}),r},buyNumbersInitAreaCodeMap:function(e){var t=this,r=function(){var r=new google.maps.LatLngBounds,s=new google.maps.InfoWindow,o={panControl:!1,zoomControl:!0,mapTypeControl:!1,scaleControl:!0,streetViewControl:!1,overviewMapControl:!0},u=new google.maps.Map(document.getElementById("area_code_map"),o);n.each(e.locales,function(e,t){r.extend(i(u,s,t,e).getPosition())}),u.setCenter(r.getCenter()),u.fitBounds(r)},i=function(n,r,i,s){var o=new google.maps.LatLng(parseFloat(s.latitude),parseFloat(s.longitude)),u={animation:google.maps.Animation.DROP,areaCodes:s.prefixes,position:o,title:i,map:n},a=new google.maps.Marker(u);return a.addListener("click",function(){r.setContent("<p>"+t.i18n.active().buyNumbers.markerAreaCodes+this.title+":</p/>"+"<ul>"+"<li><b>"+this.areaCodes.join("<b/></li><li><b>")+"</b>"+"</li>"+"</ul>"),r.open(n,a)}),a};r()},buyNumbersCoerceObjectToArray:function(e){return n.isArray(e)?e:n.map(e,function(e){return e})},buyNumbersGetUniqueAreaCodes:function(e){return n.each(e,function(e,t,r){e.prefixes=n.map(e.prefixes,function(e,t){return e.substr(0,3)}),r[t].prefixes=n.uniq(e.prefixes)}),e},buyNumbersRequestActivateBlock:function(e){var n=this;n.callApi({resource:"numbers.activateBlock",data:t.extend(!0,{},e.data,{generateError:!1}),success:function(t,n,r){e.hasOwnProperty("success")&&e.success(t.data)},error:function(t,n,r){t.error!=="402"&&typeof t.data!="string"?e.error&&e.error(t.data):(r(t,{generateError:!0}),e.cancel&&e.cancel())},onChargesCancelled:function(){e.cancel&&e.cancel()}})},buyNumbersRequestSearchNumbers:function(e){var t=this,n={resource:t.appFlags.isPhonebookConfigured?"phonebook.search":"numbers.search",data:e.data,success:function(n,r){e.hasOwnProperty("success")&&e.success(t.buyNumbersCoerceObjectToArray(n.data))},error:function(t,n){e.hasOwnProperty("error")&&e.error()}};t.appFlags.isPhonebookConfigured?r.request(n):t.callApi(n)},buyNumbersRequestSearchBlockOfNumbers:function(e){var t=this,n={resource:t.appFlags.isPhonebookConfigured?"phonebook.searchBlocks":"numbers.searchBlocks",data:e.data,success:function(t,n){e.hasOwnProperty("success")&&e.success(t.data)},error:function(t,n){e.hasOwnProperty("error")&&e.error()}};t.appFlags.isPhonebookConfigured?r.request(n):t.callApi(n)},buyNumbersRequestSearchNumbersByCity:function(e){var t=this;t.callApi({resource:"numbers.searchCity",data:e.data,success:function(t,n){e.hasOwnProperty("success")&&e.success(t.data)},error:function(t,n){e.hasOwnProperty("error")&&e.error()}})},buyNumbersRequestSearchAreaCodeByAddress:function(e){var n=this;r.request({resource:"phonebook.searchByAddress",data:{data:t.extend({distance:10},e.data)},success:function(r,i){e.hasOwnProperty("success")&&e.success(t.extend(!0,r.data,{locales:n.buyNumbersGetUniqueAreaCodes(r.data.locales)}))},error:function(t,n){n.status===404&&e.hasOwnProperty("error")&&e.error()}})}};return u});