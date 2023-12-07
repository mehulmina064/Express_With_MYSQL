const express = require('express');
const gameController = require('../controllers/gameController');
const { createGameEntrySchema,updateGameEntrySchema } = require('../middleware/validators/gameValidator.middleware');
const {auth} = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const Role = require('../utils/userRoles.utils');


/**
 * @swagger
 * /api/v1/game/create-game-entry:
 *   post:
 *     summary: Create a new game entry
 *     description: Endpoint for creating a new game entry.
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

const router = express.Router();

router.post('/create-game-entry',auth(Role.Admin),createGameEntrySchema,awaitHandlerFactory(gameController.createGameEntry));
router.get('/get-game-data', auth(), awaitHandlerFactory(gameController.getGameData));
router.put('/update-game-data', auth(Role.Admin),updateGameEntrySchema, awaitHandlerFactory(gameController.updateGameData));
router.delete('/delete-game-entry', auth(), awaitHandlerFactory(gameController.deleteGameEntry));

module.exports = router;
