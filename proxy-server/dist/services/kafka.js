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
exports.publishAnalytic = publishAnalytic;
const kafkajs_1 = require("kafkajs");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const kafkaClient = new kafkajs_1.Kafka({
    clientId: `proxy-server`,
    brokers: [config_1.config.KAFKA.BROKER],
    sasl: {
        username: config_1.config.KAFKA.USERNAME,
        password: config_1.config.KAFKA.PASSWORD,
        mechanism: "plain",
    },
    ssl: {
        ca: [
            fs_1.default.readFileSync(path_1.default.resolve(__dirname, "../../kafka.pem"), "utf-8"),
        ],
    },
});
const producer = kafkaClient.producer();
function publishAnalytic(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield producer.send({
            topic: "proxy-analytics",
            messages: [{ key: "analytic", value: JSON.stringify({ data }) }],
        });
    });
}
