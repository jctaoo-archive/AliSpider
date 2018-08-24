const {insert} = require("../sql/");

const register = (connection, name, pass, root, fn) => {
    insert(connection, "user_xx", ["name","pass","root"], [name, pass, root], fn);
}

module.exports = {register};