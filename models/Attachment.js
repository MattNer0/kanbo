var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Attachment Model
 * ==========
 */
var Attachment = new keystone.List('Attachment');

Attachment.add({

	card: { type: Types.Relationship, ref: 'Card' },
	creator: { type: Types.Relationship, ref: 'User' },

	name: { type: String, initial: false },
	createdAt: { type: Date, default: Date.now },

	attached_file: {
		type: Types.LocalFile,
		dest: '/var/develop/projects/kanbo/public/files/attachments',
		prefix: '/files/attachments/',
		label: 'Attached File',
		filename: function(item, file){
			return item.id + '.' + file.extension;
		}
	},
	
});

/**
 * Registration
 */
Attachment.defaultColumns = 'name, card, creator, createdAt';
Attachment.register();
