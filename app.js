const express = require("express");
const parser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
mongoose.set("strictQuery",false);
app.set("view engine","ejs");
app.use(parser.urlencoded({extended : true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost: 27017/todoDB");
const itemSchema = new mongoose.Schema({
    name : String
});

const listSchema = new mongoose.Schema({
    name : String,
    items : [itemSchema]
});

const List = mongoose.model("list",listSchema);
const Item = mongoose.model("item",itemSchema);
var defaultitem = new Item({
    name : "Work"
});
app.get("/",function(req,res){
    Item.find(function(err,docs){
        if(err){
            console.log(err);
        }
        else{
            res.render("list",{title : "Today", newitems : docs});
        }
    })
})

app.get("/:listname",function(req,res){
    const listname = req.params.listname;
    List.find({name : listname}, function(err,results){
        if(!err){
            if(results.length === 0){
                const lst = new List({
                    name : listname,
                    items : [] 
                });
                lst.save(); 
            res.render("list",{title : lst.name, newitems : lst.items});
            }
            else{
                res.render("list",{title : listname, newitems : results[0].items});
            }
        }
    })
    

})
app.post("/",function(req,res){
    var temp = req.body.item1;
    var item = new Item({
        name : temp
    });
    item.save();
    if(req.body.list === "Work"){
        res.redirect("/work");
    }
    else{
        res.redirect("/");
    }
    
})
app.post("/delete",function(req,res){
    const id = req.body.cbox
    Item.deleteOne({name : id},function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Success");
        }
    })
    res.redirect("/");
})
app.get("/about",function(req,res){
    res.render("about");
})
app.listen(3000,function(){
    console.log("Server is running");
})