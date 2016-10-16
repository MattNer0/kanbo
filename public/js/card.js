function initCardDetails(){

	$(".card-details .js-open-card-details-menu").webuiPopover({
		url:".card_settings .pop-over",
		animation: 'pop',
		closeable: true,
		onHide: function(){
			$(".pop-over .js-pop-over-card-settings").show();
			$(".pop-over .js-pop-over-card-rename").hide();
			$(".pop-over .js-pop-over-card-attachment").hide();
		}
	});

	/* rename card */

	$(".pop-over .js-pop-over-card-settings a.js-rename-card").click(function(e){
		$(".pop-over .js-pop-over-card-settings").fadeOut( 200, function(){
			$(".pop-over .js-pop-over-card-rename").fadeIn( 200, function(){
				$(".pop-over .js-pop-over-card-rename input.card-name-input").focus().select();
			});
		});
		e.preventDefault();
	});

	$( ".pop-over .js-pop-over-card-rename form" ).on( "submit", function(e) {
		e.preventDefault();

		var cardid = $(this).find('input[name=card]').val();
		
		$.post( "/card/rename?ajax=1", $(this).serialize() );

		var new_card_name = $(this).find('.card-name-input').val();
		$(".minicard-wrapper[cardid='"+cardid+"'] .minicard-title").html(new_card_name);
		$(".card-details h2.card-details-title").html(new_card_name);
		
		$(".card-details .js-open-card-details-menu").webuiPopover('hide');
	});

	$(".pop-over .js-pop-over-card-rename .js-back-view").click(function(e){
		$(".pop-over .js-pop-over-card-rename").fadeOut( 200, function(){
			$(".pop-over .js-pop-over-card-settings").fadeIn();
		});
		e.preventDefault();
	});

	/* add attachments */

	$(".pop-over .js-pop-over-card-settings a.js-attachment-card").click(function(e){
		$(".pop-over .js-pop-over-card-settings").fadeOut( 200, function(){
			$(".pop-over .js-pop-over-card-attachment").fadeIn(200);
		});
		e.preventDefault();
	});

	$(".pop-over .js-pop-over-card-attachment .js-back-view").click(function(e){
		$(".pop-over .js-pop-over-card-attachment").fadeOut( 200, function(){
			$(".pop-over .js-pop-over-card-settings").fadeIn();
		});
		e.preventDefault();
	});

	$(".pop-over .js-pop-over-card-attachment form").submit(function(e){

		if( $(this).find("input[type='file']").val() ){
			var jForm =  new FormData(this);

			$.ajax({
				url: "/attachment/new?ajax=1",
				type: "POST",
				data: jForm,
				mimeType: "multipart/form-data",
				contentType: false,
				cache: false,
				processData: false,
				dataType: "json",
				success: function (data, textStatus, jqXHR) {
					var template = _.template( $( "script.card_attachments" ).html() );
					$( ".card-details .attachments-galery" ).append( template(data) );

					var num_attachments = $(".card-details .attachments-galery .attachment-item").length;
					var cardid = $('.card-details').attr('cardid');
					
					$(".minicard-wrapper[cardid='"+ cardid +"']").find(".js-badge-attachments").show();
					$(".minicard-wrapper[cardid='"+ cardid +"']").find(".js-badge-attachments .badge-text").html(num_attachments);
				}
			});
		}

		e.preventDefault();
	})

	/* archive card */

	$(".pop-over .js-pop-over-card-settings a.js-archive-card").click(function(e){
		return confirm("Are you sure you want to archive this card?");
	});

	/* edit description */

	$(".card-details .card-details-description .js-open-inlined-form").click(function(e){
		$(".card-details .card-details-description .card-description-container").fadeOut(200, function(){
			$(".card-details .card-details-description .card-description-textarea").fadeIn();
		});
		$('.card-details .js-open-inlined-form').hide(); $('.card-details .js-close-inlined-form').css('display', 'inline-block');
		e.preventDefault();
	});

	$(".card-details .card-details-description .js-close-inlined-form").click(function(e){
		$(".card-details .card-details-description .card-description-textarea").fadeOut(200, function(){
			$(".card-details .card-details-description .card-description-container").fadeIn();
		});
		$('.card-details .js-close-inlined-form').hide(); $('.card-details .js-open-inlined-form').css('display', 'inline-block');
		e.preventDefault();
	});

	$(".card-details .card-details-description button").click(function(e){
		var converter 	= new showdown.Converter();
		var to_convert_markdown = $(".card-details .card-description-textarea textarea").val();
		var converted_html = converter.makeHtml( to_convert_markdown );
		$(".card-details .card-description-container").html( converted_html );

		var cardid = $(this).parents('.card-details').attr('cardid');
		
		$.post( "/card/description/"+cardid, { description: to_convert_markdown } );
		
		$(".card-details .card-details-description .js-close-inlined-form").click();
		if(converted_html){
			$(".minicard-wrapper[cardid='"+ cardid +"'] .js-badge-content").show();
		} else {
			$(".minicard-wrapper[cardid='"+ cardid +"'] .js-badge-content").hide();
		}
		e.preventDefault();
	});

	/* card settings */

	$(".card-details .js-add-labels").webuiPopover({
		url:".card_labels_settings .pop-over",
		animation: 'pop',
		closeable: true,
	});

	$('.card_labels_settings .js-add-label').webuiPopover({
		url:'.new_label .pop-over',
		animation: 'pop',
		closeable: true,
	});

	$('.card_labels_settings .js-select-label').click(function(e){

		var labelid = $(this).attr('labelid');
		var cardid = $(this).parents('.pop-over').attr('cardid');

		if( $(this).hasClass('active') ){
			$(this).removeClass('active');
			$(this).find('.fa-check').remove();

			$.post( "/card/label/remove?ajax=1", { cardid: cardid, labelid: labelid } ).done(function( data ) {
				$(".card-details-item-labels .card-label-item[labelid='"+ labelid +"']").remove();
				$(".minicard-wrapper[cardid='"+cardid+"'] .minicard-label[labelid='"+labelid+"']").remove();
			});

		} else {
			$(this).addClass('active');
			$(this).append('<i class="card-label-selectable-icon fa fa-check"></i>');

			$.post( "/card/label/add?ajax=1", { cardid: cardid, labelid: labelid } ).done(function( data ) {
				$(".card-details-item-labels > h3").after( data );

				var label_color = $(data).attr('color');
				$(".minicard-wrapper[cardid='"+cardid+"'] .minicard-labels")
					.append("<div class='minicard-label card-label-"+label_color+"' labelid='"+labelid+"'></div>");
			});
		}
	});

	/* card new comment */

	$(".js-add-comment").click(function(e){

		$.post( "/comment/new?ajax=1", $(this).parents('.js-new-comment-form').serialize() ).done(function( data ) {

			var template = _.template( $( "script.card_comments" ).html() );
			$( ".card-details .activities" ).append( template(data) );
		});

		e.preventDefault();
	});

	/* attachments stuff */

	$(".card-details .attachments-galery").on("click", ".attachment-item .js-confirm-delete", function(e){
		var self = this;
		if (confirm('Are you sure you want to delete this attachment?')) {

			var attachId = $(this).parents('.attachment-item').attr('attachmentid');
			$.post( "/attachment/remove?ajax=1", { 'attachment' : attachId } ).done(function( data ) {
				
				var was_cover = $(self).parents('.attachment-item').attr('attachment-cover');

				$(self).parents('.attachment-item').remove();

				var num_attachments = $(".card-details .attachments-galery .attachment-item").length;
				var cardid = $('.card-details').attr('cardid');
				
				if(num_attachments == 0){
					$(".minicard-wrapper[cardid='"+ cardid +"'] .js-badge-attachments").hide();
				} else {
					console.log(num_attachments);
					$(".minicard-wrapper[cardid='"+ cardid +"'] .js-badge-attachments .badge-text").html(num_attachments);
				}

				if(was_cover == 1){
					$(".minicard-wrapper[cardid='"+ cardid +"'] .minicard-cover").remove();
				}
			});
		}
		e.preventDefault();
	});

	$(".card-details .attachments-galery").on("click", ".attachment-item .js-add-cover", function(e){
		var self = this;
		
		var attachId = $(this).parents('.attachment-item').attr('attachmentid');
		var cardid = $('.card-details').attr('cardid');
		var attachment_src = $(this).parents('.attachment-item').find('.attachment-thumbnail-img').attr('src');
		
		$.post( "/attachment/cover?ajax=1", { 'attachment' : attachId } ).done(function( data ) {
			if(data){
				$(".minicard-wrapper[cardid='"+ cardid +"'] .minicard-cover").remove();
				$(".minicard-wrapper[cardid='"+ cardid +"'] .minicard-handle").after('<div class="minicard-cover"><img src="'+attachment_src+'"></div>');
				$(".card-details .attachments-galery .js-add-cover").show();
				$(".card-details .attachments-galery .js-remove-cover").hide();
				$(self).parents('.attachment-item').attr('attachment-cover', 1);
				$(self).hide();
				$(self).prev().show();
			}
		});

		e.preventDefault();
	});

	$(".card-details .attachments-galery").on("click", ".attachment-item .js-remove-cover", function(e){
		var self = this;
		
		var cardid = $(this).parents('.card-details').attr('cardid');
		
		$.post( "/card/remove-cover?ajax=1", { 'card' : cardid } ).done(function( data ) {
			if(data){
				$(".minicard-wrapper[cardid='"+ cardid +"'] .minicard-cover").remove();
				$(self).hide();
				$(self).next().show();
			}
		});

		e.preventDefault();
	});
}