$(document).ready(function(){$(window).scroll(function(){var e=$(window).height(),t=$(window).scrollTop();t>65?($(".page-nav").addClass("fixed"),$("section.alpha").css("marginTop","50px")):($(".page-nav").removeClass("fixed"),$("section.alpha").css("marginTop","0px"))}),$(".sub-nav a").on("click",function(e){$(".sub-nav li").removeClass("active"),$(this).parent("li").addClass("active")}),$('.sub-nav li a[href^="#"]').on("click",function(e){e.preventDefault();var t=this.hash,n=$(t);$("html, body").stop().animate({scrollTop:n.offset().top},"easeInOutQuad")}),$(".color-toggle li").on("click",function(e){var t=$(this).data("toggle");$(".color-toggle li").removeClass("active"),$(this).addClass("active"),$(".color-toggle-wrap").removeClass("visible"),$('.color-toggle-wrap[data-toggle="'+t+'"]').addClass("visible animated zoomIn")}),$(".btn-toggle li").on("click",function(e){var t=$(this).data("toggle");$(".btn-toggle li").removeClass("active"),$(this).addClass("active"),$(".btn-toggle-wrap").removeClass("visible"),$('.btn-toggle-wrap[data-toggle="'+t+'"]').addClass("visible animated zoomIn")}),$(".code-toggle").on("click",function(e){var t=$(this).next(".code-wrapper").hasClass("visible");$(this).next(".code-wrapper").slideToggle("fast").toggleClass("visible"),t?$(this).html("View Class Styles"):$(this).html("Hide Class Styles")})});