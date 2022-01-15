const Usuario = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
// const multer = require('multer');
// const upload = multer({dest:'images/'});
require("dotenv").config();

exports.cadastrar = async (req, res) => {
  try {
    const { nome, sobrenome, username, email, senha } = req.body;
    if (!nome || !sobrenome || !username || !email || !senha) {
      return res.status(500).json({ erro: "Existem campos não preenchidos" });
    }
    const buscar = await Usuario.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (buscar) {
      return res.status(400).json({ erro: "Usuário já existe" });
    }
    const criar = new Usuario({
      nome: nome,
      sobrenome: sobrenome,
      username: username,
      email: email,
      senha: bcrypt.hashSync(
        senha,
        bcrypt.genSaltSync(parseInt(process.env.ITERATIONS))
      ),
    });
    const response = await criar.save();
    response.senha = undefined;
    return res.status(200).json({ user: response });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.toString());
  }
};

exports.login = async (req, res) => {
  try {
    const { user, senha } = req.body;
    if (!user || !senha)
      return res.status(400).json({ status: "Campo inválido" });
    const login = await Usuario.findOne({
      $or: [{ username: user }, { email: user }],
    });
    console.log(login);
    if (!login) {
      return res.status(400).json({ status: "Usuário não encontrado" });
    }
    const senhaValida = bcrypt.compareSync(senha, login.senha);
    if (!senhaValida) {
      return res
        .status(401)
        .json({ status: "Senha inválida", accessToken: null });
    }
    login.senha = undefined;
    const logado = await Usuario.findByIdAndUpdate(
      { _id: login._id },
      { logado: true }
    );

    if (logado) login.logado = true;
    const token = jwt.sign({ _id: logado._id }, process.env.SECRET, {
      expiresIn: 8000,
    });
    console.log(login);
    const usuario = login;
    return res.status(200).json({ usuario, accessToken: token });
  } catch (error) {
    console.log(" ERROR ");
    console.log(error);
    res.status(500).json({ erro: error.toString() });
  }
};

exports.trocarSenha = async (req, res) => {
  try {
    const { username, email, senha } = req.body;
    const usuario = await Usuario.findOneAndUpdate(
      { $and: [{ username: username }, { email: email }] },
      {
        senha: bcrypt.hashSync(
          senha,
          bcrypt.genSaltSync(parseInt(process.env.ITERATIONS))
        ),
      }
    );
    if (!usuario) {
      res.status(400).json({ erro: "Username ou email incorretos." });
    }
    res
      .status(200)
      .json({ status: "Senha trocada com sucesso, faça login novamente" });
  } catch (error) {
    console.log(error);
  }
};

exports.imagemPerfil = async (req, res) => {
  try {
    if (req.file) {
      return res.status(200).json({ image: req.file });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};

exports.imagemCapa = async (req, res) => {
  try {
    if (req.file) {
      return res.status(200).json({ image: req.file });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};
