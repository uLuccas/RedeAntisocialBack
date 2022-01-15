const mongoose = require("mongoose");

const Usuario = mongoose.model("usuarios", {
  username: String,
  email: String,
  nome: String,
  sobrenome: String,
  senha: String,
  cidade_nasc: String,
  cidade_atual: String,
  cidade_atual: String,
  data_nasc: String,
  perfil: String,
  ativo: Boolean,
  sol_enviadas: [String],
  sol_recebidas: [String],
  logado: Boolean,
  inimizade: [String],
});

module.exports = Usuario;
