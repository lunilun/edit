import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import path from 'path';
const __dirname = path.resolve();

const express = require('express');
const fs = require('fs');

var app = express();

app.use(express.urlencoded({limit:'50mb' ,extended: true, parameterLimit:50000}));
app.use(express.json({limit:'50mb'}));

app.use('/js', express.static(__dirname + "/js"));
app.use('/Img', express.static(__dirname + "/Img"));
app.use('/css', express.static(__dirname + "/css"));

var port = process.env.PORT || 3000; 

app.listen(port, function(){ 
    console.log(`App Listening on port `+port); 
});

app.get("/",(req,res)=>{
    fs.readFile("index.html",(err,data)=>{
        if(err){
            res.writeHead(404,{"Content-Type":"text/plain"}); 
            res.write("404 ERROR"); 
            res.end();

        }else{
            res.writeHead(200,{"Content-Type":"text/html"})
            res.end(data);
        }
    })
})

app.post("/save", (req, res) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${req.body.title}.svg`, `${req.body.content}`, 'utf8', (err,data) => {
            if(err){
                reject(err.message);
            }
            else {
                data="save"
                resolve(res.json(data));
            }
        })
    })
});

//test
app.get("/test2",(req,res)=>{
    fs.readFile("test2.html",(err,data)=>{
        if(err){
            res.writeHead(404,{"Content-Type":"text/plain"}); 
            res.write("404 ERROR"); 
            res.end();

        }else{
            res.writeHead(200,{"Content-Type":"text/html"})
            res.end(data);
        }
    })
})
