const Posts = require("../Models/Post");

exports.getFeed = async (req, res) => {
  // const { inimizades } = req.body;
  const result = await Posts.find().limit(20).sort({ _id: -1 });
  console.log(result);
  return res.json(result);
};

exports.getFeedMe = async (req, res) => {
  const { _id } = req.params;
  console.log(typeof _id);
  // const { inimizades } = req.body;
  const result = await Posts.find({ id_usuario: _id })
    .limit(20)
    .sort({ _id: -1 });
  console.log(result);
  return res.json(result);
};

exports.deletePost = async (req, res) => {
  const { _id } = req.body;
  console.log(req.body);
  const result = await Posts.deleteOne({ _id }).catch((error) => {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  });
  console.log(result);
  res.json(result);
};

exports.alterarPost = async (req, res) => {
  const { _id: idPost, picuinha } = req.body;
  // console.log(req.body);
  const result = await Posts.updateOne(
    { _id: idPost },
    { $set: { picuinha: picuinha } }
  ).catch((error) => {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  });

  if (result.acknowledged) {
    return res.status(200).json({ message: "Picuinha alterada com sucesso!" });
  }
};

exports.newPost = async (req, res) => {
  const { id_usuario, dislike, picuinha } = req.body;
  const post = new Posts({
    id_usuario: id_usuario,
    dislike: dislike,
    picuinha: picuinha,
    data_post: new Date(),
  });
  const result = await post.save();

  res.json(result);
};

exports.updateDislike = async (req, res) => {
  const { _id, idDislike } = req.body;
  const result = await Posts.findOne({ _id: _id });
  console.log(66, result);
  let allDislike = result.dislike;
  if (allDislike.includes(idDislike)) {
    const respostaboa = allDislike.filter((r) => r !== idDislike);
    console.log(70, respostaboa);
    allDislike = respostaboa;
  } else {
    allDislike.push(idDislike);
    console.log(73, allDislike);
  }
  result.dislike = allDislike;
  await result.save();
  res.json(result);
};
