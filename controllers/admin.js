const Product = require('../models/product');
const User = require('../models/user');
const mongoDb = require("mongodb");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(prods => {
    res.render('admin/products', {
      prods: prods,
      pageTitle: "Admin | All Products",
      path: '/admin/products',
      isLoggedIn: req.session.isLoggedin
    });
  }).catch(err => {
    console.log(err);
  })
}

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editMode: "false",
    isLoggedIn: req.session.isLoggedin
  });
};

exports.getEditProduct = (req, res, next) => {

  const editMode = req.query.editMode;
  const prodId = req.query.prodId;

  if (!editMode) {
    return res.redirect("/");
  } else {
    Product.findById(prodId)
    .then(product => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        product: product,
        pageTitle: product.title,
        editMode: "true"
    }).catch(err => {
      throw err;
    })
    });
  };
};

exports.postAddProduct = (req, res) => {

  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = Math.round(req.body.price * 100) / 10;
  const description = req.body.description;
  const userId = req.session.user._id
  const product = new Product(title, price, description, imageUrl, userId);

  product.save()
  .then(() => {
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err)  
  });
};


exports.postUpdateProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  console.log(price)
  console.log(prodId)

  const product = new Product(title, price, description, imageUrl, new mongoDb.ObjectID(prodId));
  console.log(product)
      product.save()
      .then(() => {
        res.redirect('/admin/products');
      }).catch(err => {
        console.log(err);
      });
};

exports.postDeleteProduct = (req, res) => {

  const prodId = req.query.id;
  console.log("Id req delete: " + prodId)
  Product.deleteById(prodId)
  .then(() => {
    res.redirect('/admin/products');
  }).catch(err => {
    console.log(err);
  })
};

exports.getManageUsers = (req, res) => {

  // const userRole = req.user.role;
  // if(!userRole){
  //   return res.redirect('/');
  // }
  let users;
  User.fetchAll()
  .then(result => {
    users = result;
    res.render('./admin/manage-users',{
      pageTitle: "User Management",
      path: '/manage-users',
      users: users
    })
  })
};



