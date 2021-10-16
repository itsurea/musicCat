const i18n = require("../util/i18n");
const db = require("../sql");

module.exports = {
  name: "setchannel",
  cooldown: 10,
  description: i18n.__("setchannel.description"),
  execute: async (message) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    const defaultChannelObj = {
      serverId: message.channel.guild.id,
      channelId: message.channel.id
    }
    await db.defaultChannels.registerChannel(defaultChannelObj);
    const findDefault = message.client.defaultChannels.find((element) => element.serverId === message.channel.guild.id);
    findDefault.channelId = message.channel.id;
    return message.channel.send(i18n.__("setchannel.result"));
  }
};
