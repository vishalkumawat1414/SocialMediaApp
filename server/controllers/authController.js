const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { error, success } = require("../utils/responseWrapper");

const signUpcontroller = async (req, res) => {
	try {
		const { email, password, name } = req.body;

		if (!email || !password || !name) {
			return res.send(error(400, "All fields are required"));
		}
		const oldUser = await User?.findOne({ email });
		if (oldUser) {
			return res.send(error(409, "User is already registered"));
		}

		const hashedPassword = await bcrypt.hash(password, 10); //10 round in encryption

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		return res.send(success(201, { user }));
	} catch (error) {
		console.log(error);
	}
};

const logincontroller = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.send(error(400, "All fields are required"));
		}
		const user = await User?.findOne({ email }).select("+password");
		
		if (!user) {
			return res.send(error(404, "User not registered"));
		}
   
		const matched = await bcrypt.compare(password, user?.password);

		if (!matched) {
			return res.send(error(403, "Incorrect password"));
		}

		const accessToken = generateAccessToken({
			_id: user._id,
		});
		const refreshToken = generateRefreshToken({
			_id: user._id,
		});

		res.cookie("refreshTokenByCookie", refreshToken, {
			//jwt is name , httpOnly mean cannot be access by js(frontend) further
			httpOnly: true,
			secure: true,
		});

		return res.send(success(200, { accessToken }));
	} catch (e) {
		return res.send(error(500,e.message))
	}
};


const logoutController = async (req, res) => {
	try {
		res.clearCookie("jwt", {
			httpOnly: true,
			secure: true,
		});
		return res.send(success(200, "user Logged Out"));
	} catch (e) {
		return res.send(error(500, e.message));
	}
};


//function to generate token

const generateAccessToken = (data) => {
	try {
		const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
			expiresIn: "15m",
		}); 
		console.log(token);
		return token;
	} catch (e) {
		return res.send(error(500, e.message));
	}
};

//this api will check the refreshToken validity and generate a new access token
const refreshAccessTokenController = async (req, res) => {

	const cookies = req.cookies;
	if (!cookies.refreshTokenByCookie) {
		return res.send(error(401, "Refresh token in cookies is required"));
	}
	const refreshToken = cookies.refreshTokenByCookie;

	//comparing token (verify)
	try {
		const decode = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_PRIVATE_KEY,
		);
		const _id = decode._id;
		//generating new access token
		const accessToken = generateAccessToken({ _id });

		return res.send(success(201, { accessToken }));
	} catch (e) {
		console.log(e);
		return res.send(error(401, "Invalid refresh token"));
	}
};

const generateRefreshToken = (data) => {
	try {
		const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
			expiresIn: "1y",
		}); 
		return token;
	} catch (e) {
		return res.send(error(500, e.message));
	}
};

module.exports = {
	signUpcontroller,
	logincontroller,
	refreshAccessTokenController,
	logoutController
};
