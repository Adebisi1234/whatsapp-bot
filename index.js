const qrcode = require("qrcode-terminal");

const { Client } = require("whatsapp-web.js");
const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (message) => {
  console.log(message.body);
});

client.on("message", (message) => {
  if (message.body === "!ping") {
    message.reply("pong");
  }
});

client.on("message", (message) => {
  if (message.body === "!anon") {
    console.log(message.from);
    client.sendMessage(message.from, "pong");
  }
});

client.initialize();
