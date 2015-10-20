$(document).ready(function(){

	var horzScroller;
	
	function loadScroller(){
		var filterW = 0;
		$('nav.sub-nav .nav li:visible').each(function() {
		    filterW += $(this).outerWidth(true);
		});
		console.log(filterW);
		
		$('nav.sub-nav .nav').css({
			'width': filterW + 50
		});
		
		$('nav.sub-nav').addClass('scrollable horizontal');
		
		/*
		horzScroller = new iScroll(document.querySelector('.sub-nav'), { 
			hScrollbar: false, 
			vScrollbar: false, 
			vScroll: false, 
			hScroll: true
		});
		*/
	}
	
	function destroyScroller(){
		$('nav.sub-nav').css('overflow-x', 'auto');
		$('nav.sub-nav .nav').css('width', '100%');
		
		/*
		horzScroller.disable();
		
		setTimeout(function(){
			$('nav.sub-nav .nav').removeAttr('style');
		}, 100);
		
		console.log(horzScroller);
		*/
	}
	

	$(window).load(function(){
		if( $('html').hasClass('isHandheld') ){
			loadScroller();
		}
	});
	
	$(window).resize(function(){
		if( $('html').hasClass('isHandheld') ){
			loadScroller();
		}
		else {
			destroyScroller();
		}
	});
	
	
	function adjustColumns(){
		if( $('#page aside').outerHeight(true) > $('#page .left-column').outerHeight(true) ){
			$('#page').css('height', ($('#page aside').outerHeight(true) + 120) + 'px');
		}
	}
	
	function clearColumns(){
		$('#page, aside').css('height', 'auto');
	}
	
	$(window).resize(function(){
		if( $('html').hasClass('isHandheld') == false ){
			adjustColumns();
		}
		else {
			clearColumns();
		}
	});
	
	if( $('html').hasClass('isHandheld') == false ){
		adjustColumns();
	}
	else {
		clearColumns();
	}
	
	$('.search form').submit(function(e){
		e.preventDefault();
		e.stopPropagation();
		
		var q = $('input', this).val();
		var params = new Object();
		params.q = q;
		gApplication.showView('eeljson', params);
	});

});