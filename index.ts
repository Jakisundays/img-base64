import fastify from "fastify";
import { deleteFile, pdfToImage } from "./utils/utils";

const { pipeline } = require("node:stream");
const util = require("node:util");
const pump = util.promisify(pipeline);
const fs = require("node:fs");
const server = fastify();

// Register the 'corsOpts' plugin.
server.register(require("./plugins/corsOpts.js"));

server.register(require("@fastify/multipart"), {
  limits: {
    fieldNameSize: 999999999, // Max field name size in bytes
    fieldSize: 99999999, // Max field value size in bytes
    fields: 10, // Max number of non-file fields
    fileSize: 3999999999, // For multipart forms, the max file size in bytes
    files: 1, // Max number of file fields
    headerPairs: 2000, // Max number of header key=>value pairs
    parts: 1000, // For multipart forms, the max number of parts (fields + files)
  },
});

server.get("/", async (request, reply) => {
  return { hello: "Equity express" };
});

server.post("/api/base64", async (request: any, reply: any) => {
  try {
    const data = await request.file();
    await pump(data.file, fs.createWriteStream(data.filename));
    const base64Images = await pdfToImage(data.filename);
    await deleteFile(data.filename);
    reply.send({ base64Images });
  } catch (error) {
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
