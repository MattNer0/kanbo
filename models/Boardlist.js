var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Boardlist Model
 * ==========
 */
var Boardlist = new keystone.List('Boardlist');

Boardlist.add({
	title: { type: String, initial: true, required: true, index: true },
	
	board: { type: Types.Relationship, ref: 'Board', index: true },
	cards: { type: Types.Relationship, ref: 'Card', many: true },

	listSize: { type: Types.Select, options: 'default, wide', default: 'default' },
	
	order: { type: Number, default: 1 },
	createdAt: { type: Date, default: Date.now },
	
}, 'Permissions', {
	hidden: { type: Boolean, default: false },
	archived: { type: Boolean, default: false },
});

/**
 * Registration
 */
Boardlist.defaultColumns = 'title, board, order, archived';
Boardlist.register();
