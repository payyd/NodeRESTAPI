const mysql = require('mysql');
const config = require('config');
const dbConfig = config.get('User.dbConfig')
function sqlConnection(){
    
    /*
    var mysqlConnection = mysql.createConnection({
    host: '192.168.56.92',
    user: 'user1',
    password: 'user1password',
    database: 'new_schema',
    port: '3308',
    multipleStatements: true
    });
    */
    var mysqlConnection = mysql.createConnection(dbConfig);
    mysqlConnection.connect((err)=> {
        if(!err)
        console.log('Connection Established Successfully');
        else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
        });
    
    return mysqlConnection;
    }
    
    
    
    
module.exports = sqlConnection;