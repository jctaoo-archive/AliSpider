const insert_data = (connection, tableName, key, value, fn) => {
    let keyStr = "";
    let valueStr = "";
    key.map((keyItem,index) => {
        if (index == key.length - 1) {
            keyStr = keyStr + keyItem;
        } else {
            keyStr = keyStr + keyItem + ",";
        }
    });
    key.map((valueItem,index) => {
        if (index == key.length - 1) {
            valueStr = valueStr + "?";
        } else {
            valueStr = valueStr + "?" + ",";
        }
    });
    let insertSQL = `INSERT INTO ${tableName}(${keyStr}) VALUES(${valueStr})`;

    connection.query(insertSQL, value, function(err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }        
        
        fn(err, result);
        console.log('\n\n--------------------------INSERT----------------------------');  
        console.log('INSERT ID:',result);        
        console.log('------------------------------------------------------------\n\n');  
    });
};

const find_data = (connection, tableName, key, fn) => {
    let keyStr = "";
    key.map((keyItem,index) => {
        if (index == key.length - 1) {
            keyStr = keyStr + keyItem;
        } else {
            keyStr = keyStr + keyItem + ",";
        }
    });
    let findSQL = `SELECT ${keyStr} FROM ${tableName}`;
    connection.query(findSQL, function(err, result) {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              return;
            }
            
            fn(err, result);
            console.log('\n\n--------------------------SELECT----------------------------');
            console.log("***********,*******************,****************************,,**");
            console.log('------------------------------------------------------------\n\n');  
    });
};

const find_data_with_where = (connection, tableName, key, where, value, fn) => {
    let keyStr = "";
    let whereStr = "";
    key.map((keyItem,index) => {
        if (index == key.length - 1) {
            keyStr = keyStr + keyItem;
        } else {
            keyStr = keyStr + keyItem + ",";
        }
    });
    where.map((whereItem,index) => {
        if (index == where.length - 1) {
            whereStr = whereStr + whereItem + "=?";
        } else {
            whereStr = whereStr + whereItem + "=? and ";
        }
    });
    let findSQL = `SELECT ${keyStr} FROM ${tableName} WHERE ${whereStr}`;
    connection.query(findSQL, value, function(err, result) {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              return;
            }
            
            fn(err, result);
            console.log('\n\n--------------------------SELECT----------------------------');
            console.log("***********,*******************,****************************,,**");
            console.log('------------------------------------------------------------\n\n');  
    });
};

const find_data_with_where_and_like = (connection, tableName, key, where, value, like, likeValue, fn) => {
    let keyStr = "";
    let whereStr = "";
    let likeStr = "";
    key.map((keyItem,index) => {
        if (index == key.length - 1) {
            keyStr = keyStr + keyItem;
        } else {
            keyStr = keyStr + keyItem + ",";
        }
    });
    where.map((whereItem,index) => {
        if (index == where.length - 1) {
            whereStr = whereStr + whereItem + "=?";
        } else {
            whereStr = whereStr + whereItem + "=? and ";
        }
    });
    like.map((likeItem,index) => {
        if (index == like.length - 1) {
            likeStr = likeStr + likeItem + " like '" + likeValue[index] + "'";
        } else {
            likeStr = likeStr + likeItem + " like '" + likeValue[index] + "',";
        }
    });
    let findSQL = like.length != 0 ? `SELECT ${keyStr} FROM ${tableName} WHERE ${whereStr} and ${likeStr}`:
                                     `SELECT ${keyStr} FROM ${tableName} WHERE ${whereStr}`;
    connection.query(findSQL, value, function(err, result) {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              return;
            }
            
            fn(err, result);
            console.log('\n\n--------------------------SELECT----------------------------');
            console.log("***********,*******************,****************************,,**");
            console.log('------------------------------------------------------------\n\n');  
    });
};

const find_data_with_like = (connection, tableName, key, like, likeValue, fn) => {
    let keyStr = "";
    let likeStr = "";
    key.map((keyItem,index) => {
        if (index == key.length - 1) {
            keyStr = keyStr + keyItem;
        } else {
            keyStr = keyStr + keyItem + " and ";
        }
    });
    like.map((likeItem,index) => {
        if (index == like.length - 1) {
            likeStr = likeStr + likeItem + " like '" + likeValue[index] + "'";
        } else {
            likeStr = likeStr + likeItem + " like '" + likeValue[index] + "' and ";
        }
    });
    let findSQL = `SELECT ${keyStr} FROM ${tableName} WHERE ${likeStr}`;
    connection.query(findSQL, function(err, result) {
            if(err){
              console.log('[SELECT ERROR] - ',err.message);
              return;
            }
            
            fn(err, result);
            console.log('\n\n--------------------------SELECT----------------------------');
            console.log("***********,*******************,****************************,,**");
            console.log('------------------------------------------------------------\n\n');  
    });
};

const update_data = (connection, tableName, key, where, value, fn) => {
    let keyStr = "";
    let whereStr = "";
    key.map((keyItem,index) => {
        if (index == key.length - 1) {
            keyStr = keyStr + keyItem + "=?";
        } else {
            keyStr = keyStr + keyItem + "=?,";
        }
    });
    where.map((whereItem,index) => {
        if (index == where.length - 1) {
            whereStr = whereStr + whereItem + "=?";
        } else {
            whereStr = whereStr + whereItem + "=? and ";
        }
    });
    let updataSQL = `UPDATE ${tableName} SET ${keyStr} WHERE ${whereStr}`;

    connection.query(updataSQL, value, function (err, result) {
        if(err){
                console.log('[UPDATE ERROR] - ',err.message);
                return;
        }        

        fn(err, result);
        console.log('\n\n--------------------------UPDATE----------------------------');
        console.log('UPDATE affectedRows',result.affectedRows);
        console.log('------------------------------------------------------------\n\n');
    });
};

const findQuery = (connection, SQL, fn) => {
    connection.query(SQL, function(err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }        
        
        fn(err, result);
        console.log('\n\n--------------------------QUERY----------------------------');  
        console.log('QUERY RESULT:',result);        
        console.log('-----------------------------------------------------------\n\n');  
    });
}

module.exports = {insert_data, find_data, update_data, find_data_with_where, find_data_with_where_and_like,
                    find_data_with_like, findQuery};