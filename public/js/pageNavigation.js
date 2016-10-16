var sortedLists = "";
var list_settings_listid = '';

function initHome(){
	var template = _.template( $( "script.board_list" ).html() );

	console.log('load board list');
	$.getJSON( "/board/list", function( data ) {
		$( ".content_container" ).append( template( data ) );
		initHomeStars();
	});
}

function initBoard(){

	var template = _.template( $( "script.list_list" ).html() );

	var board_id = $(".board-canvas").attr('boardid');

	initStars();

	$.getJSON( "/list/list/"+board_id, function( data ) {
		$( ".board-canvas .lists" ).prepend( template( data ) );

		for(var i=0; i< data.listslist.length; i++){
			initList( board_id, data.listslist[i]._id );
		}

		$(".list-body.js-perfect-scrollbar").perfectScrollbar();

		setTimeout( function(){
			funcListsList();
			funcCardsList();
		}, 50);
	});
}

function initList( board_id, list_id ){

	var template = _.template( $( "script.list_card" ).html() );

	$.getJSON( "/list/cards/"+board_id+"/"+list_id, function( data ) {
		$( ".board-canvas .lists .list[listid='"+list_id+"'] .minicards" ).append( template( data ) );
	});
}

/* functionalities */

function funcCardsList(){

	$('.js-minicards').sortable({
		forcePlaceholderSize: true,
		placeholder: 'minicard-wrapper js-minicard-placeholder',
		items: '> .js-minicard',
		handle: '.minicard .minicard-handle',
		opacity: 0.5,
		zIndex: 9999,
		connectWith: ".js-minicards",
		tolerance: 'pointer',
		helper: function(event, element){
			return $(element).clone().appendTo('body').get(0);
		},
		stop: function( event, ui ) {
			resortCards( $( ui.item[0] ).parents( ".js-minicards" ) );
		},
		remove: function( event, ui ) {
			updateCard( $( ui.item[0] ) )
			resortCards( $(event.target) );
		}
	});

	$(".js-minicards").on("click", ".js-minicard", function(e){
		
		var self = this;

		if( $(this).hasClass('is-selected') ){
			closeCardDetails();
		} else {
			
			var cardid = $(this).attr('cardid');

			$.get( "/card/load?cardid="+cardid, function( data ) {
				
				closeCardDetails();
				
				$(self).addClass('is-selected');
				$(self).parents('.list').after( data );
				setTimeout(function(){
					updateCardDetails();

					$.get( "/comments/"+cardid, function( data ) {
						var template = _.template( $( "script.card_comments" ).html() );
						$( ".card-details .activities" ).append( template(data) );
					});

					$.get( "/attachments/"+cardid, function( data ) {
						var template = _.template( $( "script.card_attachments" ).html() );
						$( ".card-details .attachments-galery" ).append( template(data) );
					});

				}, 25);
			});
		}
		
	});
}

function funcListsList(){
	$('.js-lists').sortable({
		forcePlaceholderSize: true,
		placeholder: 'list js-list-placeholder',
		items: '> .list[listid]',
		handle: '.js-list-header h2',
		opacity: 0.5,
		tolerance: 'pointer',
		helper: 'clone',
		stop: function( event, ui ) {
			var newSortedLists = $( ".js-lists" ).sortable( "toArray", { attribute: "listid" });
			if(!sortedLists.compare(newSortedLists) ){
				sortedLists = newSortedLists;
				console.log(sortedLists);
				$.post( "/list/sort", {
					'board' : $('.board-canvas').attr('boardid'),
					'sorted': sortedLists
				});
			}
		}
	});

	sortedLists = $( ".js-lists" ).sortable( "toArray", { attribute: "listid" });

	initListSettings();
	initNewCardForm();
}

function initHomeStars(){
	$(".js-star-board").click(function(e){
		var self = this;
		var board_id = $(this).parents('.board-list-item').attr('boardid');

		if( $(this).hasClass('fa-star-o') ){

			$.post( "/user/fave-board?ajax=1", { board: board_id }).done(function(data){
				if(data && data._id){
					$("#header-quick-access > ul")
						.append("<li class='starredBoard' boardid='"+data._id+"'><a href='"+data.url+"'>"+data.title+"</a></li>");
					
					$(self).removeClass('fa-star-o').addClass('fa-star');
					$(self).parents('li').addClass('starred');
				}
			});

		} else {

			$.post( "/user/unfave-board?ajax=1", { board: board_id }).done(function(data){
				if(data && data._id){
					$("#header-quick-access > ul li[boardid='"+board_id+"']").remove();
					
					$(self).removeClass('fa-star').addClass('fa-star-o');
					$(self).parents('li.starred').removeClass('starred');
				}
			});

		}

		e.preventDefault();
	});
}

function initStars(){
	$(".js-star-board").click(function(e){
		var self = this;
		var board_id = $(".board-canvas").attr('boardid');

		if( $(this).find('i').hasClass('fa-star-o') ){

			$.post( "/user/fave-board?ajax=1", { board: board_id }).done(function(data){
				if(data && data._id){
					$("#header-quick-access > ul")
						.append("<li class='starredBoard' boardid='"+data._id+"'><a href='"+data.url+"'>"+data.title+"</a></li>");
					
					$(self).find('i').removeClass('fa-star-o').addClass('fa-star');
					$(self).addClass('starred');
				}
			});

		} else {

			$.post( "/user/unfave-board?ajax=1", { board: board_id }).done(function(data){
				if(data && data._id){
					$("#header-quick-access > ul li[boardid='"+board_id+"']").remove();
					
					$(self).find('i').removeClass('fa-star').addClass('fa-star-o');
					$(self).removeClass('starred');
				}
			});

		}

		e.preventDefault();
	});
}