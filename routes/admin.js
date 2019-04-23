
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

//Middleware to protect against no logged in access
const isAuth = require('../middleware/is-auth');

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product',isAuth, adminController.postAddProduct);

// /admin/add-product => GET
router.get('/edit-product', isAuth, adminController.getEditProduct);

router.post('/update-product',isAuth, adminController.postEditProduct);

router.post('/delete-product',isAuth, adminController.postDeleteProduct);

router.get('/manage-users',isAuth, adminController.getManageUsers);

router.post('/admin-user', isAuth, adminController.postAdminUser);

module.exports = router;
