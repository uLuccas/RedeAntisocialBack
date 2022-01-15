const express = require('express');
const cors = require('cors');
const app = require('app');
const mongoose = require('mongoose');
const posts = require("./models/Post.js");

const connection = mongoose.connect('mongodb://localhost:27017/rede_anti_social')

app.get("/get/critica", async (req, res) => {
    const { critica } = req.body;
    console.log(critica)
    const result = await post.find({ critica });
    console.log(critica)
    return res.json(result)
});

// app.delete("/delete/critica", async (req, res) => {
//     const { critica } = req.body;
//     const result = await posts.deleteOne({ id: critica });
//     return res.json(result);

// });


// app.put("/put/critica", async (req, res) => {
//     const { critica, id } = req.body;
//     const result = await posts.updateOne({ id: id }, { critica: critica });

//     return res.json(result);

// });


// app.post("/post/critica", async (req, res) => {
//     const { idUsuario, picuinha } = req.body;
//     const result = await posts.insertOne({
//         id_usuario: idUsuario,
//         dislike: 0,
//         picuinha: picuinha,
//         critica: [],
//     });


//     return res.json(result);

// });