const db = require('../util/dbconnection');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {

    return db.execute('insert into products (title, price, description,imgurl) values(?, ?, ?, ?)' , [this.title, this.price,this.description, this.imageUrl]);

  }

  static deleteById(id){
    return db.execute('delete from products where id = ? ', [id]);
  }

  static fetchAll() {
    return db.execute('select * from products');
  }

  static findById(id) {
   
  }
};
