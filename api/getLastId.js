const {find} = require("../sql/");

const getLastId = (connection, fn) => {
    find(connection, "data_xx", ["id"], fn)
};

module.exports = {getLastId};