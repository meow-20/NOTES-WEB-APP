const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.get("/", function(req, res){
    fs.readdir(`./files`, function(err, files){
        res.render("index", {files: files});
    })
})

app.post("/create", function(req, res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
        res.redirect("/");
    })
})

app.get(`/file/:filename`, function(req, res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata){
        res.render("show", {filename: req.params.filename, filedata: filedata});
        if(err) console.error(err.message);
    })
})

app.get("/edit/:filename",function(req, res){
    res.render("edit", {filename: req.params.filename});
})

app.post("/edit",function(req, res){
    fs.rename(`./files/${req.body.prev}`, `./files/${req.body.next}.txt`, function(err){
        res.redirect("/");
    });
})

app.get("/delete/:filename", function(req, res){
    fs.unlink(`./files/${req.params.filename}`, function(err){
        if(err){
            console.error(err.message);
        } else {
            console.log('File deleted successfully!');
        }
    })
    res.redirect("/");
})

app.listen(3000);