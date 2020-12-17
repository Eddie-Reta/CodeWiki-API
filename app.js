const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// mongoose.connect("mongodb+srv://admin-eduardo:spiderman3@data.gkght.mongodb.net/wikiDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

 mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true} );

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("article", articleSchema);

// app.get("/articles", function(req, res){

//     Article.find(function(err, foundArticles){
//         if (err) {
//             console.log(err);
//         } else {
//             res.send(foundArticles);
//         }
//     });
// });

// app.post("/articles", function(req, res){
//     console.log(req.body.title);
//     console.log(req.body.content);

//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save(function(err){
//         if (!err) {
//             console.log("Added new article.");
//         } else {
//             console.log(err)
//         }
//     });
// });

// app.delete("/articles", function(req, res){
//     Article.deleteMany(function(err){
//         if (!err) {
//             console.log("Articles are deleted.");
//         } else {
//             console.log(err);
//         }
//     });
// });

///Request targeting all articles.

app.route("/articles")

    .get(
        function(req, res){
        Article.find(function(err, foundArticles){
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(foundArticles);
                    }
                });
    })

    .post(
        function(req, res){
            console.log(req.body.title);
            console.log(req.body.content);
        
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });
        
            newArticle.save(function(err){
                if (!err) {
                    res.send("Added new article.");
                } else {
                    res.send(err)
                }
            });
    })

    .delete(
        function(req, res){
        Article.deleteMany(function(err){
                    if (!err) {
                        res.send("Articles are deleted.");
                    } else {
                        res.send(err);
                    }
                });
    });

    //////////// Requeat targeting specific article

app.route("/articles/:articleTitle")

.get(
    function(req, res){

   // const articleTitle = req.params.articleTitle;

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles with that title found!");
        }
    });
})

.put(
    function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                res.send("Successfully updated article.");
            }
        );
})

.patch(
    function(req,res){
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if (!err) {
                    res.send("Successfully updated article.");
                }
            }
        )
    }
)

.delete(
    function(req, res){

        Article.deleteOne(
            {title: req.params.articleTitle}, 
            function(err){
                if(!err) {
                    res.send("Successfully deleted article.");
                } else {
                    console.log(err)
                }
            });

        // Article.findByIdAndDelete(
        //     {_id: req.params._id}, 
        //     function(err){
        //         if (!err) {
        //             res.send("Successfully deleted article.")
        //         }
        //     })
});

app.listen(3000, function(){
    console.log("Successfully started on port 3000!")
});
