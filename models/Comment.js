var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Comment Model
 * ==========
 */
var Comment = new keystone.List('Comment');

Comment.add({
	content: { type: Types.Textarea, initial: true, required: true },
	creator: { type: Types.Relationship, ref: 'User' },
	createdAt: { type: Date, default: Date.now },

	card: { type: Types.Relationship, ref: 'Card' },
	
}, 'Permissions', {
	hidden: { type: Boolean, default: false },
});

/*
Comment.schema.set('toJSON', { getters: true });
Comment.schema.path('createdAt').get(function (v) {
	var moment = require('moment');
	return moment(v).format("Do MMMM YYYY, hh:mm:ss");
});
*/

/**
 * Registration
 */
Comment.defaultColumns = 'content, creator, createdAt, hidden';
Comment.register();
