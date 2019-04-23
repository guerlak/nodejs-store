const mongo = require('mongodb');
const db = require('../util/dbconnection');
const mongoDB = db.getDb;

module.exports = class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;

  }

  save() {

    const dbConn = mongoDB();
     
    console.log("Creating on Product class...")
    return dbConn.collection('products')
      .insertOne(this)
      .then((res) => {
        return res;
      })
      .catch(err =>{
        console.log(err);
        throw err;
      })
  }

  edit() {

    const dbConn = mongoDB();
      console.log("Updating on Product class...")
      return dbConn.collection('products')

      //Id has to be an object then MongoDB can find...
      .updateOne({_id: new mongo.ObjectID(this.id)}, {$set: this})
      .then((res) => {
        return res;
      })
      .catch(err =>{
        console.log(err);
        throw err;
      })
  }
  
  static deleteById(id){

    const dbConn = mongoDB();

    return dbConn.collection('products')
      .deleteOne({_id: new mongo.ObjectID(id)})
      .catch(err =>{
        console.log(err);
        throw err;
      })
  }

  static fetchAll() {
    const dbConn = mongoDB();
    return dbConn.collection('products') 
  }

  static findById(prodId) {

    const dbConn = mongoDB();
    return dbConn.collection('products')
        .find({ _id: new mongo.ObjectID(prodId)})
        .next()
        .then(product => {
          return product;
        })
        .catch(err => {
          throw err;
        })
   
  }
};
