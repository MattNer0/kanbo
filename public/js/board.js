/* new label tag */

$('.js-add-label').webuiPopover({
	url:'.new_label .pop-over',
	animation: 'pop',
	closeable: true,
});

/* edit label tag */

$('.js-label').webuiPopover({
	url:'.edit_label .pop-over',
	animation: 'pop',
	closeable: true,
});

$('.js-label').click(function(e){
	$('form.edit-label input[name=title]').val( $(this).attr('ltitle') );
	$('form.edit-label input[name=label]').val( $(this).attr('lid') );

	var clr = $('.edit-label-palette .js-palette-color.card-label-'+ $(this).attr('lcolor') );
	$('.edit-label-palette .js-palette-color.active').html("").removeClass('active');

	clr.addClass('active').html("<i class='fa fa-check'></i>");
	clr.parents('.edit-label').find('input[name=color]').val( clr.attr('color') );
});

/*
 *  --------- List settings menu -------------
 */

$(".pop-over.list_settings .list_settings a.js-add-card").click(function(e){
	$(".js-list[listid='"+list_settings_listid+"'] .open-minicard-composer").click();
});

/* rename list */

$(".pop-over.list_settings .list_settings a.js-rename-list").click(function(e){
	$(".pop-over.list_settings .list_settings").fadeOut( 200, function(){
		$(".pop-over.list_settings .rename-list").fadeIn( 200, function(){
			$(".pop-over.list_settings .rename-list input.list-name-input").focus().select();
		});
	});
	e.preventDefault();
});

$( ".pop-over.list_settings .rename-list form" ).on( "submit", function(e) {
	e.preventDefault();
	
	$.post( "/list/rename?ajax=1", $(this).serialize() );

	var new_list_name = $(this).find('input.list-name-input').val();
	var list_settings_listid = $(this).find("input[name=list]").val();

	$(".list[listid='"+list_settings_listid+"'] h2.list-header-name").html(new_list_name);
	$(".js-list[listid='"+list_settings_listid+"'] .js-open-list-menu").webuiPopover('hide');
});

$(".pop-over.list_settings .rename-list .js-back-view").click(function(e){
	$(".pop-over.list_settings .rename-list").fadeOut( 200, function(){
		$(".pop-over.list_settings .list_settings").fadeIn();
	});
	e.preventDefault();
});

/* options list */

$(".pop-over.list_settings .list_settings a.js-option-list").click(function(e){
	$(".pop-over.list_settings .list_settings").fadeOut( 200, function(){
		$(".pop-over.list_settings .options-list").fadeIn();
	});
	e.preventDefault();
});

$( ".pop-over.list_settings .options-list form" ).on( "submit", function(e) {
	e.preventDefault();
	
	$.post( "/list/options?ajax=1", $(this).serialize() );

	var size_input = $(this).find("input[name='size']:checked").val();
	var list_settings_listid = $(this).find("input[name=list]").val();

	if(size_input == "wide"){
		$(".list[listid='"+list_settings_listid+"']").addClass("wide-list");
	} else {
		$(".list[listid='"+list_settings_listid+"']").removeClass("wide-list");
	}

	$('.webui-popover a.close').click();
});

$(".pop-over.list_settings .options-list .js-back-view").click(function(e){
	$(".pop-over.list_settings .options-list").fadeOut( 200, function(){
		$(".pop-over.list_settings .list_settings").fadeIn();
	});
	e.preventDefault();
});

/* archive list */

$(".pop-over.list_settings .list_settings a.js-archive-list").click(function(e){
	var listid = $(this).attr('listid');

	if( confirm("Are you sure you want to archive this list?") ){
		$.post( "/list/archive", { list: listid } );

		$(".js-list[listid='"+listid+"']").remove();
	}

	$(".webui-popover-inner .close").click();
	e.preventDefault();
});

/*
 *  --------- Board settings menu -------------
 */

$('.js-open-board-menu').webuiPopover({
	url:'.board_settings.pop-over',
	animation: 'pop',
	closeable: true,
	onHide: function(){
		$('.js-pop-over-board-settings').show();
		$('.js-pop-over-board-rename').hide();
		$('.js-pop-over-board-color').hide();
		$('.js-pop-over-board-background').hide();
	}
});

/* rename board */

$('.js-rename-board').click(function(e){
	$('.js-pop-over-board-settings').fadeOut( 200, function(){
		$('.js-pop-over-board-rename').fadeIn();
	});
	e.preventDefault();
});

$('.js-pop-over-board-rename .js-back-view').click(function(e){
	$('.js-pop-over-board-rename').fadeOut( 200, function(){
		$('.js-pop-over-board-settings').fadeIn();
	});
	e.preventDefault();
});

/* color board */

$('.js-edit-color-board').click(function(e){
	$('.js-pop-over-board-settings').fadeOut( 200, function(){
		$('.js-pop-over-board-color').fadeIn();
	});
	e.preventDefault();
});

$('.js-pop-over-board-color .js-back-view').click(function(e){
	$('.js-pop-over-board-color').fadeOut( 200, function(){
		$('.js-pop-over-board-settings').fadeIn();
	});
	e.preventDefault();
});

$('.board-backgrounds-list .js-select-background').click(function(e){
	if( !$(this).hasClass('active') ){
		$('.board-backgrounds-list .js-select-background.active').removeClass('active').find('span').html("");
		$(this).addClass('active').find('span').html("<i class='fa fa-check'></i>");
		$(this).parents('form').find('input[name=color]').val( $(this).attr('color') );
	}
	e.preventDefault();
});

/* background board */

$('.js-edit-background-board').click(function(e){
	$('.js-pop-over-board-settings').fadeOut( 200, function(){
		$('.js-pop-over-board-background').fadeIn();
	});
	e.preventDefault();
});

$('.js-pop-over-board-background .js-back-view').click(function(e){
	$('.js-pop-over-board-background').fadeOut( 200, function(){
		$('.js-pop-over-board-settings').fadeIn();
	});
	e.preventDefault();
});

/*
 *  --------- Board Members menu -------------
 */

$('.js-manage-board-members').webuiPopover({
	url:'.board_add_member.pop-over',
	animation: 'pop',
	closeable: true,
	onHide: function(){
		$(".board_add_member .add-member-form .member-match").html();
		$(".board_add_member .add-member-form input[name=username]").val();
	}
});

$(".board_add_member .add-member-form input[name=username]").keyup(function(e){
	var username = $(this).val();

	if(username.length > 2){
		
		$.post( "/member/find?ajax=1", { 'term' : username } ).done(function(data){
			if(data){
				var template = _.template( $( "script.member_list" ).html() );
				$(".board_add_member .add-member-form .member-match").html( template(data) );
				initBoardSelectMembers();
			}
		});

	} else {
		$(".board_add_member .add-member-form .member-match").html();
	}
});

/*
 *  --------- Board Admins menu -------------
 */

$('.js-manage-board-admins').webuiPopover({
	url:'.board_add_admin.pop-over',
	animation: 'pop',
	closeable: true,
	onHide: function(){
		$(".board_add_admin .add-admin-form .member-match").html();
		$(".board_add_admin .add-admin-form input[name=username]").val();
	}
});

/* click on member */

function initBoardSelectMembers(){
	$(".board_add_member .add-member-form .js-select-member").click(function(e){

		var member_id = $(this).attr('memberid');
		var board_id = $(this).parents('.add-member-form').find("input[name='board']").val();

		$.post( "/member/board", {
			'board' : board_id,
			'member' : member_id,
		}).done(function(data){
			if(data){
				var new_member = '<a title="'+data.username+'" href="#" class="member js-member"><img src="/files/avatar/'+data.avatar+'" class="avatar avatar-image"></a>';
				$(".board-widget-members .board-widget-content .add-member").before( new_member );
			}
		});

		$('.js-manage-board-members').webuiPopover('hide');

		e.preventDefault();
	});
}

/* --- stuff ---- */

function resortCards( listElement ) {
	var sortedCards = listElement.sortable( "toArray", { attribute: "cardid" });
	console.log(sortedCards);

	$.post( "/card/sort", {
		'board' : $('.board-canvas').attr('boardid'),
		'list' : listElement.parents('.list').attr('listid'),
		'sorted': sortedCards
	});
}

function updateCard( cardElement ) {
	$.post( "/card/move", {
		'board' : $('.board-canvas').attr('boardid'),
		'list' : cardElement.parents('.list').attr('listid'),
		'card' : cardElement.attr('cardid')
	});
}

function closeCardDetails(){
	$(".card-details .js-open-card-details-menu").webuiPopover('hide');
	$(".card-details .js-add-labels").webuiPopover('hide');

	$('.js-minicard.is-selected').removeClass('is-selected');
	$('.lists').find('.js-card-details').remove();
	$('.pop-over[cardid]').remove();
	$('.board-canvas .board-overlay').fadeOut(200, function(){
		$('.board-canvas .board-overlay').remove();
	});
}

function updateCardDetails(){
	$('.js-close-card-details').click(function(e){
		closeCardDetails();
		e.preventDefault();
	});

	$('.js-card-details').mouseenter(function(e){
		$('.board-canvas').prepend( '<div class="board-overlay" style="display:none;"></div>' );
		$('.board-canvas .board-overlay').fadeIn();
	});

	$('.js-card-details').mouseleave(function(e){
		$('.board-canvas .board-overlay').fadeOut(200, function(){
			$('.board-canvas .board-overlay').remove();
		});
	});

	initCardDetails();
}

function initNewCardForm(){

	$(".js-close-inlined-form").click(function(e){
		var self = $(this).parents('.minicard-composer-form');
		self.fadeOut( 200, function(){
			self.prev().fadeIn();
		});

		e.preventDefault();
	});

	$(".open-minicard-composer.js-open-inlined-form").click(function(e){
		var self = $(this).parent();
		self.fadeOut( 200, function(){
			self.next(".minicard-composer-form").fadeIn( 200, function(){
				self.next().find('textarea.minicard-composer-textarea').focus();
			});
		});
		
		e.preventDefault();
	});

	$(".minicard-composer-form textarea.minicard-composer-textarea").keypress(function (e) {
		if(e.which == 13) {
			$(this).parents(".minicard-composer-form").submit();
			e.preventDefault();
		}
	});

	$(".minicard-composer-form").submit(function(e){
		var self = this;

		$.post( "/card/new?ajax=1", $(this).serialize() ).done(function(data){
			var template = _.template( $( "script.list_card" ).html() );

			var list_id = $(self).find("input[name=boardlist]").val();

			$( ".board-canvas .lists .list[listid='"+list_id+"'] .minicards .open-minicard-composer" ).before( template(
				{
					cardslist: [ data ],
				}
			));

			$(self).fadeOut( 200, function(){
				$(self).prev().fadeIn();
			});

		});

		e.preventDefault();
	})
}

function initListSettings(){
	$(".js-list .js-open-list-menu").webuiPopover({
		url:".list_settings.pop-over",
		animation: 'pop',
		closeable: true,
		onHide: function(){
			$(".list_settings.pop-over .list_settings").show();
			$(".list_settings.pop-over .rename-list").hide();
			$(".list_settings.pop-over .options-list").hide();
		}
	});

	$(".js-list .js-open-list-menu").click(function(e){
		list_settings_listid = $(this).parents('.list').attr('listid');

		$(".pop-over.list_settings .rename-list input[name=title]").val( $(this).prev('.list-header-name').html() );
		$(".pop-over.list_settings .rename-list input[name=list]").val(list_settings_listid);
		$(".pop-over.list_settings .options-list input[name=list]").val(list_settings_listid);

		$(".pop-over.list_settings a.js-archive-list").attr('listid', list_settings_listid);

		if( $(".list[listid='"+list_settings_listid+"']").hasClass("wide-list") ){
			$(".pop-over.list_settings .options-list input[name=size][value=wide").prop('checked', true);
		}
	});
}

$( ".js-list-composer form" ).on( "submit", function(e) {
	e.preventDefault();

	var self = this;
	var template = _.template( $( "script.list_list" ).html() );

	$(this).fadeOut( 200, function(){
		$(self).prev().fadeIn(200);
	});
	
	$.post( "/list/new?ajax=1", $(this).serialize() ).done(function(data){
		$( ".board-canvas .lists .list-composer" ).before( template( data ) );

		$(".list-body.js-perfect-scrollbar").perfectScrollbar();

		setTimeout( function(){
			funcListsList();
			//funcCardsList();
		}, 50);
	});
});