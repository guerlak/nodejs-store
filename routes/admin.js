const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

//Middleware check Authentication
const isAuth = require('../middleware/is-auth');

router.get('/',isAuth, adminController.getProducts);
router.get('/products',isAuth, adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product',isAuth, adminController.postAddProduct);
router.get('/edit-product', isAuth, adminController.getEditProduct);
router.post('/update-product',isAuth, adminController.postEditProduct);

router.delete('/delete-product/:prodId',isAuth, adminController.deleteProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);
router.get('/manage-users',isAuth, adminController.getManageUsers);
router.post('/admin-user', isAuth, adminController.postAdminUser);


module.exports = router;
