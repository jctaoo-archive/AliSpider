const {update} = require("../sql");

const updateDelete = (connection,id,fn) => {
    update(connection, "data_xx", ["delete_d"], ["id"], [1, id], fn)
}

module.exports = {updateDelete};