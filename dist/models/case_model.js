"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const case_schema = new mongoose_1.default.Schema({
    id: {
        type: Number,
        required: true
    },
    crime: {
        type: String,
        required: true
    },
    conclusion: {
        type: String,
        required: true
    },
    identity: {
        type: Array,
        required: true
    },
    case_is_guilty: {
        type: Boolean,
        required: true
    },
    rank: {
        type: Number,
        required: true
    }
});
const Case = mongoose_1.default.model('Cases', case_schema);
exports.default = Case;
