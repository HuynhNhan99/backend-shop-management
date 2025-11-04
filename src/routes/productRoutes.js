const express = require('express');
const ProductController = require('../controllers/ProductController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', verifyToken, (req, res) => ProductController.list(req, res));
router.post('/', verifyToken, (req, res) => ProductController.create(req, res));
router.put('/:id',  verifyToken, (req, res) => ProductController.update(req, res));
router.delete('/:id', verifyToken, (req, res) => ProductController.remove(req, res));

module.exports = router;
