var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Board Model
 * ==========
 */
var Board = new keystone.List('Board');

Board.add({
	title: { type: String, initial: true, required: true, index: true },
	description: { type: String, initial: false },
	color: { type: String, initial: false, default: "belize" },
	creator: { type: Types.Relationship, ref: 'User' },

	members: { type: Types.Relationship, ref: 'User', many: true },
	admins: { type: Types.Relationship, ref: 'User', many: true },

	labels: { type: Types.Relationship, ref: 'Label', many: true },

	coverAlign: { type: String, initial: false },
	coverSize: { type: String, initial: false },
	cover: {
		type: Types.LocalFile,
		dest: '/var/develop/projects/kanbo/public/files/boards',
		prefix: '/files/boards/',
		label: 'Cover Image',
		allowedTypes: [
			'image/jpeg', 'image/bmp', 'image/png', 'image/gif', 'image/svg+xml'
		],
		filename: function(item, file){
			return item.id + '.' + file.extension;
		}
	},
	
	createdAt: { type: Date, default: Date.now },
	
}, 'Permissions', {
	private: { type: Boolean, default: true },
	archived: { type: Boolean, default: false },
});

/**
 * Registration
 */
Board.defaultColumns = 'title, private';
Board.register();
