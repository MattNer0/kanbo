var keystone = require('keystone');

module.exports = {

	view(req, res, next) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		keystone.list('Card').model.findOne({
			_id: req.query.cardid,
		}).populate('members labels').exec(function(err, current_card) {
			if(err) next(err);

			current_card.labels_ids = [];
			for(var i=0; i < current_card.labels.length; i++){
				current_card.labels_ids.push( current_card.labels[i].id );
			}

			keystone.list('Board').model.findOne({
			_id: current_card.board,
				$or: [
					{ creator : req.user.id },
					{ admins  : req.user.id },
				]
			}).populate('creator members labels').exec(function(err, current_board) {
				if(err) next(err);

				locals.board = current_board;
				locals.card = current_card;

				view.render('card');

			});

		});
	},

	new(req, res, next) {
		var view = new keystone.View(req, res);

		if(!req.body.title || !req.body.board){
			if(req.query.ajax)
				return res.send('err');
			else
				return res.redirect('back');
		}

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id },
			]
		}).exec(function(err, current_board) {

			if(err) console.log('board', err, current_board);
			if(err || !current_board){
				if(req.query.ajax)
					return res.send('err');
				else
					return res.redirect('back');
			}

			keystone.list('Boardlist').model.findOne({
				_id: req.body.boardlist,
				board: current_board.id,
				
			}).exec(function(err, current_boardlist) {

				if(err) console.log('boardlist', err, current_boardlist);
				if(err || !current_boardlist){
					if(req.query.ajax)
						return res.send('err');
					else
						return res.redirect('back');
				}

				var Card = keystone.list('Card');

				Card.model.findOne({
					board: current_board.id,
					boardlist: current_boardlist.id,
					
				}).sort('-order').exec(function(err, last_card) {
				
					var newCard = new Card.model({
						title: req.body.title,
						board: current_board.id,
						boardlist: current_boardlist.id,
						creator: req.user.id,
						order: last_card && last_card.order ? last_card.order+1 : 1,
					});
			 
					newCard.save(function(err, current_card) {
						if(err) console.log(err);

						current_boardlist.cards.push( current_card.id );
						current_boardlist.save(function(err){
							if(err) console.log(err);

							if(req.query.ajax)
								return res.json(current_card);
							else
								return res.redirect('back');	
						});
					});
				});
			});
		});
	},

	sort(req, res, next) {

		function reorder( board_id, list_id, cards ){
			//console.log("reorder", list_id, cards);
			var cards_list = []

			if(cards){
				for(var i=0; i<cards.length; i++){
					if( cards_list.indexOf( cards[i] ) < 0 ){
						cards_list.push( cards[i] );
					}
				}
			}

			for(var i=0; i<cards_list.length; i++){

				keystone.list('Card').model.update({
					_id: cards_list[i],
					board: board_id
				}, { order: i+1 }, function (err, raw) {
					if (err) console.log(err);
				});

			}
			
			keystone.list('Boardlist').model.update({ _id: list_id, board: board_id }, { cards: cards_list }, function (err, raw) {
				if (err) console.log(err);
				//console.log('raw', raw);
			});
		}

		if(!req.body.board || !req.body.list){
			return res.send('no array');
		}

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		}).exec(function(err, current_board) {
			if(err || !current_board) return res.send('board error');

			reorder( current_board.id, req.body.list, req.body.sorted );

			res.send('ok');
		});
	},

	move(req, res, next) {

		if(!req.body.card || !req.body.board || !req.body.list){
			return res.send('no array');
		}

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id },
			]
		}).exec(function(err, current_board) {
			if(err || !current_board) return res.send('board error');

			keystone.list('Boardlist').model.findOne({
				_id: req.body.list,
				board: current_board.id
			}).exec(function(err, current_list) {
				if(err || !current_board) return res.send('list error');

				keystone.list('Card').model.update({
					_id: req.body.card,
					board: current_board.id
				}, { boardlist: current_list.id }, function (err, raw) {
					if (err) console.log(err);
					console.log('raw', raw);
				});				
			});
		});
	},

	rename(req, res, next) {

		if(!req.body.card || !req.body.board || !req.body.title){
			return res.redirect('back');
		}

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		}).exec(function(err, current_board) {
			if(err || !current_board) return res.redirect('back');

			keystone.list('Card').model.findOne({
				_id: req.body.card,
				board: current_board.id
			}).exec(function(err, current_card) {
				if(err || !current_card) return res.redirect('back');

				keystone.list('Card').model.update({
					_id: req.body.card,
					board: current_board.id
				
				}, {
					title: req.body.title

				}, function (err, raw) {
					if (err) console.log(err);
					return res.redirect('back');
				});			
			});
		});
	},

	archive(req, res, next) {

		if(!req.params.card_id){
			return res.redirect('back');
		}

		keystone.list('Card').model.findOne({
			_id: req.params.card_id,
		}).exec(function(err, current_card) {
			if(err || !current_card) return res.redirect('back');

			keystone.list('Board').model.findOne({
				_id: current_card.board,
				$or: [
					{ creator : req.user.id },
					{ admins  : req.user.id }
				]
			}).exec(function(err, current_board) {
				if(err || !current_board) return res.redirect('back');

				current_card.set('archived', true);
				current_card.save(function(err){
					if(err) console.log(err);

					return res.redirect('back');
				})
			});
		});
	},

	description(req, res, next) {

		if(!req.params.card_id){
			console.log('no card id');
			res.send(500);
		}

		if(!req.body.description) req.body.description = "";

		keystone.list('Card').model.findOne({
			_id: req.params.card_id,
		}).exec(function(err, current_card) {
			if(err || !current_card){
				console.log(err);
				res.send(500);
			}

			keystone.list('Board').model.findOne({
				_id: current_card.board,
				$or: [
					{ creator : req.user.id },
					{ admins  : req.user.id }
				]
			}).exec(function(err, current_board) {
				if(err || !current_board){
					console.log(err);
					res.send(500);
				}

				current_card.set('content', req.body.description);
				current_card.save(function(err){
					if(err) console.log(err);

					return res.send('ok');
				})
			});
		});
	},

	add_label(req, res, next) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		if(!req.body.cardid || !req.body.labelid) return res.send("");

		keystone.list('Card').model.findOne({
			_id: req.body.cardid,
		}).exec(function(err, current_card) {
			if(err || !current_card){
				console.log(err);
				res.send(500);
			}

			keystone.list('Board').model.findOne({
				_id: current_card.board,
				$or: [
					{ creator : req.user.id },
					{ admins  : req.user.id }
				]
			}).exec(function(err, current_board) {
				if(err || !current_board){
					console.log(err);
					res.send(500);
				}

				keystone.list('Label').model.findOne({
					_id: req.body.labelid,
					board: current_board.id
				}).exec(function(err, current_label) {
					if(err || !current_label){
						console.log(err);
						res.send(500);
					}

					if( current_card.labels.indexOf(current_label.id) >= 0 ){
						return res.send("");

					} else {
						current_card.labels.push(current_label.id);
						current_card.save(function(err){
							if(err) console.log(err);

							locals.label = current_label;
							view.render('label');
						});
					}
				});

			});
		});
	},

	remove_label(req, res, next) {

		if(!req.body.cardid || !req.body.labelid) return res.send("");

		keystone.list('Card').model.findOne({
			_id: req.body.cardid,
		}).exec(function(err, current_card) {
			if(err || !current_card){
				console.log(err);
				res.send(500);
			}

			keystone.list('Board').model.findOne({
				_id: current_card.board,
				$or: [
					{ creator : req.user.id },
					{ admins  : req.user.id }
				]
			}).exec(function(err, current_board) {
				if(err || !current_board){
					console.log(err);
					res.send(500);
				}

				keystone.list('Label').model.findOne({
					_id: req.body.labelid,
					board: current_board.id
				}).exec(function(err, current_label) {
					if(err || !current_label){
						console.log(err);
						res.send(500);
					}

					var indexLabel = current_card.labels.indexOf(current_label.id);

					if( indexLabel >= 0 ){

						current_card.labels.splice( indexLabel, 1 );
						current_card.save(function(err){
							if(err) console.log(err);

							return res.send("");
						});

					} else {
						return res.send("");
					}
				});

			});
		});
	},

	remove_cover(req, res, next) {

		if(!req.body.card ) return res.send('error');

		keystone.list('Card').model.findOne({
			_id: req.body.card
		}).exec(function(err, current_card) {
			if(err || !current_card) return res.send('error');

			keystone.list('Board').model.findOne({
				_id: current_card.board,
				$or: [
					{ creator : req.user.id },
					{ admins  : req.user.id }
				]
			}).exec(function(err, current_board) {
				if(err || !current_board) return res.send('error');

				current_card.cover = null;
				current_card.save();

				return res.send('ok');

			});
		});
	},
};