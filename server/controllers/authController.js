const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("./utils/responseWrapper");
const signupController = async (request, response) => {
	try {
		const { email, password } = request.body;
		console.log(email);

		if (!email || !password) {
			// return response.status(400).send("All fields are required");
			return response.send(error(400, "All fields are required"));
		}

		const oldUser = await User.findOne({ email });

		if (oldUser) {
			// response.status(409).send("User is already registered");
			return response.send(error(409, "User is already registered"));
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({
			email,
			password: hashedPassword,
		});

		// return response.status(201).json({ user });
		return response.send(success(201, { user }));
	} catch (error) {
		console.log(error);
	}
};
const loginController = async (request, response) => {
	try {
		const { email, password } = request.body;
		console.log(email);

		if (!email || !password) {
			// return response.status(400).send("All fields are required");
			return response.send(error(409, "All fields are required"));
		}

		const user = await User.findOne({ email });
		if (!user) {
			// return response.status(404).send("User is not found");
			return response.send(error(404, "User is not found"));
		}

		const matched = await bcrypt.compare(password, user.password);

		if (!matched) {
			// return response.status(403).send("Incorrect Password");
			return response.send(error(403, "Incorrect Password"));
		}

		const accessToken = generateAccessToken({
			_id: user._id,
		});
		const refreshToken = generateRefreshToken({
			_id: user._id,
		});

		response.cookie("jwt", refreshToken, {
			httpOnly: true,
			secure: true,
		});

		// return response.json({ accessToken, refreshToken });
		return response.send(success(200, { accessToken }));
	} catch (error) {
		console.log(error);
	}
};
//This API will check the refresh token validity and generate a new access token
const refreshAccessTokenController = async (request, response) => {
	const cookies = request.cookies;

	if (!cookies.jwt) {
		// return response.status(401).send("Refresh token in cookie is required");
		return response.send(error(401, "Refresh token in cookie is required"));
	}

	const refreshToken = cookies.jwt;

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_PRIVATE_KEY
		);

		const _id = decoded._id;
		const accessToken = generateAccessToken({ _id });
		// return response.status(201).json({ accessToken });
		return response.send(success(201, { accessToken }));
	} catch (error) {
		console.log(error);
		// return response.status(401).send("Invalid refresh token");
		return response.send(error(401, "Invalid refresh token"));
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
