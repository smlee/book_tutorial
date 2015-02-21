/**
 * Created by Sangmin on 2/13/2015.
 */
var mongo = require('mongdb'),
    dbHost = '127.0.0.1',
    dbPort = 27017;

var Db = mongo.Db;
var Connection = mongo.Connection;
var Server = mongo.Server;
var db = new Db ('local', new Serever(dbHost, dbPort), {safe:true});

db.open(function(error, dbConnection) {
    if (error) {
        console.error(error);
        process.exit(1);
    }
    console.log('db state: ', db._state);
    item = {
        name: 'Azat'
    }
    dbConnection.colleciton('messages').insert(item, function(error, item) {
        if(error) {
            console.error(error);
            process.exit(1);
        }
        console.info('create/inserted: ', item);
        db.close();
        process.exit(0);
    });
});