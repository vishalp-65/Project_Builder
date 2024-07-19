const express = require("express");
const httpProxy = require("http-proxy");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 8000;
const prisma = new PrismaClient();

const BUCKET_PATH = process.env.BUCKET_PATH;

const proxy = httpProxy.createProxy();

app.use(async (req, res) => {
    const hostname = req.hostname;
    const domain = hostname.split(".")[0];

    let project = await prisma.project.findFirst({
        where: {
            customDomain: domain,
        },
    });

    if (!project) {
        project = await prisma.project.findFirst({
            where: {
                subDomain: domain,
            },
        });
    }

    const resolveTo = `${BUCKET_PATH}/${project.id}`;

    return proxy.web(req, res, { target: resolveTo, changeOrigin: true });
});

proxy.on("proxyReq", (proxyReq, req, res) => {
    const url = req.url;
    if (url === "/") proxyReq.path += "index.html";
});

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));
