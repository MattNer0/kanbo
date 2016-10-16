var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User');

User.add({
	username: { type: String, initial: true, label: "Display Name", required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	avatar: {
		type: Types.LocalFile,
		dest: '/var/develop/projects/kanbo/public/files/avatar',
		prefix: '/files/avatar/',
		label: 'Avatar',
		allowedTypes: [
			'image/jpeg', 'image/bmp', 'image/png', 'image/gif', 'image/svg+xml'
		],
		filename: function(item, file){
			return item.id + '.' + file.extension;
		},
		format: function(item, file){
			return '<img src="/files/avatar/'+file.filename+'" style="max-width: 24px;">'
		}
	},

	favorites: { type: Types.Relationship, ref: 'Board', many: true },
	
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, avatar, isAdmin';
User.register();
