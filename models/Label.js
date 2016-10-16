var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Label Model
 * ==========
 */
var Label = new keystone.List('Label');

Label.add({
	title: { type: String, initial: true, required: true, index: true },
	color: { type: String, initial: false, default: "#2980b9" },

	board: { type: Types.Relationship, ref: 'Board', index: true },
	
	order: { type: Number, default: 1 },
});

/**
 * Registration
 */
Label.defaultColumns = 'title, board, order';
Label.register();