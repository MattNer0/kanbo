var keystone = require('keystone');

module.exports = {
	login(req, res, next) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		if (req.user) res.redirect('/');

		locals.csrfTokenKey = keystone.security.csrf.TOKEN_KEY;
		locals.csrfTokenValue = keystone.security.csrf.getToken(req, res);

		view.render('login');
	},

	signin(req, res, next) {
		var view = new keystone.View(req, res);

		if (req.user) res.redirect('/');

		if (keystone.security.csrf.validate(req)) {
			keystone.session.signin({
				password: req.body.password,
				email: req.body.username,

			}, req, res, function success() {
				res.redirect('/');

			}, function error(err){
				console.log(err);
				res.redirect('back');

			});
		} else {
			res.redirect('back');
		}
	},

	avatar(req, res, next) {
		var view = new keystone.View(req, res);

		req.user._.avatar.uploadFile( req.files.avatar, true, function(err, fileData){
			req.user.avatar = fileData;
			req.user.save(function(err, user){
				res.redirect('back');	
			});
		});
	},

	username(req, res, next) {
		var view = new keystone.View(req, res);

		if(!req.body.username) return res.redirect('back');

		req.user.username = req.body.username;
		req.user.save(function(err, user){
			res.redirect('back');	
		});
	},

	fave_board(req, res, next) {

		if(!req.body.board) return res.json({});
		if( req.user.favorites.indexOf(req.body.board) >= 0 ) return res.json({});

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ members : req.user.id },
				{ private : false }
			]
		}).exec(function(err, current_board) {
			if(err || !current_board) return res.json({});

			req.user.favorites.push( req.body.board );
			req.user.save(function(err, user){
				if(err) return res.json({});

				return res.json({
					_id: current_board._id,
					title: current_board.title,
					url: "/board/"+current_board._id
				});
			});

		});
	},

	unfave_board(req, res, next) {

		if(!req.body.board) return res.json({});

		var boardIndex = req.user.favorites.indexOf(req.body.board);
		if( boardIndex < 0 ) return res.json({});

		req.user.favorites.splice( boardIndex, 1 );
		req.user.save(function(err, user){
			if(err) return res.json({});

			return res.json({
				_id: req.body.board,
			});
		});
	},
};