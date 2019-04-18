const fs = require('fs');
const path = require('path');

const cartPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

const getCartFromFile = cb => {
  fs.readFile(cartPath, (err, fileContent) => {
    if (err) {
      cb({});
    } else {
      console.log("passar certo a pegar file")
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(cartPath, (err, fileContent) => {
      let cart = { products: [],
                  totalPrice: 0 
                  };
      if (!err) {
        console.log("File cart.json format problem...")
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );

      const existingProduct = cart.products[existingProductIndex];
    
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;

      } else {

        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
        
      }
      cart.totalPrice = cart.totalPrice + +productPrice;

      fs.writeFile(cartPath, JSON.stringify(cart), err => {
        console.log("error >> " + err);
      });
    });
  }

  static getCart(cb){
    getCartFromFile(function(cart){
      cb(cart);
    })
  }

};
