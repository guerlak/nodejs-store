// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'store-nodejs',
//     password: 'aloha99'
// })

// module.exports = pool.promise();

const mongoDB = require('mongodb');
const MongoClient = mongoDB.MongoClient;

let _db;

const mongoConn = (cb) => {
    MongoClient.connect("mongodb+srv://guerlak:aloha99@cluster01-p5wzr.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })
.then(client => {
    console.log("MongoDB: Connected");
    _db = client.db();
    cb(client);
})
.catch(err => {
    console.log(err);
    throw err;
});
}

const getDb = () =>{
    if(_db){
        return _db;
    }else{
    throw  "No database found..."
    }
}

exports.mongoConn = mongoConn;
exports.getDb = getDb;

