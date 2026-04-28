const express = require('express');
const router = express.Router();
const Database = require('../data/source');

// @route   GET api/transport
// @desc    Get all transport
router.get('/', (req, res) => {
    try {
        res.json(Database.transport);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
