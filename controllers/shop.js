const fs = require('fs');
const path = require('path');

const PDFDocument = require('pdfkit');
const Product = require('../models/product');
const User = require('../models/user');

const pdfDoc = new PDFDocument();

const ITEMS_PER_PAGE = 3;

exports.getIndex = (req, res, next) => {

  const page = req.query.page || 1;
  let totalItems;

  Product.fetchAll()
  .countDocuments()
  .then(numProducts => {

    totalItems = numProducts
    return Product
      .fetchAll()
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .toArray()
  })
  .then((products) => {
      res.render('index', {
        prods: products,
        pageTitle: 'Home',
        path: '/',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * Number.parseInt(page) < totalItems,
        hasPreviousPage: Number.parseInt(page) > 1,
        nextPage: Number.parseInt(page) + 1,
        previousPage: Number.parseInt(page) - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })
  .catch(err => {
    const error = new Error(err);
    next(error);
  });
}



exports.getProducts = (req, res, next) => {

  const page = req.query.page || 1;
  let totalItems;

  Product.fetchAll()
  .countDocuments()
  .then(numProducts => {

    totalItems = numProducts
    return Product
      .fetchAll()
      .find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .toArray()
  })
  .then((products) => {
      res.render('index', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * Number.parseInt(page) < totalItems,
        hasPreviousPage: Number.parseInt(page) > 1,
        nextPage: Number.parseInt(page) + 1,
        previousPage: Number.parseInt(page) - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })
  .catch(err => {
    const error = new Error(err);
    next(error);
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

  User.findUserById(req.session.user._id)
  .then(user => {

    console.log(user.cart)
      res.render('shop/cart', {
        cart: user.cart,
        pageTitle: 'Cart Products',
        path: '/cart',
        isLoggedIn: req.session.isLoggedin
      });
    })
}


exports.postCart = (req, res, next) => {

  const prodId = req.body.productId;
    user = new User(req.user.name, req.user.email, req.user.password);
    user.cart = req.user.cart;
    user.id = req.user._id;
    Product.findById(prodId)
    .then(product => {
      user.addToCart(product, user.id);
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

exports.getOrderDocument = (req, res, next) => {

  const orderId = req.params.orderId;
  const invoiceName = "invoice-" + orderId + ".pdf";
  const invoicePath = path.join('data', 'invoices', invoiceName);

  // fs.readFile(invoicePath, (err, data)=>{
  //   if(err){
  //     return next(err);
  //   }

  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
  //   res.send(data)
  // })

  //increase performance to avoid download the whole file before send to the nav
  // const file = fs.createReadStream(invoicePath);
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
  //   file.pipe(res);

  const pdfDoc = new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  pdfDoc.text('Hello World Guerlak');
  pdfDoc.end();

};
