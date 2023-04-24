const qrcode = require("qrcode-terminal");
const express = require("express");
const app = express();
require("dotenv").config();

const { Client, RemoteAuth } = require("whatsapp-web.js");

// Require database
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const mes =
  "I'm a bot and this was done automatically. \nTo learn more of my features send *!ping* to me";

// Load the session data
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
    const store = new MongoStore({ mongoose: mongoose });
    const client = new Client({
      restartOnAuthFail: true,
      puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
      },
      authStrategy: new RemoteAuth({
        store: store,
        backupSyncIntervalMs: 300000,
      }),
    });

    client.on("qr", (qr) => {
      // NOTE: This event will not be fired if a session is specified.
      qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("Client is ready!");
    });
    client.on("message", async (msg) => {
      console.log(msg.body);
      if (msg.body === "!ping") {
        // Send a new message as a reply to the current one
        msg.reply(
          "*COMMANDS*: \n\n\n *!ping*: checkout my commands \n\n\n *!join*: send me an invite to your group, \n Format: * *!join* _invite code_* \n\n\n *!anon*: send an anonymous message to specific number, \n Format: * *!anon* _number(with country code)_ _message_* \n\n\n *!group*: send an anonymous message to specific group (I must be in the group), \n Format: * *!group* _group name(not necessarily all, the first word is enough )_ _message_* "
        );
      } else if (msg.body === "!chat") {
const chat = await client.getChats()
 const group = chat.filter(chat => chat.isGroup === true)
 msg.reply(group.toString())
} else if (msg.body.startsWith("!anon ")) {
        // Direct send a new message to specific id
        let number = msg.body.split(" ")[1];
        let messageIndex = msg.body.indexOf(number) + number.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        number = number.includes("@c.us") ? number : `${number}@c.us`;
        if (number.includes("+")) {
          number = number.replace("+", "");
        }
        message += ` \n\n ${mes}`;
        let chat = await msg.getChat();
        chat.sendSeen();
        client.sendMessage(number, message);
        msg.reply("done");
      } else if (msg.body.startsWith("!join ")) {
        const inviteCode = msg.body.split(" ")[1];
        try {
          await client.acceptInvite(inviteCode);
          msg.reply("Joined the group!");
        } catch (e) {
          msg.reply("That invite code seems to be invalid.");
        }
      } else if (msg.body.includes("!group ")) {
        const name = msg.body.split(" ")[1];
        const messageIndex = msg.body.indexOf(name) + name.length;
        let message = msg.body.slice(messageIndex, msg.body.length);
        const chats = await client.getChats();
        message += ` \n\n ${mes}`;
        
        
          const chat = chats.find((chat) =>
            chat.name.includes(name)
          );
          if (chat) {
console.log(chat.id._serialized)
            await client.sendMessage(chat.id._serialized, message);
            msg.reply("done");
          }

      }else if (msg.body === '!leave') {
        // Leave the group
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply("goodbye")
            chat.leave();
        } else {
            msg.reply('This command can only be used in a group!');
        }
    }else if (msg.body === '!groupinfo') {
        let chat = await msg.getChat();
        if (chat.isGroup) {
            msg.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        } else {
        console.log(msg.body)
        }
    }});

    client.on("group_join", (notification) => {
      // User has joined or been added to the group.
      console.log("join", notification);
      notification.reply("User joined.");
    });

    client.on("group_leave", (notification) => {
      // User has left or been kicked from the group.
      console.log("leave", notification);
      notification.reply("User left.");
    });

    client.on("group_update", (notification) => {
      // Group picture, subject or description has been updated.
      console.log("update", notification);
    });

    client.on("change_state", (state) => {
      console.log("CHANGE STATE", state);
    });

    // Change to false if you don't want to reject incoming calls
    let rejectCalls = true;

    client.on("call", async (call) => {
      console.log("Call received, rejecting. GOTO Line 261 to disable", call);
      if (rejectCalls) await call.reject();
      await client.sendMessage(
        call.from,
        `[${call.fromMe ? "Outgoing" : "Incoming"}] Phone call from ${
          call.from
        }, type ${call.isGroup ? "group" : ""} ${
          call.isVideo ? "video" : "audio"
        } call. ${
          rejectCalls
            ? "This call was automatically rejected by the script."
            : ""
        }`
      );
    });

    client.on("disconnected", (reason) => {
      console.log("Client was logged out", reason);
    });

    client.on("group_admin_changed", (notification) => {
      if (notification.type === "promote") {
        /**
         * Emitted when a current user is promoted to an admin.
         * {@link notification.author} is a user who performs the action of promoting/demoting the current user.
         */
        console.log(`You were promoted by ${notification.author}`);
      } else if (notification.type === "demote")
        /** Emitted when a current user is demoted to a regular user. */
        console.log(`You were demoted by ${notification.author}`);
    });

    client.initialize();
  });

console.log("fuck this");
app.listen(3000, () => {
  console.log("listening on port 3000");
});
