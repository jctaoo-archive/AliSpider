const {find} = require("../sql/");

const getOkData = (connection, fn) => {
    let okData = []
    find(connection, "data_xx", ["*"], (err, result) => {
        result.map(dataItem => {
            if (dataItem.isok) {
                okData.push(dataItem);
            }
        });
        fn(err, okData);
    }); 
};

module.exports = {getOkData};