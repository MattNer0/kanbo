// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');

keystone.init({
	'name': 		'Kanbo',
	'brand': 		'Kanbo',

	'sass': 		'public',
	'static': 		'public',
	'favicon': 		'public/favicon.ico',
	'views': 		'templates/views',
	'view engine': 	'jade',

	'auto update': 	false,
	'session': 		true,
	'auth': 		true,
	'user model': 	'User',

	'session store': 	'connect-redis',

	'host' : 		'127.0.0.1',
	'port' : 		3000,
});

keystone.import('models');

keystone.set('locals', {
	_: require('underscore'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	boards: [ 'Board', 'Boardlist', 'Label', 'Card' ],
	comments: 'Comment',
	attachments: 'Attachment',
	users: 'User',
});

keystone.start();
