"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const utils_1 = require("./utils/utils");
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
server.get("/", async (request, reply) => {
    return { hello: "Equity express" };
});
server.post("/api/base64", async (request, reply) => {
    console.log('base 64 route...');
    try {
        const data = await request.file();
        await pump(data.file, fs.createWriteStream(data.filename));
        console.log('we have the doc');
        const base64Images = await (0, utils_1.pdfToImage)(data.filename);
        // await deleteFile(data.filename);
        reply.send({ base64Images });
    }
    catch (error) {
        console.error({ error });
    }
});
const start = async () => {
    await server.after();
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
};
start();
