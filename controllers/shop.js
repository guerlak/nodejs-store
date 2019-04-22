const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {

  Product.fetchAll()
    .then((products) => {
      res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Home',
      path: '/',
    });
  });
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(prods => {
      res.render('shop/product-list', {
      prods: prods,
      pageTitle: 'All Products',
      path: '/products',
    });
});
}

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;
  
  Product.findById(prodId)
  .then(product => {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isLoggedIn: req.session.isLoggedin
    });
  }).catch(err => {
    console.log(err);
  });
};

//MYSQL2 
// exports.getIndex = (req, res, next) => {
//   Product.fetchAll()
//     .then(([rows, fieldData]) => {
//       res.render('shop/product-list', {
//       prods: rows,
//       pageTitle: 'Home',
//       path: '/'
//     });
// });
// }



exports.getCart = (req, res, next) => {

  const user = new User("Rafael", "guerlak@hotmail.com", [])

    user.getCart()
    .then(user => {
      res.render('shop/cart', {
        cart: user.cart,
        pageTitle: 'Cart Products',
        path: '/cart/products',
        isLoggedIn: req.session.isLoggedin
      });
    })
    .catch(err => {
      console.log(err);
    })
}


exports.postCart = (req, res, next) => {

  const prodId = req.body.productId;
  user = new User(req.user.name, req.user.email, req.user.password);
    Product.findById(prodId)
    .then(product => {

      user.addToCart(product);
      res.redirect('/cart');
  }).catch(err => 
    console.log(err));

  
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
    isLoggedIn: req.session.isLoggedin
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
