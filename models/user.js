const mongo= require('mongodb');
const db = require('../util/dbconnection');
const mongoDB = db.getDb;

class User {

    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
        this.resetToken = "";
        this.resetTokenExpiration = "";
        this.isAdmin = false;
        this.cart = {products: []};
    }

    save() {
        const dbConn = mongoDB();
            console.log("Creating on User class")
            return dbConn.collection('users')
            .insertOne(this)
    }

    update(e, value) {
        const dbConn = mongoDB();
            console.log("Updating on User class");
            console.log(this);
            console.log(value + "  " + e)
            return dbConn.collection('users').updateOne({"email": e, }, {$set: {"resetToken": value} })
    }

    static fetchAll() {
        const dbConn = mongoDB();
    
        return dbConn.collection('users')
            .find()
            .toArray()
            .then(users =>{
              return users;
            })
            .catch(err => {
              console.log(err);
            })
      }

    addToCart (prod)  {
        const dbConn = mongoDB();
        this.cart.products.push(prod);
        console.log(this._id)
        return dbConn.collection('users').updateOne({_id: new mongo.ObjectID(this._id)}, {$set: this});
    }

    getCart (){
        const dbConn = mongoDB();
        return dbConn.collection('users')
        .findOne({email: this.email})
    }
    
    static findUserById(userId){

        const dbConn = mongoDB();

        return dbConn.collection('users')
            .findOne({_id: new mongo.ObjectID(userId)})

    }

    static findUserByEmail(emailArg){
        const dbConn = mongoDB();
        return dbConn.collection('users')
            .findOne({email: emailArg})
    }
}

module.exports = User;