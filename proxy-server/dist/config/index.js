"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    KAFKA: {
        BROKER: process.env.APP_KAFKA_BROKER,
        USERNAME: process.env.APP_KAFKA_USERNAME,
        PASSWORD: process.env.APP_KAFKA_PASSWORD,
    },
};
