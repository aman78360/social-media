const mongoose = require("mongoose");

module.exports = async () => {
	const uri =
		"mongodb+srv://guptaaman:1hpqaPoIRQQAhgNL@cluster0.pufaurk.mongodb.net/?retryWrites=true&w=majority";
	try {
		const connect = await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		console.log(`MongoDB Connected: ${connect.connection.host}`);
	} catch (error) {
		console.log(error);
	}
};
