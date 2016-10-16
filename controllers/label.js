var keystone = require('keystone');

module.exports = {
	new(req, res, next) {
		var view = new keystone.View(req, res);

		if(!req.body.title || !req.body.board || !req.body.color){
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

			var Tag = keystone.list('Label');

			var newTag = new Tag.model({
				title: req.body.title,
				board: current_board.id,
				color: req.body.color,
			});
	 
			newTag.save(function(err, newTag) {
				if(err) console.log(err);

				current_board.labels.push( newTag.id );
				current_board.save(function(err){
					res.redirect('back');	
				});
			});
		});
	},

	edit(req, res, next) {
		var view = new keystone.View(req, res);

		if(!req.body.title || !req.body.board || !req.body.label || !req.body.color){
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

			keystone.list('Label').model.update({
				_id: req.body.label,
				board: current_board.id
			
			}, {
				title: req.body.title,
				color: req.body.color,

			}, function (err, raw) {
				if (err) console.log(err);
				return res.redirect('back');
			});
		});
	},

};