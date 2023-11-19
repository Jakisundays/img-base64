const fp = require("fastify-plugin");

const corsOpts = (fastify, opts, done) => {
  fastify.register(require("@fastify/cors"), {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // credentials: true,
  });
  done();
};

module.exports = fp(corsOpts);
