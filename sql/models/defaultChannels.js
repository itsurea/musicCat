const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

module.exports = function(sequelize, Sequelize) {
  const DefaultChannels = sequelize.define("defaultChannels", {
    id: {
      primaryKey: true,
      allowNull: false,
      notEmpty: true,
      type: Sequelize.UUID
    },
    serverId: {
      unique: true,
      allowNull: false,
      notEmpty: true,
      type: Sequelize.STRING,
    },
    channelId: {
      allowNull: false,
      notEmpty: true,
      type: Sequelize.STRING,
    }
  });

  DefaultChannels.getDefaultChannels = async function() {
    const res = await this.findAll({
      attributes: ["serverId", "channelId"],
      raw: true
    });

    return res;
  }

  DefaultChannels.deleteChannel = async function (serverId) {
    const server = await this.findOne({
      where: {
        serverId
      }
    });

    if (!server) return false;

    await server.destroy();
    return true;
  }

  DefaultChannels.registerChannel = async function(obj) {
    const { serverId, channelId } = obj;
    const id = await uuidv4();

    const oldChannelId = await this.findOne({
      where: {
        serverId
      },
    });

    if (oldChannelId) {
      oldChannelId.channelId = channelId;
      return oldChannelId;
    } else {
      const addChannel = await this.create({
        id,
        serverId,
        channelId
      });

      return addChannel;
    }
  }

  return DefaultChannels;
}
