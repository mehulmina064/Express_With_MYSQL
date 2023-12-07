// services/gameService.js
const gameModel = require('../models/gameModel');

class GameService {

      getGameData = async (userId, page = 1, limit = 10, query = {}) => {
        return gameModel.getGameData(userId, page, limit, query);
      };

      createGameEntry = async (userId, gameData) => {
        return gameModel.createGameEntry(userId, gameData);
      };
      
      getGameData = async (userId) => {
        return gameModel.getGameData(userId);
      };

      getGameDataWithQuery = async (page = 1, limit = 10, query = {}) => {
        return gameModel.getGameDataWithQuery(page, limit, query);
      };
      
      updateGameData = async (userId, gameData) => {
        return gameModel.updateGameData(userId, gameData);
      };
      
     deleteGameEntry = async (userId) => {
        return gameModel.deleteGameEntry(userId);
      };

      addGameDataDetailsToUser = async  (user) => {
        try{
            let userGameData = await this.getGameData(user.id);
            if(!userGameData) {
                userGameData= {
                    "score": 0,
                    "level": 0,
                    "kdRatio": 0,
                    "totalMatchesPlayed": 0,
                    "headshotPercentage": 0,
                    "wins": 0,
                    "totalKills": 0
                  }
            }
            user.gameData=userGameData;
        }
        catch(e){
            throw new Error(`Error in addGameDataDetailsToUser  error `+ e )
        }
      }
}

module.exports = new GameService;
