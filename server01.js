var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;

var tab = []

var login = false

var id = 0

var x = 2

app.use(express.static('static'))

var path = require("path")

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true })); 

app.listen(PORT, function () { 
    console.log("start serwera na porcie " + PORT )
})

app.get("/", function (req, res) {
    if(login == false){
        res.sendFile(path.join(__dirname + "/static/main.html"))
    }else{
        res.sendFile(path.join(__dirname + "/static/mainlogin.html"))  
    }
})
app.get("/register", function (req, res) {
    if(login == false){
        res.sendFile(path.join(__dirname + "/static/register.html"))
    }else{
        res.sendFile(path.join(__dirname + "/static/registerlogin.html"))
    }
})
app.get("/login", function (req, res) {
    if(login == false){
        res.sendFile(path.join(__dirname + "/static/login.html"))
    }else{
        res.sendFile(path.join(__dirname + "/static/loginlogin.html"))  
    }
})
app.get("/admin", function (req, res) {
    if(login == false){
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    }else{
        res.sendFile(path.join(__dirname + "/static/adminlogin.html"))
    }
})
app.get("/logout", function (req, res){
    login = false
    res.redirect("/")
})

app.post("/register", function(req, res){
    var a = 1
    for(let i=0; i<tab.length; i++){
        if(tab[i].log == req.body.login){
            a = 0
        }
    }
    if(a == 1){
        id += 1
        var data = {
            id: id,
            log: req.body.login,
            pass: req.body.password,
            wiek: parseInt(req.body.wiek),
            uczen: req.body.uczen,
            plec: req.body.plec
        }
        tab.push(data)
        var send = "<p>rejestracja przebiegła pomyślnie</p>"
    }else{
        var send = "<p>login już w użytku</p>"
    }
    res.send(send)
})

app.post("/login", function(req, res){
    var b = 0
    for(let i=0; i<tab.length; i++){
        if(tab[i].log == req.body.login && tab[i].pass == req.body.password){
            b = 1
        }
    }
    if(b == 1){
        login = true
        res.redirect("/admin")
    }else{
        var send = "<p>błędne dane logowania</p>"
        res.send(send)
    }
})

app.get("/sort", function (req, res) {
    if(login == false){
        res.redirect("/admin")
    }else{
        var send = '<header id="header" style="background: #7CFC00;"> <a href="/sort">sort</a> <a href="/gender">gender</a> <a href="/show">show</a> </header>'
        if(x == 2){
            tab.sort(function (a, b) {
                return parseFloat(a.id) - parseFloat(b.id);
            });
            send += "<form action='/sort' method ='POST' onchange='this.submit()'><label>rosnąco</label><input type='radio' id='rosnaco' name='sort' value='up'><label>malejaco</label><input type='radio' id='malejaco' name='sort' value='down'><form>"
        }else if(x == 1){
            send += "<form action='/sort' method ='POST' onchange='this.submit()'><label>rosnąco</label><input type='radio' checked id='rosnaco' name='sort' value='up'><label>malejaco</label><input type='radio' id='malejaco' name='sort' value='down'><form>"
        }else{
            send += "<form action='/sort' method ='POST' onchange='this.submit()'><label>rosnąco</label><input type='radio' id='rosnaco' name='sort' value='up'><label>malejaco</label><input type='radio' checked id='malejaco' name='sort' value='down'><form>"
        }
        app.post("/sort", function(req, res){
            if(req.body.sort == "up"){
                tab.sort(function (a, b) {
                    return parseFloat(a.wiek) - parseFloat(b.wiek);
                });
                 x = 1
                res.redirect("/sort")                           
            }else{
                tab.sort(function (a, b) {
                    return parseFloat(b.wiek) - parseFloat(a.wiek);
                });
                 x = 0
                res.redirect("/sort")  
            }
        })
        send += '<table>'
        for(let i=0; i<tab.length; i++){
            let tabb = Object.entries(tab[i])
            send += '<tr>'
            send += '<th style="border: 1px solid black;">' + tabb[0][0] + ': ' + tabb[0][1] + '</th>'
            send += '<th style="border: 1px solid black;">user: ' + tabb[1][1] + ' - ' + tabb[2][1] + '</th>'
            send += '<th style="border: 1px solid black;">' + tabb[3][0] + ': ' + tabb[3][1] + '</th>'
            send += '</tr>'
        }
        send += '</table>'
        res.send(send)
        x = 2
    }
})

app.get("/gender", function (req, res) {
    if(login == false){
        res.redirect("/admin")
    }else{
        var send = '<header id="header" style="background: #7CFC00;"> <a href="/sort">sort</a> <a href="/gender">gender</a> <a href="/show">show</a> </header>'
        send += '<table>'
        for(let i=0; i<tab.length; i++){
            let tabb = Object.entries(tab[i])
            if(tabb[5][1] == "K"){
                send += '</tr>'
                send += '<th style="border: 1px solid black;">' + tabb[0][0] + ': ' + tabb[0][1] + '<th>'
                send += '<th style="border: 1px solid black;">' + tabb[5][0] + ': ' + tabb[5][1] + '<th>'
                send += '</tr>'
            }
        }    
        send += '</table>'   
        send += '<br>'
        send += '<table>'
        for(let i=0; i<tab.length; i++){
            let tabb = Object.entries(tab[i])
            if(tabb[5][1] == "M"){
                send += '<tr>'
                send += '<th style="border: 1px solid black;">' + tabb[0][0] + ': ' + tabb[0][1] + '</th>'
                send += '<th style="border: 1px solid black;">' + tabb[5][0] + ': ' + tabb[5][1] + '</th>'
                send += '</tr>'
            }
        }    
        send += '</table>'
        res.send(send)
    }
})

app.get("/show", function (req, res) {
    if(login == false){
        res.redirect("/admin")
    }else{
        tab.sort(function (a, b) {
            return parseFloat(a.id) - parseFloat(b.id);
        });
        var send = '<header id="header" style="background: #7CFC00;"> <a href="/sort">sort</a> <a href="/gender">gender</a> <a href="/show">show</a> </header>'
        send += '<table>'
        for(let i=0; i<tab.length; i++){
            let tabb = Object.entries(tab[i])
            send += '<tr>'
            send += '<th style="border: 1px solid black;">' + tabb[0][0] + ': ' + tabb[0][1] + '</th>'
            send += '<th style="border: 1px solid black;">user: ' + tabb[1][1] + ' - ' + tabb[2][1] + '</th>'
            if(tabb[4][1] == "check"){
                send += '<th style="border: 1px solid black;">' + tabb[4][0] + ': ' + '<label><input type="checkbox" checked disabled></label>' + '</th>'
            }else{
                send += '<th style="border: 1px solid black;">' + tabb[4][0] + ': ' + '<label><input type="checkbox" disabled></label>' + '</th>'
            }
            send += '<th style="border: 1px solid black;">' + tabb[3][0] + ': ' + tabb[3][1] + '</th>'
            send += '<th style="border: 1px solid black;">' + tabb[5][0] + ': ' + tabb[5][1] + '</th>'
            send += '</tr>'
        }
        send += '</table>'
        res.send(send)       
    }
})