const {findwl} = require("../sql/");
const {findw} = require("../sql/");
const {findq} = require("../sql/");

const fiflterData = (connection, fiflter, dataCount, fn) => {
    if (fiflter.name == "*") {
        delete fiflter.name;
        let SQL = "SELECT * FROM data_xx WHERE ";
        Object.keys(fiflter).map((keyItem, keyIndex) => {
            if (keyIndex == Object.keys(fiflter).length - 1) {
                if (fiflter[keyItem] == "*") {
                    SQL = SQL + keyItem + " like '%'";
                } else {
                    SQL = SQL + keyItem + "='" + fiflter[keyItem] + "'";
                }
            } else {
                if (fiflter[keyItem] == "*") {
                    SQL = SQL + keyItem + " like '%' and ";
                } else {
                    SQL = SQL + keyItem + "='" + fiflter[keyItem] + "' and ";
                }
            }
        });
        findq(connection, SQL, (err, result) => {
            let requiredData = [];
            if (result.length <= dataCount) {
                result.map(dataItem => {
                    requiredData.push(dataItem);
                });
            } else if (result.length > dataCount) {
                for (let i = 0; i < dataCount; i ++) {
                    requiredData.push(result[i]);
                } 
            }
            fn(err, requiredData);
        });
    } else if (fiflter.name != "*") {
        findw(connection, "user_xx", ["id"], ["name"], [fiflter.name], (err, result) => {
            delete fiflter.name;
            fiflter.userdo = result[0].id;
            let likeArry = [];
            let likeValueArry = [];
            let whereArry = [];
            let valueArry = [];
            Object.keys(fiflter).map(keyItem => {
                if (fiflter[keyItem] == "*") {
                    likeArry.push(keyItem);
                    likeValueArry.push("%");
                } else {
                    whereArry.push(keyItem);
                    valueArry.push(fiflter[keyItem]);
                }
            });
            findwl(connection, "data_xx", ["*"], whereArry, valueArry, likeArry, likeValueArry, (err, result) => {
                let requiredData = [];
                if (result.length <= dataCount) {
                    result.map(dataItem => {
                        requiredData.push(dataItem);
                    });
                } else if (result.length > dataCount) {
                    for (let i = 0; i < dataCount; i ++) {
                        requiredData.push(result[i]);
                    } 
                }
                fn(err, requiredData);
            });
        });
    }
};

module.exports = {fiflterData};