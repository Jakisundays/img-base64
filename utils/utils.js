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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.pdfToImage = void 0;
const { pipeline } = require("node:stream");
const util = require("node:util");
const fs = require("node:fs");
const { pdf } = require("pdf-to-img");
const pdfToImage = (pdfPath) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const pages = yield pdf(pdfPath);
    let counter = 0;
    let base64Images = [];
    try {
        for (var _d = true, pages_1 = __asyncValues(pages), pages_1_1; pages_1_1 = yield pages_1.next(), _a = pages_1_1.done, !_a; _d = true) {
            _c = pages_1_1.value;
            _d = false;
            const image = _c;
            const path = `./assets/${counter})-${pdfPath}.png`;
            yield fs.promises.writeFile(path, image);
            const base64Image = imageToBase64(path);
            base64Images.push(base64Image);
            yield deleteFile(path);
            counter++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = pages_1.return)) yield _b.call(pages_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return base64Images;
});
exports.pdfToImage = pdfToImage;
function deleteFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.promises.unlink(filePath);
            console.log(`File ${filePath} deleted successfully`);
        }
        catch (error) {
            console.error(`Error deleting file ${filePath}:`, error.message);
        }
    });
}
exports.deleteFile = deleteFile;
function imageToBase64(imagePath) {
    // Read the image file as a buffer
    const imageBuffer = fs.readFileSync(imagePath);
    // Convert the buffer to a Base64-encoded string
    const base64String = imageBuffer.toString("base64");
    return base64String;
}
