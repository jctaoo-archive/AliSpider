const {register} = require("../register");
const {login} = require("../login");
const {getData} = require("../getData");
const {doWork} = require("../doWork");
const {getWorkLog} = require("../getWorkLog");
const {getOkData} = require("../getOkData");
const {fiflterData} = require("../fiflterData");
const {addData} = require("../addData");
const {addSc} = require("../addSc");
const {updateDelete} = require("../updateDelete");

const {getType} = require("../getType");
const {getUser} = require("../getUser");

const start_user_about_api = (connection, app) => {
    app.post('/register', (req,res) => {
        register(connection, req.body.name, req.body.pass, "0", (err, result) => {
            if (err == null) {
                res.send({ok:true});
            } else {
                res.send({ok:false});
            }
        });
    });
    app.post('/login', (req,res) => {
        login(connection, (err, result) => {
            if (err == null) {
                for (let i = 0; i < result.length; i ++) {
                    if (req.body.name == result[i].name && req.body.pass == result[i].pass && result[i].root == 1) {
                        res.send({ok:true,state:0,isRoot:true});
                        break;
                    } else if (req.body.name == result[i].name && req.body.pass == result[i].pass) {
                        res.send({ok:true,state:0,isRoot:false});
                        break;
                    } else if (i == result.length - 1 && req.body.name != result[i].name) {
                        res.send({ok:true,state:1,isRoot:false});
                        break;
                    }
                }
            } else {
                res.send({ok:false,state:-1,isRoot:false});
            }
        })
    });
}

const start_data_about_api = (connection, app) => {
    app.post('/get-data', (req,res) => {
        getData(connection, (err, result) => {
            if (err == null) {
                let data = [];
                for (let i = 0; i < result.length; i ++) {
                    if (!result[i].count) {
                        data.push(result[i]);
                    }
                    if (data.length == req.body.requireDataCount) {
                        break;
                    }
                }
                res.send({ok:true,data:data});
            } else {
                res.send({ok:false,data:-1});
            }
        })
    });
    app.post('/do-work', (req,res) => {
        doWork(connection, req.body.dataId, req.body.isok, req.body.userdo, (err, result) => {
            if (err == null) {
                if (result.affectedRows == 0) {
                    res.send({ok:true,state:1});
                } else if (result.notFound == true) {
                    res.send({ok:true,state:2});
                } else {
                    res.send({ok:true,state:0});
                }
            } else {
                res.send({ok:false,state:-1});
            }
        })
    });
    app.post('/get-work-log', (req,res) => {
        getWorkLog(connection, (err, result) => {
            if (err == null) {
                res.send({ok:true,data:result});
            } else {
                res.send({ok:false,data:-1});
            }
        })
    });
    app.post('/get-ok-data', (req,res) => {
        getOkData(connection, (err, result) => {
            if (err == null) {
                res.send({ok:true,data:result});
            } else {
                res.send({ok:false,data:-1});
            }
        })
    })
    app.post('/get-all-data', (req,res) => {
        getData(connection, (err,result) => {
            if (err == null) {
                res.send({ok:true,data:result});
            } else {
                res.send({ok:false,data:-1});
            }
        })
    })
    app.post('/get-sta', (req,res) => {
        getData(connection, (err,result) => {
            if (err == null) {
                count = result.length;
                disokCount = 0;
                okCount = 0;
                result.map(dataItem => {
                    if (!dataItem.isok) {
                        disokCount ++;
                    }
                });
                okCount = count - disokCount;
                res.send({ok:false,data:[disokCount,okCount]});
            } else {
                res.send({ok:false,data:-1});
            }
        });
    });
    app.post('/fiflter-data', (req, res) => {
        let type = "";
        if (req.body.type == "*") {
            type = "*"
        } else {
            type = getType()[req.body.type - 1];
        }
        fiflterData(connection, {type:type, name:req.body.name, isok:1, sc:req.body.sc, delete_d:0}, req.body.dataCount, (err, result) => {
            if (err == null) {
                res.send({ok:false,data:result});
            } else {
                res.send({ok:false,data:-1});
            }
        });
    });
    app.post('/fiflter-data-no-isok', (req, res) => {
        let type = "";
        if (req.body.type == "*") {
            type = "*"
        } else {
            type = getType()[req.body.type - 1];
        }
        fiflterData(connection, {type:type, name:req.body.name, count:0, delete_d:0}, req.body.dataCount, (err, result) => {
            if (err == null) {
                res.send({ok:false,data:result});
            } else {
                res.send({ok:false,data:-1});
            }
        });
    });
    app.post('/add-data', (req, res) => {
        addData(connection, req.body.baoid, req.body.title, req.body.type, req.body.price, req.body.image, req.body.wangwang, req.body.brand, (err, result) => {
            if (err == null) {
                res.send({ok:false,data:0});
            } else {
                res.send({ok:false,data:-1});
            }
        })
    })
    app.post('/add-sc', (req, res) => {
        addSc(connection, req.body.sc, req.body.id, (err, result) => {
            if (err == null) {
                res.send({ok:false,data:0});
            } else {
                res.send({ok:false,data:-1});
            }
        })
    })
    app.post('/update-delete', (req, res) => {
        updateDelete(connection, req.body.id, (err, result) => {
            if (err == null) {
                res.send({ok:false,data:0});
            } else {
                res.send({ok:false,data:-1});
            }
        })
    })
}

module.exports = {start_user_about_api, start_data_about_api};