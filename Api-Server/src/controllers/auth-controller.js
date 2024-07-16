const { UserService } = require("../services/index.js");
const { errorObj, successObj } = require("../utils/index.js");
const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function CreateUser(req, res) {
    try {
        // destructure all values
        const { name, email, password, otp, image } = req.body;
        console.log({ name, email, password, otp });
        // Check if all required fields are present
        if (!name || !email) {
            errorObj.message = "All fields are required";
            errorObj.success = false;
            return res.status(StatusCodes.FORBIDDEN).json(errorObj);
        }

        const newOTP = otp ? otp : "";
        const newPassword = password ? password : "";

        // Calling user-service for creating user
        const response = await UserService.SignUp({
            name,
            email,
            newPassword,
            newOTP,
            image,
        });

        successObj.message = "Successfully created a new user";
        successObj.data = response;

        return res.status(StatusCodes.CREATED).json(successObj);
    } catch (error) {
        // Handle errors
        errorObj.message = error.message;
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

async function LogIn(req, res) {
    try {
        // Distructure all values
        const { email, password } = req.body;

        // Checking all required fields are present
        if (!email || !password) {
            errorObj.message = "All fields are required";
            errorObj.success = false;
            return res.status(StatusCodes.FORBIDDEN).json(errorObj);
        }

        // Calling user-service for loggin the user
        const response = await UserService.SignIn(req.body);

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        // sending cookies with token
        return res
            .cookie("token", response.token, options)
            .status(StatusCodes.OK)
            .json({
                success: true,
                data: {
                    token: response.token,
                    user: response.user,
                },
                message: `User Login Success`,
            });
    } catch (error) {
        // Handling errors
        errorObj.message = error.message;
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

async function SendOtp(req, res) {
    try {
        const { email } = req.body;

        // Check if email is empty
        if (!email) {
            errorObj.message = "Email is required";
            errorObj.success = false;
            return res.status(StatusCodes.FORBIDDEN).json(errorObj);
        }

        // Calling user-service for sending otp
        const response = await UserService.SendOtp(email);

        console.log("response", response);
        if (response.message === "User Exists") {
            errorObj.message = "Email already exists";
            errorObj.success = false;
            return res.status(StatusCodes.BAD_REQUEST).json(errorObj);
        }
        successObj.message = "OTP Created successfully";
        successObj.data = response;
        return res.status(StatusCodes.OK).json(successObj);
    } catch (error) {
        // Handle error
        errorObj.message = error.message;
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

async function getUserDetails(req, res) {
    try {
        const userId = req.user.id;

        console.log("userId", userId);
        const response = await prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        response.password = undefined;
        successObj.message = "User details";
        successObj.data = response;
        return res.status(StatusCodes.OK).json(successObj);
    } catch (error) {
        // Handle error
        errorObj.message = "User not found";
        errorObj.err = error;

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

module.exports = { SendOtp, LogIn, CreateUser, getUserDetails };
