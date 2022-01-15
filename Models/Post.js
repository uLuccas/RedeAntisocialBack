const mongoose = require("mongoose");

const Posts = mongoose.model("posts", {
  id_usuario: String,
  dislike: Array,
  picuinha: String,
  data_post: { type: String, required: false, default: null },
  critica: [{
    enemy: String,
    conteudo_critica: String,
    data_critica: String,
  }],
});

module.exports = Posts;

