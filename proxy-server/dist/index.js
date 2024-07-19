"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const validations_1 = require("./utils/validations");
const kafka_1 = require("./services/kafka");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 8000;
const proxy = http_proxy_1.default.createProxy();
const fallbackHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Not Found</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #444; }
    </style>
</head>
<body>
    <h1>Site Not Found</h1>
    <p>The requested site could not be found. Please check the URL and try again.</p>
</body>
</html>
`;
app.use((req, res) => {
    const host = req.headers.host;
    const subDomain = host ? host.split(".")[0] : null;
    if (!subDomain) {
        return res.status(400).send("Invalid subdomain");
    }
    const startTime = process.hrtime();
    res.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(req.path);
        if ((0, validations_1.isAssetRequest)(req.path))
            return;
        const [seconds, nanoseconds] = process.hrtime(startTime);
        // Convert the duration to milliseconds
        const duration = seconds * 1000 + nanoseconds / 1e6;
        const analyticsData = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            subdomain: subDomain,
            path: req.url,
            method: req.method,
            statusCode: res.statusCode,
            userAgent: req.get("User-Agent"),
            referer: req.get("Referer"),
            ip: req.ip,
            country: req.get("CF-IPCountry"),
            duration: duration.toFixed(2),
            contentLength: res.get("Content-Length"),
        };
        yield (0, kafka_1.publishAnalytic)(analyticsData);
    }));
    return proxy.web(req, res, {
        target: `${process.env.S3_BASE_URL}/${subDomain}`,
        changeOrigin: true,
    });
});
proxy.on("proxyReq", (proxy, req, res) => {
    if (req.url === "/") {
        proxy.path += "index.html";
    }
});
proxy.on("proxyRes", (proxyRes, req, res) => {
    if (proxyRes.statusCode === 403 || proxyRes.statusCode === 404) {
        // For 403 or 404 errors, serve the fallback HTML
        proxyRes.destroy(); // End the original response
        res.writeHead(200, {
            "Content-Type": "text/html",
            "Content-Length": Buffer.byteLength(fallbackHtml),
        });
        res.end(fallbackHtml);
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
