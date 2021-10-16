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
    });

    return res;
  }

  DefaultChannels.deleteChannel = async function (id) {
    const ip = await this.findOne({
      where: {
        id
      }
    });

    if (!ip) return false;

    await ip.destroy();
    return true;
  }

  DefaultChannels.registerChannel = async function(obj) {
    const { serverId, channelId } = obj;
    const id = await uuidv4();

    const addChannel = await this.create({
      id,
      serverId,
      channelId
    });

    return addChannel;
  }

  return DefaultChannels;
}
