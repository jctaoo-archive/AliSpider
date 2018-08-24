const {find} = require("../sql/");

const getUser = (connection, isSelector, fn) => {
    if (!isSelector) {
        find(connection, "user_xx", ["name", "id"], fn);
    } else {
        let userStr = "";
        find(connection, "user_xx", ["name"], (err, result) => {
            result.map((userItem, userIndex) => {
                if (userIndex == 0) {
                    userStr = userStr + `<option value="all">全部</option>`;
                } else {
                    userStr = userStr + `<option value="${userIndex}">${result[userIndex-1].name}</option>`};
            });
            userStr = "<select>" + userStr + "</select>";
            fn(err, userStr);
        });
    }
};

module.exports = {getUser};