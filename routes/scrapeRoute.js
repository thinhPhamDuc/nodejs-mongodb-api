const express = require('express');
const { scrape, bot } = require('../controllers/scrapeController');
const router = express.Router();

router.get('/scraping-data/:page', scrape)
router.get('/checking-bot', bot)


module.exports = router; 