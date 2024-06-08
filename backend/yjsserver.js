const { Hocuspocus } = require("@hocuspocus/server");

// Configure the server …
const server = new Hocuspocus({
  port: 1234,
});

// … and run it!
module.exports = () => server.listen();