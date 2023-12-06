// services/gameService.js
const gameModel = require('../models/gameModel');

exports.createGameEntry = async (userId, gameData) => {
  return gameModel.createGameEntry(userId, gameData);
};

exports.getGameData = async (userId) => {
  return gameModel.getGameData(userId);
};

exports.updateGameData = async (userId, gameData) => {
  return gameModel.updateGameData(userId, gameData);
};

exports.deleteGameEntry = async (userId) => {
  return gameModel.deleteGameEntry(userId);
};
