const bankCardService = require('../services/bankCard');

const getBankCards = async (req, res, next) => {
  try {
    const bankCards = await bankCardService.getAllBankCards();
    res.status(200).json({
      status: 'success',
      results: bankCards.length,
      data: bankCards
    });
  } catch (error) {
    next(error);
  }
};

const createBankCard = async (req, res, next) => {
  try {
    const { bank_name, card_number } = req.body;

    if (!bank_name || !card_number) {
      return res.status(400).json({
        status: 'fail',
        message: 'Bank name and card number are required'
      });
    }

    const bankCard = await bankCardService.createBankCard({
      bank_name,
      card_number,
      is_active: true
    });

    res.status(201).json({
      status: 'success',
      data: bankCard
    });
  } catch (error) {
    next(error);
  }
};

const updateBankCard = async (req, res, next) => {
  try {
    const { bank_name, card_number, is_active } = req.body;

    const existingCard = await bankCardService.getBankCardById(req.params.id);

    if (!existingCard) {
      return res.status(404).json({
        status: 'fail',
        message: 'Bank card not found'
      });
    }

    const bankCard = await bankCardService.updateBankCard(req.params.id, {
      bank_name: bank_name || existingCard.bank_name,
      card_number: card_number || existingCard.card_number,
      is_active: is_active !== undefined ? is_active : existingCard.is_active
    });

    res.status(200).json({
      status: 'success',
      data: bankCard
    });
  } catch (error) {
    next(error);
  }
};

const deleteBankCard = async (req, res, next) => {
  try {
    const existingCard = await bankCardService.getBankCardById(req.params.id);

    if (!existingCard) {
      return res.status(404).json({
        status: 'fail',
        message: 'Bank card not found'
      });
    }

    await bankCardService.deleteBankCard(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBankCards,
  createBankCard,
  updateBankCard,
  deleteBankCard
};
