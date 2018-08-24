const {getUser} = require("./getUser");
const {fiflterData} = require("./fiflterData");

const getWorkLog = (connection, fn) => {
    getUser(connection, false, (err, result) => {
        let users = {};
        let workLog = {};
        result.map(userItem => {
            users[userItem.id] = userItem.name;
        });
        fiflterData(connection, {name:"*", isok:1, delete_d:0}, Infinity, (err, result) => {
            result.map(dataItem => {
                if (!workLog[users[dataItem.userdo]]) {
                    workLog[users[dataItem.userdo]] = {};
                    workLog[users[dataItem.userdo]].count = dataItem.count;
                    workLog[users[dataItem.userdo]].okCount = dataItem.isok?1:0;
                    workLog[users[dataItem.userdo]].userId = dataItem.userdo;
                } else if (workLog[users[dataItem.userdo]]) {
                    workLog[users[dataItem.userdo]].count ++;
                    if (dataItem.isok) {
                        workLog[users[dataItem.userdo]].okCount ++;
                    }
                }
            });
            fn(err, workLog);
        })
    });
};

module.exports = {getWorkLog};