const express = require('express');
const gameController = require('../controllers/gameController');
const { createGameEntrySchema, updateGameEntrySchema } = require('../middleware/validators/gameValidator.middleware');
const { auth } = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const Role = require('../utils/userRoles.utils');

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: Game management endpoints
 */

/**
 * @swagger
 * /api/v1/game/create-game-entry:
 *   post:
 *     summary: Create a new game entry
 *     description: Endpoint for creating a new game entry.
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *               level:
 *                 type: number
 *               kdRatio:
 *                 type: number
 *               totalMatchesPlayed:
 *                 type: number
 *               headshotPercentage:
 *                 type: number
 *               wins:
 *                 type: number
 *               totalKills:
 *                 type: number
 *             required:
 *               - score
 *               - level
 *               - kdRatio
 *               - totalMatchesPlayed
 *               - headshotPercentage
 *               - wins
 *               - totalKills
 *     responses:
 *       200:
 *         description: Game entry created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Game entry created successfully
 *               data: <Game Entry Data>
 *       401:
 *         description: Invalid access token
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid access token
 */

/**
 * @swagger
 * /api/v1/game/get-game-data:
 *   get:
 *     summary: Get game data
 *     description: Endpoint for retrieving game data.
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             example:
 *               message: Game data retrieved successfully
 *               data: <Game Data>
 *       401:
 *         description: Invalid access token
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid access token
 */

/**
 * @swagger
 * /api/v1/game/update-game-data:
 *   put:
 *     summary: Update game data
 *     description: Endpoint for updating game data.
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: number
 *               level:
 *                 type: number
 *               kdRatio:
 *                 type: number
 *               totalMatchesPlayed:
 *                 type: number
 *               headshotPercentage:
 *                 type: number
 *               wins:
 *                 type: number
 *               totalKills:
 *                 type: number
 *             required:
 *               - score
 *               - level
 *               - kdRatio
 *               - totalMatchesPlayed
 *               - headshotPercentage
 *               - wins
 *               - totalKills
 *     responses:
 *       200:
 *         description: Game data updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Game data updated successfully
 *               data: <Updated Game Data>
 *       401:
 *         description: Invalid access token
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid access token
 */

/**
 * @swagger
 * /api/v1/game/delete-game-entry:
 *   delete:
 *     summary: Delete game entry
 *     description: Endpoint for deleting a game entry.
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Game entry deleted successfully
 *       401:
 *         description: Invalid access token
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid access token
 */

const router = express.Router();

router.post('/create-game-entry', auth(Role.Admin), createGameEntrySchema, awaitHandlerFactory(gameController.createGameEntry));

router.get('/get-game-data', auth(), awaitHandlerFactory(gameController.getGameData));

router.put('/update-game-data', auth(Role.Admin), updateGameEntrySchema, awaitHandlerFactory(gameController.updateGameData));

router.delete('/delete-game-entry', auth(), awaitHandlerFactory(gameController.deleteGameEntry));

module.exports = router;
