var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Controllers
var controllers = importRoutes('../controllers');

// Setup Route Bindings
exports = module.exports = function (app) {
	
	// Simple with underscore templates

	app.get('/',		middleware.requireUser,		controllers.site.index );

	// Collect data for underscore
	app.get('/board/list',				middleware.requireUser,		controllers.board.list );
	app.get('/list/list/:board_id',		middleware.requireUser,		controllers.list.list );

	app.get('/list/cards/:board_id/:list_id',		middleware.requireUser,		controllers.list.cards );
	
	app.get('/login',								controllers.user.login );
	app.post('/login',								controllers.user.signin );

	app.post('/user/avatar', 		middleware.requireUser, 	controllers.user.avatar );
	app.post('/user/username', 		middleware.requireUser, 	controllers.user.username );
	app.post('/user/fave-board', 	middleware.requireUser, 	controllers.user.fave_board );
	app.post('/user/unfave-board', 	middleware.requireUser, 	controllers.user.unfave_board );
	

	app.post('/board/new', 			middleware.requireUser,		controllers.board.new );
	
	app.post('/list/new', 			middleware.requireUser,		controllers.list.new );
	app.post('/list/sort', 			middleware.requireUser,		controllers.list.sort );
	app.post('/list/rename', 		middleware.requireUser,		controllers.list.rename );
	app.post('/list/archive', 		middleware.requireUser,		controllers.list.archive );
	app.post('/list/options', 		middleware.requireUser,		controllers.list.options );
	
	app.get( '/card/load', 			middleware.requireUser,		controllers.card.view );
	app.post('/card/new', 			middleware.requireUser,		controllers.card.new );
	app.post('/card/sort', 			middleware.requireUser,		controllers.card.sort );
	app.post('/card/move', 			middleware.requireUser,		controllers.card.move );
	app.post('/card/rename',		middleware.requireUser,		controllers.card.rename );
	app.post('/card/label/add',		middleware.requireUser,		controllers.card.add_label );
	app.post('/card/label/remove',	middleware.requireUser,		controllers.card.remove_label );

	app.post('/card/remove-cover',		middleware.requireUser,		controllers.card.remove_cover );
	

	app.get('/card/archive/:card_id',		middleware.requireUser,		controllers.card.archive );
	app.post('/card/description/:card_id',	middleware.requireUser,		controllers.card.description );
	
	app.post('/member/find', 		middleware.requireUser,		controllers.member.find );
	app.post('/member/board', 		middleware.requireUser,		controllers.member.board );

	app.post('/attachment/new', 	middleware.requireUser,		controllers.attachment.new );
	app.post('/attachment/remove', 	middleware.requireUser,		controllers.attachment.remove );
	app.post('/attachment/cover', 	middleware.requireUser,		controllers.attachment.cover );

	app.get('/attachments/:card_id', middleware.requireUser,	controllers.attachment.list );
	

	app.post('/comment/new', 		middleware.requireUser,		controllers.comment.new );
	app.get('/comments/:card_id', 	middleware.requireUser,		controllers.comment.list );

	app.post('/label/new', 			middleware.requireUser,		controllers.label.new );
	app.post('/label/edit', 		middleware.requireUser,		controllers.label.edit );
	
	app.post('/board/update', 		middleware.requireUser,		controllers.board.update );
	app.post('/board/color', 		middleware.requireUser,		controllers.board.color );
	app.post('/board/background', 	middleware.requireUser,		controllers.board.background );
	app.post('/board/clear-background', middleware.requireUser,		controllers.board.clear_background );
	

	// View Board
	app.get('/board/:board_id', 	middleware.requireUser,		controllers.board.view );
};