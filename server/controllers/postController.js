const getAllPostController = async (request, response) => {
	console.log(request._id);
	return response.send("these are all the posts");
};

module.exports = {
	getAllPostController,
};
