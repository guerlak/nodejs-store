const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const isAuth = require('../middleware/is-auth')

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductDetail);

router.get('/cart',isAuth, shopController.getCart);

router.post('/cart',isAuth, shopController.postCart);

router.get('/orders',isAuth, shopController.getOrders);

router.get('/checkout',isAuth, shopController.getCheckout);

router.get('/orders/:orderId',isAuth, shopController.getOrderDocument);

module.exports = router;
