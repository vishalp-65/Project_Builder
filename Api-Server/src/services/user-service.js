const { ServerConfig } = require("../config/index");
const { PrismaClient, Prisma } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { sendVerificationEmail } = require("../utils/helper");
const { use } = require("bcrypt/promises");

const prisma = new PrismaClient();

async function GenerateJWT(email, id) {
    try {
        // returning token
        return jsonwebtoken.sign(
            { id: id, email: email },
            ServerConfig.JWT_SECRET_KEY,
            { expiresIn: "30d" }
        );
    } catch (error) {
        console.log(error);
    }
}

async function SignUp(userData) {
    try {
        // checking if user is present
        let user = await prisma.user.findUnique({
            where: {
                email: userData.email,
            },
        });

        if (user) {
            // Throw error if email already exists
            const data = SignIn(userData.email, userData.password, true);
            return data;
        }

        // if user not present already then we can create user
        if (!user && userData.otp) {
            // Check OTP for the user in OTP model
            const response = await prisma.oTP.findFirst({
                where: {
                    email: userData.email,
                },
            });

            console.log("otp", response);

            // OTP not found for the email or not equal to otp
            if (response.length === 0 || userData.otp !== response.otp) {
                throw {
                    success: false,
                    message: "The OTP is not valid",
                };
            }
        }
        const salt = bcrypt.genSaltSync(9);
        const encryptedPassword = bcrypt.hashSync(userData.newPassword, salt);

        // Creating user
        const createdUser = await prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: encryptedPassword || "",
                image: userData.image || "sample", // TODO: needs to add real image
            },
        });
        return createdUser;
    } catch (error) {
        // Handle error
        console.log("Something went wrong in user service");
        console.log(error);
        throw error;
    }
}

async function SignIn(email, password, isGithub = false) {
    try {
        // checking if user is present
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw {
                message: "No user found",
            };
        }

        if (!isGithub) {
            // Check password with current user
            const isPasswordMatch = await bcrypt.compareSync(
                password,
                user.password
            );
            if (!isPasswordMatch) {
                throw {
                    message: "Incorrect password",
                };
            }
        }
        // Generate JWT token for user
        const token = await GenerateJWT(email, user.id);

        // Settign password undefined because we need to send user obj to frontend
        user.password = undefined;

        console.log("data returned", token);

        // Set cookie for token and return success response
        return { user, token };
    } catch (error) {
        // Handle error
        console.log(error);
        throw error;
    }
}

async function SendOtp(email) {
    try {
        // checking if user is present
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (user) {
            throw {
                message: "User Exists",
            };
        }

        const isOTPGenerated = await prisma.oTP.findFirst({
            where: {
                email: email,
            },
        });

        if (isOTPGenerated) {
            return { email: email, otp: isOTPGenerated.otp };
        }

        // Generating OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        const data = {
            email: email,
            otp: otp,
        };

        await sendVerificationEmail(email, otp);

        // Save OTP to database for 5 mints
        const response = await prisma.oTP.create({ data: data });
        return response;
    } catch (error) {
        // Handle errors
        console.log(error);
        return error;
    }
}

module.exports = { SignIn, SendOtp, SignUp };
