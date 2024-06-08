const { Hocuspocus } = require("@hocuspocus/server");

// Configure the server …
const server = new Hocuspocus({
  port: process.env.PORT,
});

// … and run it!
server.listen();