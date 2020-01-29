"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan_1 = __importDefault(require("bunyan"));
// Logger
var logger = bunyan_1.default.createLogger({
    name: "Adaptive Cards Admin Portal"
});
exports.default = logger;
//# sourceMappingURL=logger.js.map