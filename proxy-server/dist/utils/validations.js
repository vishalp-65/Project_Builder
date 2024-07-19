"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAssetRequest = void 0;
const isAssetRequest = (path) => {
    const assetExtensions = [
        ".js",
        ".css",
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".svg",
        ".ico",
        ".woff",
        ".woff2",
        ".json",
    ];
    return assetExtensions.some((ext) => path.endsWith(ext));
};
exports.isAssetRequest = isAssetRequest;
