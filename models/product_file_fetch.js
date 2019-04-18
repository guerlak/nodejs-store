const fs = require('fs');
const path = require('path');

const fullPath = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(fullPath, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {

    getProductsFromFile(products => {

      if (this.id) {

        console.log("classe prod de edit passando certo")
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(fullPath, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });

      } else {
        console.log("method pra addnew")
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(fullPath, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });

  }

  static deleteById(id){

    if (id) {

      console.log("classe delete passando certo");

      getProductsFromFile(products => {
        const prodToDeleteIndex = products.findIndex(prod => prod.id === this.id);
        console.log(prodToDeleteIndex)
        const updatedProducts = [...products];
        updatedProducts.splice(prodToDeleteIndex, 1);

        fs.writeFile(fullPath, JSON.stringify(updatedProducts), err => {
          console.log(err);
        });
      })

    }
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    });
  }
};
