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
const fastify_1 = __importDefault(require("fastify"));
// import { deleteFile, pdfToImage } from "./utils/utils";
const { pipeline } = require("node:stream");
const util = require("node:util");
const pump = util.promisify(pipeline);
const fs = require("node:fs");
const server = (0, fastify_1.default)();
// Register the 'corsOpts' plugin.
server.register(require("./plugins/corsOpts.js"));
server.register(require("@fastify/multipart"), {
    limits: {
        fieldNameSize: 999999999,
        fieldSize: 99999999,
        fields: 10,
        fileSize: 3999999999,
        files: 1,
        headerPairs: 2000,
        parts: 1000, // For multipart forms, the max number of parts (fields + files)
    },
});
server.get("/", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { hello: "Equity express" };
}));
// server.post("/api/base64", async (request: any, reply: any) => {
//   try {
//     const data = await request.file();
//     await pump(data.file, fs.createWriteStream(data.filename));
//     const base64Images = await pdfToImage(data.filename);
//     await deleteFile(data.filename);
//     reply.send({ base64Images });
//   } catch (error) {
//     console.error({ error });
//   }
// });
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    yield server.after();
    // const port = process.env.PORT || 3000;
    const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;
    server.listen({ port: 8080, host }, (err, address) => {
        if (err) {
            console.log(err);
            server.log.error(err);
            process.exit(1);
        }
        console.log(`Server listening on ${address}`);
    });
});
start();
