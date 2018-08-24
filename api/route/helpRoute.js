const {getType} = require("../getType");
const {getUser} = require("../getUser");
const {getLastId} = require("../getLastId");

const start_help_about_api = (connection, app) => {
    app.get('/help/get-type', (req, res) => {
        let typeStr;
        if (req.query.isSelector) {
            typeStr = getType(true);
        } else {
            typeStr = getType();
        }
        res.send({ok:true,data:typeStr});
    });

    app.get('/help/get-user', (req, res) => {
        if (req.query.isSelector) {
            getUser(connection, true, (err, data) => {
                if (err == null) {
                    res.send({ok:true,data:data});
                } else {
                    res.send({ok:true,data:-1});
                }
            });
        } else {
            getUser(connection, false, (err, data) => {
                if (err == null) {
                    res.send({ok:true,data:data});
                } else {
                    res.send({ok:true,data:-1});
                }
            });
        }
    });

    app.get("/help/get-last-id", (req, res) => {
        getLastId(connection, (err, data) => {
            if (err == null) {
                res.send({ok:true,data:data[data.length - 1].id});
            } else {
                res.send({ok:true,data:-1});
            }
        })
    })
}

module.exports = {start_help_about_api};
