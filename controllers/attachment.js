var keystone = require('keystone');

module.exports = {
	new(req, res, next) {
		
		if(!req.body.card || !req.body.board) return res.json({ 'attachmentsList' : [] });

		keystone.list('Board').model.findOne({
			_id: req.body.board,
			$or: [
				{ creator : req.user.id },
				{ admins  : req.user.id }
			]
		}).exec(function(err, current_board) {
			if(err || !current_board) return res.json({ 'attachmentsList' : [] });

			keystone.list('Card').model.findOne({
				_id: req.body.card,
				board: current_board.id
			}).exec(function(err, current_card) {
				if(err || !current_card) return res.json({ 'attachmentsList' : [] });

				var Attachment = keystone.list('Attachment');

				var newAttachment = new Attachment.model({
					card: current_card.id,
					creator: req.user.id,
					name: req.files.attachment.originalname
				});

				newAttachment.save(function(err, attachment_data){
					if(err) return res.json({ 'attachmentsList' : [] });

					current_card.attachments.push( attachment_data.id );
					current_card.save(function(err){
						if(err) console.log(err);
					});
					
					attachment_data._.attached_file.uploadFile( req.files.attachment, true, function(err, fileData){
						if(err) return res.json({ 'attachmentsList' : [] });

						attachment_data.attached_file = fileData;
						console.log('fileData', fileData);
						attachment_data.save(function(err, attachment_data){
							//attachment_data.attached_file
							res.json({ 'attachmentsList' : [attachment_data] });
						});
					});

				});

			});

		});

	},

	list(req, res, next) {

		if(!req.params.card_id ) return res.json({ 'attachmentsList': [] });

		keystone.list('Card').model.findOne({
			_id: req.params.card_id
		}).exec(function(err, current_card) {
			if(err || !current_card) return res.json({ 'attachmentsList': [] });

			keystone.list('Board').model.findOne({
				_id: current_card.board,
				$or: [
					{ creator : req.user.id },
					{ admins  : req.user.id },
					{ members : req.user.id },
					{ private : false }
				]
			}).exec(function(err, current_board) {
				if(err || !current_board) return res.json({ 'attachmentsList': [] });

				keystone.list('Attachment').model.find({
					card: current_card.id
				}).sort('-createdAt').exec(function(err, attachments) {

					if(err) return res.json({ 'attachmentsList': [] });

					var array_attachments = attachments.map(function(obj){
						return {
							'_id' : obj._id,
							'card' : obj.card,
							'name' : obj.name,
							'attached_file' : {
								'filename' : obj.attached_file.filename,
								'filetype' : obj.attached_file.filetype
							},
							'is_cover' : current_card.cover.filename == obj.attached_file.filename ? true : false,
							'createdAt' : obj.createdAt,
						}
					});

					return res.json({ 'attachmentsList': array_attachments });

				});
			});
		});
	},

	remove(req, res, next) {

		if(!req.body.attachment ) return res.send('error');

		keystone.list('Attachment').model.findOne({
			_id: req.body.attachment
		}).exec(function(err, current_attachment) {
			if(err || !current_attachment) return res.send('error');

			keystone.list('Card').model.findOne({
				_id: current_attachment.card
			}).exec(function(err, current_card) {
				if(err || !current_card) return res.send('error');

				keystone.list('Board').model.findOne({
					_id: current_card.board,
					$or: [
						{ creator : req.user.id },
						{ admins  : req.user.id },
					]
				}).exec(function(err, current_board) {
					if(err || !current_board) return res.send('error');

					var indexAttachment = current_card.attachments.indexOf( req.body.attachment );
					if( indexAttachment >= 0){
						current_card.attachments.splice(indexAttachment, 1);

						if(current_card.cover.filename == current_attachment.attached_file.filename ){
							current_card.cover = null;
						}

						current_card.save(function(err){
							if(err) console.log(err);
						})
					}

					console.log( current_attachment.attached_file );

					var fs = require('fs');
					fs.unlink( current_attachment.attached_file.path + '/' + current_attachment.attached_file.filename , function(err, callback){
						if(err) console.log(err);
					});

					current_attachment.remove();
					return res.send('ok');

				});
			});
		});
	},

	cover(req, res, next) {

		if(!req.body.attachment ) return res.send('error');

		keystone.list('Attachment').model.findOne({
			_id: req.body.attachment
		}).exec(function(err, current_attachment) {
			if(err || !current_attachment) return res.send('error');

			keystone.list('Card').model.findOne({
				_id: current_attachment.card
			}).exec(function(err, current_card) {
				if(err || !current_card) return res.send('error');

				keystone.list('Board').model.findOne({
					_id: current_card.board,
					$or: [
						{ creator : req.user.id },
						{ admins  : req.user.id },
					]
				}).exec(function(err, current_board) {
					if(err || !current_board) return res.send('error');

					current_card.cover = current_attachment.attached_file;
					current_card.save();

					return res.send('ok');

				});
			});
		});
	},
};