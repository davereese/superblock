const express = require('express');
const router = express.Router();


// status check
router.get('status', (req, res) => {
  return res.status(200).json('good');
});

module.exports = router;