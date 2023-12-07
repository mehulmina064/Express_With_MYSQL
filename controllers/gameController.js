const { validationResult } = require('express-validator');
const gameService = require('../services/gameService');
const { checkValidation } = require('../utils/common.utils');
const UserModel = require('../models/user.model');
const { DuplicateKeyError,UserAlreadyExistsError,UserNotFoundError,BadRequestError,HttpException, ValidationError, UnauthorizedError } = require('../utils/errors');



/******************************************************************************
 *                              Game DATA Controller
 ******************************************************************************/
class GameController {
//*************** my profile data ***********************

 createGameEntry = async (req, res,next) => {

    // Validate request
    checkValidation(req);
  
  
    const userId = req.currentUser.id;
    const gameData = req.body;
  
    try {
      let userGameData = await gameService.getGameData(userId);
      if(userGameData) {
          const updatedGameData = await gameService.updateGameData(userId, gameData);
          res.json({ message: 'Game data updated successfully', data: updatedGameData });
      }
      else{
          const newGameEntry = await gameService.createGameEntry(userId, gameData);
          res.json({ message: 'Game entry created successfully', data: newGameEntry });
      }
    } catch (error) {
      console.error('Error creating game entry:', error);
      next(error);
    }
  };
  
  getGameData = async (req, res,next) => {
    const userId = req.currentUser.id; 
    try {
      let userGameData = await gameService.getGameData(userId);
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
      res.json({ data: userGameData , message: "Game details!" });
    } catch (error) {
      console.error('Error retrieving game data:', error);
      next(error);
    }
  };
  
  updateGameData = async (req, res,next) => {
    // Validate request
    checkValidation(req);
    const userId = req.currentUser.id;
    const gameData = req.body;
  
    try {
      const updatedGameData = await gameService.updateGameData(userId, gameData);
      res.json({ message: 'Game data updated successfully', data: updatedGameData });
    } catch (error) {
      console.error('Error updating game data:', error);
      next(error);
    }
  };
  
  deleteGameEntry = async (req, res,next) => {
    const userId = req.currentUser.id;
  
    try {
      const deletedGameEntry = await gameService.deleteGameEntry(userId);
      res.json({ message: 'Game entry deleted successfully', data: deletedGameEntry });
    } catch (error) {
      console.error('Error deleting game entry:', error);
      next(error);
    }
  };

  //*************** all users game data ***********************


  getGameDataWithQuery = async (req, res,next) => {
    try {
      const { page, limit, query } = req.query;
      const result = await gameService.getGameDataWithQuery(page, limit, query); 
      res.status(200).json({data: result, message: "All User GameData List details!"});
    } catch (error) {
      console.error('Error getGameDataWithQuery:', error);
      next(error);
    }
  };

  createUserGameEntry = async (req, res,next) => {

    // Validate request
    checkValidation(req);
    //check user exists or not
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
        throw new HttpException(404, 'User not found on this id');
    }
    const userId = req.params.id;
    const gameData = req.body;
  
    try {
      let userGameData = await gameService.getGameData(userId);
      if(userGameData) {
          const updatedGameData = await gameService.updateGameData(userId, gameData);
          res.json({ message: 'Game data updated successfully', data: updatedGameData });
      }
      else{
          const newGameEntry = await gameService.createGameEntry(userId, gameData);
          res.json({ message: 'Game entry created successfully', data: newGameEntry });
      }
    } catch (error) {
      console.error('Error creating game entry:', error);
      next(error);
    }
  };
  
  getUserGameData = async (req, res,next) => {
       //check user exists or not
       const user = await UserModel.findOne({ id: req.params.id });
       if (!user) {
           throw new HttpException(404, 'User not found on this id');
       }
    const userId = req.params.id; 
    try {
      let userGameData = await gameService.getGameData(userId);
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
      res.json({ data: userGameData , message: "Game details!" });
    } catch (error) {
      console.error('Error retrieving game data:', error);
      next(error);
    }
  };
  
  updateUserGameData = async (req, res,next) => {
    // Validate request
    checkValidation(req);
    //check user exists or not
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
      throw new HttpException(404, 'User not found on this id');
    }
    const userId = req.params.id;
    const gameData = req.body;
  
    try {
      const updatedGameData = await gameService.updateGameData(userId, gameData);
      res.json({ message: 'Game data updated successfully', data: updatedGameData });
    } catch (error) {
      console.error('Error updating game data:', error);
      next(error);
    }
  };
  
  deleteUserGameEntry = async (req, res,next) => {
    const userId = req.params.id;
    //check user exists or not
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
        throw new HttpException(404, 'User not found on this id');
    }
  
    try {
      const deletedGameEntry = await gameService.deleteGameEntry(userId);
      res.json({ message: 'Game entry deleted successfully', data: deletedGameEntry });
    } catch (error) {
      console.error('Error deleting game entry:', error);
      next(error);
    }
  };




}



/******************************************************************************
 *                               Export
 ******************************************************************************/

module.exports = new GameController;