Array.prototype.compare = function(testArr) {
	if (this.length != testArr.length) return false;
	for (var i = 0; i < testArr.length; i++) {
		if (this[i].compare) { 
			if (!this[i].compare(testArr[i])) return false;
		}
		if (this[i] !== testArr[i]) return false;
	}
	return true;
}

/*
 *  --------- Member settings menu -------------
 */

$('.js-open-header-member-menu').webuiPopover({
	url:'.member_settings .pop-over',
	animation: 'pop',
	closeable: true,
	onHide: function(){
		$('.js-pop-over-settings').show();
		$('.js-pop-over-avatar').hide();
		$('.js-pop-over-username').hide();
}});

/* edit avatar */

$('.js-edit-avatar').click(function(e){
	$('.js-pop-over-settings').fadeOut( 200, function(){
		$('.js-pop-over-avatar').fadeIn();
	});
	e.preventDefault();
});

$('.js-pop-over-avatar .js-back-view').click(function(e){
	$('.js-pop-over-avatar').fadeOut( 200, function(){
		$('.js-pop-over-settings').fadeIn();
	});
	e.preventDefault();
});

/* edit username */

$('.js-edit-username').click(function(e){
	$('.js-pop-over-settings').fadeOut( 200, function(){
		$('.js-pop-over-username').fadeIn( 200, function(){
			$('.js-pop-over-username input[name=username]').focus().select();
		});
	});
	e.preventDefault();
});

$('.js-pop-over-username .js-back-view').click(function(e){
	$('.js-pop-over-username').fadeOut( 200, function(){
		$('.js-pop-over-settings').fadeIn();
	});
	e.preventDefault();
});

/*
 *  --------- New board menu -------------
 */

$('.js-add-board').webuiPopover( {url:'.new_board .pop-over', animation: 'pop', closeable: true } );
$('.js-perfect-scrollbar').perfectScrollbar();
$('.lists.js-lists').perfectScrollbar();
//$( ".webui-popover" ).draggable();