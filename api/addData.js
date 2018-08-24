const {insert} = require("../sql/");

const addData = (connection,baoid,title,type,price,image,wangwang,brand,fn) => {
    insert(connection, "data_xx", ["baoid","title","type","price", "count","image","wangwang","brand"], [baoid, title, type, price, 0,image,wangwang,brand], fn);
}

module.exports = {addData};