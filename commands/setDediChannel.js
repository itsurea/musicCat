const i18n = require("../util/i18n");
const db = require("../sql");

let defaultChannels = {};

module.exports = {
  name: "setchannel",
  cooldown: 10,
  description: i18n.__("ping.description"),
  execute(message) {
    console.log(message);
    return message.channel.send("test");
  }
};
