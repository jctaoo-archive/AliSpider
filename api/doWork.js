const {update} = require("../sql/");
const {findw} = require("../sql/");

const doWork = (connection, dataId, isok, userdo, fn) => {
    findw(connection, "user_xx", ["name"], ["id"], [userdo], (err, result) => {
        if (result.length != 0) {
            update(connection, "data_xx", ["count","isok","userdo"], ["baoid"], [1,isok,userdo,dataId], fn);
        } else if (result.length == 0) {
            fn(null, {notFound:true});
        }
    }); 
};

module.exports = {doWork};