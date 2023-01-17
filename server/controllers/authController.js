const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signupController = async (request, response) => {
	try {
		const { email, password } = request.body;
		console.log(email);

		if (!email || !password) {
			return response.status(400).send("All fields are required");
		}

		const oldUser = await User.findOne({ email });

		if (oldUser) {
			response.status(409).send("User is already registered");
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			email,
			password: hashedPassword,
		});

		return response.status(201).json({ user });
	} catch (error) {
		console.log(error);
	}
};
const loginController = async (request, response) => {
	try {
		const { email, password } = request.body;
		console.log(email);

		if (!email || !password) {
			return response.status(400).send("All fields are required");
		}

		const user = await User.findOne({ email });
		if (!user) {
			return response.status(404).send("user is not found");
		}

		const matched = await bcrypt.compare(password, user.password);

		if (!matched) {
			return response.status(403).send("Incorrect Password");
		}

		const accessToken = generateAccessToken({
			_id: user._id,
		});
		const refreshToken = generateRefreshToken({
			_id: user._id,
		});

		return response.json({ accessToken, refreshToken });
	} catch (error) {
		console.log(error);
	}
};
//This API will check the refresh token validity and generate a new access token
const refreshAccessTokenController = async (request, response) => {
	const { refreshToken } = request.body;
	if (!refreshToken) {
		return response.status(401).send("Refresh Token is required");
	}
	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_PRIVATE_KEY
		);

		const _id = decoded._id;
		const newAccessToken = generateAccessToken({ _id });
		return response.status(200).json({ newAccessToken });
	} catch (error) {
		console.log(error);
		return response.status(401).send("Invalid refresh token");
	}
};

//Internal Functions
const generateAccessToken = (data) => {
	try {
		const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
			expiresIn: "15m",
		});
		console.log(token);
		return token;
	} catch (error) {
		console.log(error);
	}
};
const generateRefreshToken = (data) => {
	try {
		const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
			expiresIn: "1y",
		});
		console.log(token);
		return token;
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	signupController,
	loginController,
	refreshAccessTokenController,
};
