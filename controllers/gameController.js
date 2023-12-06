const { validationResult } = require('express-validator');
const gameService = require('../services/gameService');

exports.createGameEntry = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const gameData = req.body;

  try {
    const newGameEntry = await gameService.createGameEntry(userId, gameData);
    res.json({ message: 'Game entry created successfully', data: newGameEntry });
  } catch (error) {
    console.error('Error creating game entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getGameData = async (req, res) => {
  const userId = req.user.id;

  try {
    const userGameData = await gameService.getGameData(userId);
    res.json({ data: userGameData });
  } catch (error) {
    console.error('Error retrieving game data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateGameData = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const gameData = req.body;

  try {
    const updatedGameData = await gameService.updateGameData(userId, gameData);
    res.json({ message: 'Game data updated successfully', data: updatedGameData });
  } catch (error) {
    console.error('Error updating game data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteGameEntry = async (req, res) => {
  const userId = req.user.id;

  try {
    const deletedGameEntry = await gameService.deleteGameEntry(userId);
    res.json({ message: 'Game entry deleted successfully', data: deletedGameEntry });
  } catch (error) {
    console.error('Error deleting game entry:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
