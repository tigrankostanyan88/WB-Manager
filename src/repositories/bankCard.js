const DB = require('../models');
const { BankCard } = DB.models;

module.exports = {
  findAll: async () => {
    const items = await BankCard.findAll({
      where: { is_active: true }
    });
    return items.map(i => i.get({ plain: true }));
  },
  findById: async (id) => BankCard.findByPk(id),
  create: async (payload) => BankCard.create(payload),
  update: async (id, body) => {
    const bankCard = await BankCard.findByPk(id);
    if (!bankCard) return null;
    await bankCard.update(body);
    return bankCard;
  },
  destroy: async (id) => BankCard.destroy({ where: { id } })
};
