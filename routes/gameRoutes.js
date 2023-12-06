const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth.middleware');
const tokenMiddleware = require('../middleware/tokenMiddleware');
const gameController = require('../controllers/gameController');
const validationMiddleware = require('../middleware/validationMiddleware');

/**
 * @swagger
 * /game/create-game-entry:
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

router.post(
  '/create-game-entry',
  tokenMiddleware.verifyToken,
  [
    body('score', 'Score is required').isNumeric(),
    body('level', 'Level is required').isNumeric(),
    body('kdRatio', 'KD Ratio is required').isNumeric(),
    body('totalMatchesPlayed', 'Total Matches Played is required').isNumeric(),
    body('headshotPercentage', 'Headshot Percentage is required').isNumeric(),
    body('wins', 'Wins is required').isNumeric(),
    body('totalKills', 'Total Kills is required').isNumeric(),
    validationMiddleware,
  ],
  gameController.createGameEntry
);

router.get('/get-game-data', tokenMiddleware.verifyToken, gameController.getGameData);
router.put('/update-game-data', tokenMiddleware.verifyToken, gameController.updateGameData);
router.delete('/delete-game-entry', tokenMiddleware.verifyToken, gameController.deleteGameEntry);

module.exports = router;
