const deleteFile = require('../util/fileHelper')

const Product = require('../models/product');
const User = require('../models/user');


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .find()
  .toArray()
  .then(prods => {
    res.render('admin/products', {
      prods: prods,
      pageTitle: "Admin | All Products",
      path: '/admin/products',
      isLoggedIn: req.session.isLoggedin
    });
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
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

  const prodId = req.query.prodId;

    Product.findById(prodId)
      .then(product => {
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          product: product,
          pageTitle: product.title,
          editMode: "true"
      })
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode(500);
      return next(error);
    });
  
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
    const error = new Error(err);
    error.httpStatusCode(500);
    return next(error);
  });
};


exports.postEditProduct = (req, res, next) => {

  const prodId = req.body.prodId;
  const title = req.body.title;
  const imageUrlInput = req.body.imageUrl;
  const imageFile = req.file;
  const price = req.body.price;
  const description = req.body.description;

  let imageUrl;

  if(imageFile){
    Product.findById(prodId)
    .then(prod => {
      deleteFile(prod.imageUrl);
    })
    .then(resutl => {
      imageUrl = '\\'+imageFile.path;

      const product = new Product(title, price, description, imageUrl);

        product.id = prodId; 

        product.edit()
          .then(result => {
              res.redirect('/admin/products');
          }).catch(err => {
              const error = new Error(err);
              error.httpStatusCode(500);
            return next(error);
          });
          })
        }

  
};


exports.postDeleteProduct = (req, res) => {

  const prodId = req.query.productId;
  console.log("Id req delete: " + prodId)
  Product.deleteById(prodId)
  .then(() => {
    res.redirect('/admin/products');
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode(500);
    return next(error);
  })
};


exports.deleteProduct = (req, res) => {

  const prodId = req.params.prodId;
  console.log("Id req delete: " + prodId)
  Product.deleteById(prodId)
  .then(() => {
    res.status(200).json({message: 'Success'})
  }).catch(err => {
    res.status(500).json({message: 'Deleet failed'});
  })
};


exports.getManageUsers = (req, res) => {

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


exports.postAdminUser = (req, res) => {
  
  const userEmail = req.body.email;

  User.turnAdmin(userEmail)
  .then(result => {
    console.log("Admin user success")
    res.redirect('/')
  }).catch(err => {
    const e = new Error(err);
    e.httpStatusCode(500)
    next(e);
  })
};




