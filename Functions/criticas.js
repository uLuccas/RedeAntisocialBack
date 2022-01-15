const Posts = require("../Models/Post");
const mongoose = require("mongoose");

exports.getCriticas = async (_, res) => {
  const result = await Posts.find({});
  const resultado = result.map((post) => {
    return post.critica;
  });
  console.log(resultado);
  return res.json(resultado);
};

exports.updateCriticas = async (req, res) => {
  const { _id, id, conteudo_critica } = req.body;
  const result = await Posts.findOne({ _id: _id });
  const resultadoFinal = result.critica.forEach((item) => {
    if (item.id === id) {
      item.conteudo_critica = conteudo_critica;
    }
    console.log(item);
  });
  result.save();
  return res.json(resultadoFinal);
};

exports.deleteCriticas = async (req, res) => {
  const { _idPost, _idCritica } = req.body;
  const result = await Posts.findOne({ _id: _idPost });
  const resultadoFinal = result.critica.forEach((item, index) => {
    console.log(item._id.toString());
    console.log(_idCritica);
    if (item._id.toString() === _idCritica) {
      console.log("found");
      result.critica.splice(index, 1);
    }
  });
  // console.log("result");
  // console.log(result);
  await result.save();
  // console.log(35, resultadoFinal);
  return res.json(resultadoFinal);
};

exports.postCriticas = async (req, res) => {
  const { _id, enemy, conteudo_critica } = req.body;
  const criticaNova = {
    enemy: enemy,
    conteudo_critica: conteudo_critica,
    data_critica: new Date(),
  };
  const result = await Posts.findOne({ _id: _id });
  console.log(result);
  console.log(result.critica);
  const resultadoFinal = result.critica.push(criticaNova);
  console.log(resultadoFinal);
  result.save();
  return res.json(resultadoFinal);
};


