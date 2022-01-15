const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fs.mkdirSync(`./images/${req._id}`);
    console.log(req._id);
    cb(null, `images/${req._id}`);
  },
  filename: function (req, file, cb) {
    cb(null, req._id + "-" + file.fieldname + ".png");
  },
});

const upload = multer({ storage: storage });

const {
  getUsuario,
  getUsuarios,
  deletarInimizade,
  adicionarInimizade,
  enviarSolicitacao,
  deletarSolicitacao,
  deletarUsuario,
  atualizarUsuario,
  getInimizades,
  getMe,
  desativarUsuario,
  getUsuarioId,
} = require("../Functions/user");

const {
  login,
  cadastrar,
  trocarSenha,
  imagemPerfil,
  imagemCapa,
} = require("../Functions/login");
const { autorizarToken } = require("../Functions/jwt");

router.get("/inimizades/:_id", autorizarToken, getInimizades);
router.get("/usuarioId/:_id", autorizarToken, getUsuarioId);
router.post("/cadastrar", cadastrar);
router.get("/usuarios", autorizarToken, getUsuarios);
router.get("/me", autorizarToken, getMe);
router.post("/usuario", autorizarToken, getUsuario);
router.delete("/deletarUsuario", autorizarToken, deletarUsuario);
router.put("/atualizarUsuario", autorizarToken, atualizarUsuario);
router.put("/desativarPerfil", autorizarToken, desativarUsuario);
router.put("/trocarSenha", trocarSenha);
router.post("/login", login);
router.delete("/deletarInimizade", autorizarToken, deletarInimizade);
router.post("/adicionarInimizade", autorizarToken, adicionarInimizade);
router.post("/enviarSolicitacao", autorizarToken, enviarSolicitacao);
router.delete("/deletarSolicitacao", autorizarToken, deletarSolicitacao);
router.post(
  "/imagemPerfil",
  autorizarToken,
  upload.single("perfil"),
  imagemPerfil
);
router.post("/imagemCapa", autorizarToken, upload.single("capa"), imagemCapa);

router.get("/imagemPerfil/:_id", autorizarToken, (req, res) => {
  try {
    const { _id } = req.params;
    let resp = fs.readdirSync(`./images/${_id}`);
    let resposta;
    resposta = resp.filter((item) => {
      return item.includes("perfil");
    });
    console.log(req.file.path + _id + resposta);
    res.sendFilePath(req.file.path + _id + resposta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ erro: error.toString() });
  }
});

module.exports = router;

// Back: Rotas

// rotas usuarios {
//     get: {inimizades, solicitacoes_enviadas, solicitacoes_recebidas, usuarios, usuario}
//     post: {usuario, inimizade}
//     put: {usuario, inimizade}
//     delete: {usuario, inimizade}
