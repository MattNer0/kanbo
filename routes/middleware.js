var _ = require('underscore');

/**
	Initialises the standard view locals
*/
exports.initLocals = function (req, res, next) {
	res.locals.user = req.user;

	if(req.user){
		
		var keystone = require('keystone');
		keystone.list('User').model.findOne({
			_id: req.user._id,
		}).populate('favorites').exec(function(err, current_user) {
			if(err) {
				console.log(err);
				return next();
			}

			res.locals.favedBoards = current_user.favorites;
			next();
		});

	} else {
		next();
	}
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.any(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/login');
		//res.redirect('/keystone/signin');
	} else {
		next();
	}
};
