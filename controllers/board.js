var keystone = require('keystone');

module.exports = {
	
	list(req, res, next) {
		
		keystone.list('Board').model.find({
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id },
				{ members : req.user.id },
				{ private : false }
			]
		}).exec(function(err, boards) {

			res.json({
				boardslist: boards,
				faved: req.user.favorites
			});

		});
	},

	view(req, res, next) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		if(!req.params.board_id) return res.redirect('/');

		keystone.list('Board').model.findOne({
			_id: req.params.board_id,
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id },
				{ members : req.user.id },
				{ private : false }
			]
		}).populate('creator labels members').exec(function(err, board) {

			if(err || !board) {
				console.log('err:', err, board);
				return res.redirect('/');
			}

			locals.board = board;

			if(req.user.favorites.indexOf(board._id) >= 0){
				locals._isStarred = true;
			}

			if( board.creator.id == req.user.id ) {
				locals._isCreator = true;
				locals._isMember = true;
			
			} else if( board.members.indexOf(req.user.id) >= 0 ) {
				locals._isMember = true;
			}

			view.render('board');
		});
	},

	new(req, res, next) {
		var view = new keystone.View(req, res);

		var Board = keystone.list('Board');

		var newBoard = new Board.model({
			title: req.body.title,
			creator: req.user.id,
			private: req.body.private ? true : false
		});
 
		newBoard.save(function(err) {
			if(err) console.log(err);
			res.redirect('/');
		});
	},

	update(req, res, next) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		if(!req.body.board || !req.body.title) return res.redirect('back');

		keystone.list('Board').model.update({
			_id: req.body.board,
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		
		}, {
			title: req.body.title,
			description: req.body.description,

		}, function (err, raw) {
			if (err) console.log(err);
			return res.redirect('back');
		});
	},

	color(req, res, next) {

		if(!req.body.board || !req.body.color) return res.redirect('back');

		keystone.list('Board').model.update({
			_id: req.body.board,
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		
		}, {
			color: req.body.color,

		}, function (err, raw) {
			if (err) console.log(err);
			return res.redirect('back');
		});
	},

	background(req, res, next) {

		if(!req.body.board || !req.files.background) return res.redirect('back');

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		}).exec(function(err, current_board) {

			current_board._.cover.uploadFile( req.files.background, true, function(err, fileData){

				current_board.cover 		= fileData;
				current_board.coverAlign 	= req.body.align ? req.body.align : 'center';
				current_board.coverSize 	= req.body.size ? req.body.size : 'cover';

				current_board.save(function(err, board){
					res.redirect('back');
				});
			});

		});
	},

	clear_background(req, res, next) {

		if(!req.body.board) return res.redirect('back');

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		}).exec(function(err, current_board) {

			if( current_board.cover ){
				
				var fs = require('fs');
				fs.unlink( current_board.cover.path + '/' + current_board.cover.filename , function(err, callback){
					if(err) console.log(err);
				});

				current_board.cover 		= null;

				current_board.save(function(err, board){
					return res.redirect('back');
				});

			} else {
				return res.redirect('back');
			}
		});
	},
};