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
        this.cart = {products: []}  
    }


    static turnAdmin(email) {
        const dbConn = mongoDB();
            console.log("Turning user admin with the email: " + email);
            return dbConn.collection('users').updateOne({"email": email, }, {$set: {"isAdmin": true} })
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

    save() {
        const dbConn = mongoDB();
            console.log("Creating on User class")
            return dbConn.collection('users')
            .insertOne(this)
    }

    updateToken(e, value) {
        const dbConn = mongoDB();
            console.log("Updating on User class");
            return dbConn.collection('users').updateOne({"email": e, }, {$set: {"resetToken": value} })
    }

    getCart (){
        const dbConn = mongoDB();
        return dbConn.collection('users')
        .findOne({email: this.email})
    }
    

    addToCart (prod, id)  {
        const dbConn = mongoDB();

        let cartProd = {...prod, quantity: {prodId: prod._id, amount: 1}};

        this.cart.products.push(cartProd);

        return dbConn.collection('users').updateOne({_id: new mongo.ObjectID(id)}, {$set: this});
    }

}

module.exports = User;