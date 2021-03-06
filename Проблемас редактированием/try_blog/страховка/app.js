var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");
 
var app = express();
var jsonParser = bodyParser.json();
 
app.use(express.static(__dirname + "/public"));
// получение списка данных
app.get("/api/contents", function(req, res){
      
    var statya = fs.readFileSync("contents.json", "utf8");
    var contents = JSON.parse(statya);
    res.send(contents);
});
// получение одного пользователя по id
app.get("/api/contents/:id", function(req, res){
      
    var id = req.params.id; // получаем id
    var statya = fs.readFileSync("contents.json", "utf8");
    var contents = JSON.parse(statya);
    var content = null;
    // находим в массиве пользователя по id
    for(var i=0; i<contents.length; i++){
        if(contents[i].id==id){
            content = contents[i];
            break;
        }
    }
    // отправляем пользователя
    if(content){
        res.send(content);
    }
    else{
        res.status(404).send();
    }
});
// получение отправленных данных
app.post("/api/contents", jsonParser, function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
     
    var titleText = req.body.title;
    var contextText = req.body.context;
    var content = {title: titleText, context: contextText};
     
    var data = fs.readFileSync("contents.json", "utf8");
    var contents = JSON.parse(data);
     
    // находим максимальный id
    var id = Math.max.apply(Math,contents.map(function(o){return o.id;}))
    // увеличиваем его на единицу
    content.id = id+1;
    // добавляем пользователя в массив
    contents.push(content);
    var data = JSON.stringify(contents);
    // перезаписываем файл с новыми данными
    fs.writeFileSync("contents.json", data);
    res.send(content);
});
 // удаление пользователя по id
app.delete("/api/contents/:id", function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("contents.json", "utf8");
    var contents = JSON.parse(data);
    var index = -1;
    // находим индекс пользователя в массиве
    for(var i=0; i<contents.length; i++){
        if(contents[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        // удаляем пользователя из массива по индексу
        var content = contents.splice(index, 1)[0];
        var data = JSON.stringify(contents);
        fs.writeFileSync("contents.json", data);
        // отправляем удаленного пользователя
        res.send(content);
    }
    else{
        res.status(404).send();
    }
});
// изменение пользователя
app.put("/api/contents", jsonParser, function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    var contentId = req.body.id;
    var titleText = req.body.title;
    var contextText = req.body.context;
     
    var data = fs.readFileSync("contents.json", "utf8");
    var contents = JSON.parse(data);
    var content;
    for(var i=0; i<contents.length; i++){
        if(contents[i].id==contentId){
            content = contents[i];
            break;
        }
    }
    // изменяем данные у пользователя
    if(content){
        content.context = contextText;
        content.title = titleText;
        var data = JSON.stringify(contents);
        fs.writeFileSync("contents.json", data);
        res.send(content);
    }
    else{
        res.status(404).send(content);
    }
});
  
app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});