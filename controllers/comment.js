var keystone = require('keystone');

module.exports = {
	new(req, res, next) {

		if(!req.body.board || !req.body.card || !req.body.comment) return res.json({ 'commentslist': [] });

		var Comment = keystone.list('Comment');

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id },
				{ members : req.user.id }
			]
		}).exec(function(err, current_board) {
			if(err || !current_board) return res.json({ 'commentslist': [] });

			keystone.list('Card').model.findOne({
				_id: req.body.card,
				board: current_board.id
			}).exec(function(err, current_card) {
				if(err || !current_card) return res.json({ 'commentslist': [] });

				var newComment = new Comment.model({
					content: req.body.comment,
					creator: req.user.id,
					card: current_card.id
				});

				newComment.save(function(err, current_comment) {

					current_card.comments.push( current_comment.id );
					current_card.save(function(err){
						if(err) console.log(err);
					});

					Comment.model.findOne({
						_id: current_comment.id
					}).populate('creator').exec(function(err, comment) {
						if(err) console.log(err);
						console.log(comment);
						return res.json({ 'commentslist': [comment] });
					});
				});

			});
		});

	},

	list(req, res, next) {

		if(!req.params.card_id ) return res.json({ 'commentslist': [] });

		keystone.list('Card').model.findOne({
			_id: req.params.card_id
		}).exec(function(err, current_card) {
			if(err || !current_card) return res.json({ 'commentslist': [] });

			keystone.list('Board').model.findOne({
				_id: current_card.board,
				$or: [
					{ creator : req.user.id },
					{ members : req.user.id },
					{ private : false }
				]
			}).exec(function(err, current_board) {
				if(err || !current_board) return res.json({ 'commentslist': [] });

				keystone.list('Comment').model.find({
					hidden: false,
					card: current_card.id
				}).populate('creator').sort('-createdAt').exec(function(err, comments) {

					if(err) return res.json({ 'commentslist': [] });

					return res.json({ 'commentslist': comments });

				});
			});
		});
	}
};