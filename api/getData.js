const {findw} = require("../sql/");

const getData = (connection, fn) => {
    findw(connection, "data_xx", ["*"], ["delete_d"], [0], fn)
};

module.exports = {getData};