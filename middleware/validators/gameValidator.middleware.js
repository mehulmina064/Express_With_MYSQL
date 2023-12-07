const { body } = require('express-validator');

body('score', 'Score is required').isNumeric(),
body('level', 'Level is required').isNumeric(),
body('kdRatio', 'KD Ratio is required').isNumeric(),
body('totalMatchesPlayed', 'Total Matches Played is required').isNumeric(),
body('headshotPercentage', 'Headshot Percentage is required').isNumeric(),
body('wins', 'Wins is required').isNumeric(),
body('totalKills', 'Total Kills is required').isNumeric(),
exports.createGameEntrySchema = [
    body('score')
        .exists()
        .withMessage('Score is required')
        .isNumeric()
        .withMessage('Must be a number'),
    body('level')
        .exists()
        .withMessage('Level is required')
        .isNumeric()
        .withMessage('Must be a number'),
    body('kdRatio')
        .exists()
        .withMessage('kdRatio is required')
        .isNumeric()
        .withMessage('Must be a number'),
    body('totalMatchesPlayed')
        .exists()
        .withMessage('totalMatchesPlayed is required')
        .isNumeric()
        .withMessage('Must be a number'),
    body('headshotPercentage')
        .exists()
        .withMessage('headshotPercentage is required')
        .isNumeric()
        .withMessage('Must be a number'),
    body('wins')
        .exists()
        .withMessage('wins is required')
        .isNumeric()
        .withMessage('Must be a number'),
    body('totalKills')
        .exists()
        .withMessage('totalKills is required')
        .isNumeric()
        .withMessage('Must be a number'),
];

exports.updateGameEntrySchema = [
body('score')
    .exists()
    .withMessage('Score is required')
    .isNumeric()
    .withMessage('Must be a number'),
body('level')
    .exists()
    .withMessage('Level is required')
    .isNumeric()
    .withMessage('Must be a number'),
body('kdRatio')
    .exists()
    .withMessage('kdRatio is required')
    .isNumeric()
    .withMessage('Must be a number'),
body('totalMatchesPlayed')
    .exists()
    .withMessage('totalMatchesPlayed is required')
    .isNumeric()
    .withMessage('Must be a number'),
body('headshotPercentage')
    .exists()
    .withMessage('headshotPercentage is required')
    .isNumeric()
    .withMessage('Must be a number'),
body('wins')
    .exists()
    .withMessage('wins is required')
    .isNumeric()
    .withMessage('Must be a number'),
body('totalKills')
    .exists()
    .withMessage('totalKills is required')
    .isNumeric()
    .withMessage('Must be a number'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['score', 'level', 'kdRatio', 'totalMatchesPlayed', 'headshotPercentage', 'wins', 'totalKills'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];