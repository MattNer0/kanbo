var keystone = require('keystone');

module.exports = {
	find(req, res, next) {
		
		if(!req.body.term) return res.send("");

		var regex = new RegExp(req.body.term, "i");

		keystone.list('User').model.find({
			username: regex,

		}).exec(function(err, users) {

			var users_array = users.map(function(obj){
				return {
					_id: obj._id,
					username: obj.username,
					avatar: obj.avatar,
				}
			});

			res.json({
				memberslist: users,
			});

		});
	},

	board(req, res, next) {
		
		if(!req.body.board || !req.body.member) return res.send("");

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			archived: false,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		}).exec(function(err, current_board) {

			if(err || !current_board) return res.send("");

			if( current_board.members.indexOf( req.body.member ) >= 0 || current_board.admins.indexOf( req.body.member ) >= 0 ){
				return res.send("");
			}

			if( current_board.creator == req.body.member ){
				return res.send("");
			}

			keystone.list('User').model.findOne({
				_id: req.body.member,
			}).exec(function(err, current_user) {

				if(err || !current_user) return res.send("");

				current_board.members.push( req.body.member );
				current_board.save(function(err){
					if(err) console.log(err);
				});

				res.json({
					username: current_user.username,
					avatar: current_user.avatar.filename
				});
			});			
		});
	},
};