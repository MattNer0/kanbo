var keystone = require('keystone');

module.exports = {
	index(req, res, next) {
		var view = new keystone.View(req, res);
		var locals = res.locals;

		locals.current_page = 'home';
		view.render('index');
	},
};