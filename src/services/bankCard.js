const bankCardRepo = require('../repositories/bankCard');

const getAllBankCards = async () => {
  const bankCards = await bankCardRepo.findAll();
  return bankCards;
};

const getBankCardById = async (id) => {
  const bankCard = await bankCardRepo.findById(id);
  return bankCard;
};

const createBankCard = async (payload) => {
  const bankCard = await bankCardRepo.create(payload);
  return bankCard;
};

const updateBankCard = async (id, body) => {
  const bankCard = await bankCardRepo.update(id, body);
  return bankCard;
};

const deleteBankCard = async (id) => {
  await bankCardRepo.destroy(id);
  return true;
};

module.exports = {
  getAllBankCards,
  getBankCardById,
  createBankCard,
  updateBankCard,
  deleteBankCard
};
