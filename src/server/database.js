
const mongoose = require('mongoose');

module.exports = callback => {
	const database = mongoose.connection;

	database.on('error', console.error);
	database.once('open', callback);
	
	mongoose.connect('mongodb://localhost:27017/plotchain', {
		useNewUrlParser: true
	});
};