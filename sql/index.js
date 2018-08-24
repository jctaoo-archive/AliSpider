const {insert_data, find_data, update_data, find_data_with_where, 
    find_data_with_where_and_like, find_data_with_like, findQuery} = require("./opreations");

const insert = insert_data;
const find = find_data;
const update = update_data;
const findw = find_data_with_where;
const findwl = find_data_with_where_and_like;
const findwlo = find_data_with_like;
const findq = findQuery;

module.exports = {insert, find, update, findw, findwl, findwlo, findq};