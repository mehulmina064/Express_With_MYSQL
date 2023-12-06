// models/gameModel.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  userId: { type: String, required: true , undefined: true},
  score: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  kdRatio: { type: Number, default: 0 },
  totalMatchesPlayed: { type: Number, default: 0 },
  headshotPercentage: { type: Number, default: 0 },
  wins: { type: Number, default: 0 },
  totalKills: { type: Number, default: 0 },
});

const Game = mongoose.model('Game', gameSchema);

exports.createGameEntry = async (userId, gameData) => {
  return Game.create({ userId, ...gameData });
};

exports.getGameData = async (userId) => {
  return Game.findOne({ userId });
};

exports.updateGameData = async (userId, gameData) => {
  return Game.findOneAndUpdate({ userId }, { $set: gameData }, { new: true });
};

exports.deleteGameEntry = async (userId) => {
  return Game.findOneAndDelete({ userId });
};
