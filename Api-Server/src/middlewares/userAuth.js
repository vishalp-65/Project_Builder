const jwt = require("jsonwebtoken");
const { ServerConfig } = require("../config/index.js");
const { errorObj } = require("../utils/index.js");
const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//auth
async function authenticate(req, res, next) {
    try {
        //extract token
        const token =
            req.body.token ||
            req.cookies.token ||
            req.header("Authorisation").replace("Bearer ", "");

        console.log("token", token);

        //if token missing, then return response
        if (!token) {
            errorObj.success = false;
            errorObj.message = "Token is missing";
            return res.status(StatusCodes.UNAUTHORIZED).json(errorObj);
        }

        //verify the token
        try {
            const decode = jwt.verify(token, ServerConfig.JWT_SECRET_KEY);
            req.user = decode;
        } catch (err) {
            //verification - issue
            errorObj.success = false;
            errorObj.message = "Token is invalid";
            return res.status(StatusCodes.UNAUTHORIZED).json(errorObj);
        }
        next();
    } catch (error) {
        errorObj.success = false;
        errorObj.message = "Something went wrong while validating the token";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

async function authenticateUser(req, res, next) {
    try {
        const deployementId = req.params.id;

        const deployement = await prisma.deployement.findFirst({
            where: {
                id: deployementId,
            },
        });

        const project = await prisma.project.findFirst({
            where: {
                id: deployement.projectId,
            },
        });
        if (project.userId !== req.user.id) {
            errorObj.success = false;
            errorObj.message = "You can check only your project logs";
            return res.status(StatusCodes.UNAUTHORIZED).json(errorObj);
        }
        next();
    } catch (error) {
        errorObj.success = false;
        errorObj.message = "Project not found";
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorObj);
    }
}

module.exports = { authenticate, authenticateUser };
