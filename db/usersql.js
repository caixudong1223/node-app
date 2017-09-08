var UserSQL = {  
    // insert:'INSERT INTO User(uid,userName) VALUES(?,?)', 
    queryAll:'SELECT * FROM actor',  
    // getUserById:'SELECT * FROM User WHERE uid = ? ',
    selectAllNum:'select count(*) as num from actor'
  };

module.exports = UserSQL;
