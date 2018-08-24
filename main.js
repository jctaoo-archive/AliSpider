const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require("fs");
const {get} = require("./src/spider/tmfuck");

let win;

function createWindow() {
    win = new BrowserWindow({ 
        webPreferences:{webSecurity:false},
        width: 190, height: 88,autoHideMenuBar:true,resizable:false })

    win.loadURL(url.format({
        pathname: path.join(__dirname, './src/login.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

function createWindowUser() {
    win = new BrowserWindow({ 
        webPreferences:{webSecurity:false},
        width: 1080, height: 605,minHeight:605,minWidth:907,autoHideMenuBar:false })

    win.loadURL(url.format({
        pathname: path.join(__dirname, './src/user.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

function createWindowHome() {
    win = new BrowserWindow({ 
        webPreferences:{webSecurity:false},
        width: 904, height: 605,minHeight:605,minWidth:907,autoHideMenuBar:true })

    win.loadURL(url.format({
        pathname: path.join(__dirname, './src/home.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    // win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

ipcMain.on("create-home", function (event, arg) {
    let old_win = win
    win = null
    createWindowHome()
    old_win.close()
})

ipcMain.on("create-user", function (event, arg) {
    let old_win = win
    win = null
    createWindowUser()
    old_win.close()
})

ipcMain.on("attacher", function (event, arg) {
    dialog.showErrorBox('错误', '账号或密码错误')
})

ipcMain.on("save-file", function (event, arg) {
    if (!arg) {
        dialog.showErrorBox('错误', '未提取任何数据')
    } else {
        let saveStr = "";
        arg.map(dataItem => {
            saveStr += "https://item.taobao.com/item.htm?id=" + dataItem.baoid + "\n"
        })
        let filePath = "D://";
        const dialogOptions = {
            title: '保存成文件',
            filters: [
              { name: '文本文档', extensions: ['txt'] }
            ]
          }
        dialog.showSaveDialog(dialogOptions, function (files) {
            if (files) {
                filePath = files
                fs.writeFile(filePath, saveStr, function() {
                    console.log("save txt ok!!")
                    event.sender.send("saved-data", true)
                })
            }
        })
    }
})

ipcMain.on("import", function (event, arg) {
    if (arg) {
        dialog.showOpenDialog({
            properties: ['openFile']
        }, function (files) {
            if (files) {
                fs.readFile(files[0], (err, data) => {
                    if (err) {
                        return console.error(err);
                    }
                    let urls = data.toString().split("\n")
                    event.sender.send("imported", urls)
                });
            }    
        });
    }
})

ipcMain.on("import-data", function (event, arg) {
    setTimeout(function () {
        get(arg, (title, price, type, image_urls, wangwang, brand) => {
            event.sender.send("imported-data", [arg, title, price, type, image_urls, wangwang, brand])
        })
    }, 3000)
})

ipcMain.on("error-window", function (event, arg) {
    if (arg) {
        dialog.showErrorBox('错误', '未添加任何数据')
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

