"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Temporarily supports only mongodb, will change to use database adapter in the future
const templateSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
    template: JSON,
    ownerOID: String,
    isPublished: Boolean,
    created: {
        type: Date,
        default: Date.now
    }
});
exports.Template = mongoose_1.default.model("Template", templateSchema);
//# sourceMappingURL=Template.js.map