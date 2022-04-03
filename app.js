const express = require('express');
const fs = require('fs');

var app = express();
app.use('/js',express.static(__dirname+"/js"));

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