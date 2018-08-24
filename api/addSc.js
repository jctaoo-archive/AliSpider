const {update} = require("../sql/");

const addSc = (connection,sc,id,fn) => {
    update(connection, "data_xx", ["sc"], ["id"],[sc, id], fn)
}

module.exports = {addSc};