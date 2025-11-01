const express = require('express');
const PurchaseController = require('../controllers/PurchaseController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', verifyToken, (req, res) => PurchaseController.list(req, res));
router.post('/', verifyToken, (req, res) => PurchaseController.create(req, res));

module.exports = router;
