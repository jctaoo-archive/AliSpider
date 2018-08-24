const {find} = require("../sql/");

const login = (connection, fn) => {
    find(connection, "user_xx", ["name","pass","root"], fn);
};

module.exports = {login};