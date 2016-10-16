var keystone = require('keystone');

module.exports = {

	list(req, res, next){

		if(!req.params.board_id) return next("no board id");

		keystone.list('Board').model.findOne({
			_id: req.params.board_id,
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id },
				{ members : req.user.id },
				{ private : false }
			]
		}).exec(function(err, board) {

			if(err || !board) { return next("error board"); }

			keystone.list('Boardlist').model.find({
				archived: false,
				board: board.id
			}).sort('order').exec(function(err, lists) {

				if(err) { return next("error boardlist"); }

				res.json({
					listslist: lists
				});

			});
		});
	},

	cards(req, res, next){

		if(!req.params.board_id) return next("no board id");
		if(!req.params.list_id) return next("no list id");

		keystone.list('Board').model.findOne({
			_id: req.params.board_id,
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id },
				{ members : req.user.id },
				{ private : false }
			]
		}).exec(function(err, board) {

			if(err || !board) { return next("error board"); }

			keystone.list('Card').model.find({
				archived: false,
				board: board.id,
				boardlist: req.params.list_id
			}).populate('labels members').sort('order').exec(function(err, cards) {

				if(err) { return next("error cards"); }

				res.json({
					cardslist: cards
				});

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
				{ admins  : req.user.id }
			]
		}).exec(function(err, current_board) {

			if(err || !current_board){
				if(req.query.ajax)
					return res.send('err');
				else
					return res.redirect('back');
			}

			var Boardlist = keystone.list('Boardlist');

			Boardlist.model.findOne({
				board: current_board.id
			}).sort('-order').exec(function(err, last_list) {

				var newList = new Boardlist.model({
					title: req.body.title,
					board: current_board.id,
					order: last_list ? last_list.order+1 : 1,
				});
		 
				newList.save(function(err, list) {
					if(err) console.log(err);

					if(req.query.ajax){
						res.json({
							listslist: [list],
						});
					} else {
						res.redirect('back');
					}
				});
			});
		});
	},

	rename(req, res, next) {
		var view = new keystone.View(req, res);

		if(!req.body.title || !req.body.board || !req.body.list){
			if(req.query.ajax)
				return res.send('err');
			else
				return res.redirect('back');
		}

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		}).exec(function(err, current_board) {

			if(err || !current_board){
				if(req.query.ajax)
					return res.send('err');
				else
					return res.redirect('back');
			}

			keystone.list('Boardlist').model
				.update({ _id: req.body.list, board: current_board.id }, { title: req.body.title }, function (err, raw) {
					if (err) console.log(err);
					
					if(req.query.ajax)
						res.send('ok');
					else
						res.redirect('back');
			});
		});
	},

	options(req, res, next) {
		var view = new keystone.View(req, res);

		if(!req.body.board || !req.body.list){
			if(req.query.ajax)
				return res.send('err');
			else
				return res.redirect('back');
		}

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		}).exec(function(err, current_board) {

			if(err || !current_board){
				if(req.query.ajax)
					return res.send('err');
				else
					return res.redirect('back');
			}

			var boardlistOptions = {};

			if(req.body.size){
				switch(req.body.size){
					case "wide":
						boardlistOptions.listSize = "wide";
						break;
					default:
						boardlistOptions.listSize = "default";
						break;					
				}
			}

			keystone.list('Boardlist').model
				.update({ _id: req.body.list, board: current_board.id }, boardlistOptions, function (err, raw) {
					if (err) console.log(err);
					
					if(req.query.ajax)
						res.send('ok');
					else
						res.redirect('back');
			});
		});
	},

	sort(req, res, next) {

		function reorder( board_id, list_id, number ){
			console.log("reorder", list_id, number);
			keystone.list('Boardlist').model.update({ _id: list_id, board: board_id }, { order: number }, function (err, raw) {
				if (err) console.log(err);
				console.log('raw', raw);
			});
		}

		if(!req.body.sorted || !req.body.board){
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

			for(var i=0; i< req.body.sorted.length; i++){
				reorder( current_board.id, req.body.sorted[i], i+1);
			}

			res.send('ok');
		});
	},

	archive(req, res, next) {
		
		if(!req.body.list) return res.send('err');

		keystone.list('Boardlist').model.findOne({
			_id: req.body.list,
		}).exec(function(err, current_list) {
			if(err || !current_list) return res.send('list error');

			keystone.list('Board').model.findOne({
				_id: current_list.board,
				$or: [
					{ creator : req.user.id },
					{ admins  : req.user.id }
				]
			}).exec(function(err, current_board) {
				if(err || !current_board) return res.send('board error');

				current_list.archived = true;
				current_list.save(function(err, list) {
					if(err) return res.send('list archive');
					res.send('ok');
				});
			});
		});
	},

};