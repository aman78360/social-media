const { success } = require("../utils/responseWrapper");

const getAllPostController = async (request, response) => {
	console.log(request._id);
	return response.send(success(200, "These are all the posts"));
};

module.exports = {
	getAllPostController,
};
