// models/gameModel.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  userId: { type: String, required: true , unique: true},
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

exports.getGameDataWithQuery = async (page = 1, limit = 10, query = {}) => {
    console.log('query', query);
    let parsedQuery;
    try {
      parsedQuery = JSON.parse(query);
    } catch (error) {
      console.error('Error parsing query:', error);
      parsedQuery = {};
    }
    const sanitizedPage = Math.max(1, parseInt(page)) || 1;
    const sanitizedLimit = Math.max(1, Math.min(100, parseInt(limit))) || 10;
  
    // const options = {
    //   page: sanitizedPage,
    //   limit: sanitizedLimit, 
    // };
    // Example: query = { level: { $gte: 5 }, wins: { $gte: 10 } }
 
    const pipeline = [
        { $match: parsedQuery }, 
        {
          $facet: {
            metadata: [{ $count: 'total' }, { $addFields: { page: sanitizedPage, limit: sanitizedLimit } }],
            data: [{ $skip: (sanitizedPage - 1) * sanitizedLimit }, { $limit: sanitizedLimit }],
          },
        },
      ];
    
      console.log('Aggregation Pipeline:', pipeline);
      const result = await Game.aggregate(pipeline);
    
      if (result.length > 0) {
        return {
          total: result[0].metadata[0] ? result[0].metadata[0].total : 0,
          page: sanitizedPage,
          limit: sanitizedLimit,
          data: result[0].data,
        };
      } else {
        return {
          total: 0,
          page: sanitizedPage,
          limit: sanitizedLimit,
          data: [],
        };
      }
  };

exports.updateGameData = async (userId, gameData) => {
  return Game.findOneAndUpdate({ userId }, { $set: gameData }, { new: true });
};

exports.deleteGameEntry = async (userId) => {
  return Game.findOneAndDelete({ userId });
};
