var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Card Model
 * ==========
 */
var Card = new keystone.List('Card');

Card.add({
	title: { type: String, initial: true, required: true, index: true },
	content: { type: Types.Textarea, initial: false },
	
	board: { type: Types.Relationship, ref: 'Board', index: true },
	boardlist: { type: Types.Relationship, ref: 'Boardlist', index: true },

	creator: { type: Types.Relationship, ref: 'User' },

	labels: { type: Types.Relationship, ref: 'Label', many: true },
	members: { type: Types.Relationship, ref: 'User', many: true },
	
	order: { type: Number, default: 1 },

	cardType: { type: Types.Select, options: 'card, note, checkbox, image', default: 'card' },
	cover: {
		type: Types.LocalFile,
		dest: '/var/develop/projects/kanbo/public/files/attachments',
		prefix: '/files/attachments/',
		label: 'Cover Image',
		allowedTypes: [
			'image/jpeg', 'image/bmp', 'image/png', 'image/gif', 'image/svg+xml'
		],
		filename: function(item, file){
			return item.id + '.' + file.extension;
		}
	},

	status: { type: Boolean, label: 'Checkbox Status', default: false },
	
	comments: { type: Types.Relationship, ref: 'Comment', many: true },
	attachments: { type: Types.Relationship, ref: 'Attachment', many: true },

	createdAt: { type: Date, default: Date.now },
	
}, 'Permissions', {
	archived: { type: Boolean, default: false },
});

/**
 * Registration
 */
Card.defaultColumns = 'title, board, list, order, archived';
Card.register();