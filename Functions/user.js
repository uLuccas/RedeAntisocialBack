const { response } = require("express");
const Usuario = require("../Models/User");
let value;

const ifExist = (array, id) => {
  array.find((item) => {
    if (item === id) {
      return (value = item);
    }
  });
  return value;
};

//Usuarios
exports.getUsuario = async (req, res) => {
  try {
    const { word } = req.body;
    const usuario = await Usuario.find({
      $or: [
        { username: word },
        { nome: word },
        { sobrenome: word },
        { email: word },
      ],
    }).select(
      "-email -senha -cidade_nasc -cidade_atual -perfil -estado_civil -data_nasc -sol_enviadas -sol_recebidas -logado -ativo -inimizade"
    );

    if (usuario.length === 0) {
      console.log(usuario);
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    console.log(usuario);
    return res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.toString());
  }
};

exports.getUsuarioId = async (req, res) => {
  try {
    const { _id } = req.params;
    const usuario = await Usuario.findById({ _id: _id }).select(
      "-email -senha -cidade_nasc -cidade_atual -perfil -estado_civil -data_nasc -sol_enviadas -sol_recebidas -logado -ativo -inimizade"
    );

    console.log(usuario);
    return res.status(200).json(usuario);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.toString());
  }
};

exports.getMe = async (req, res) => {
  try {
    const usuario = await Usuario.findById({ _id: req._id }).select("-senha");
    if (!usuario) {
      console.log(usuario);
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    console.log(usuario);
    return res.status(200).json({ usuario: usuario });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.toString());
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select(
        "-email -senha -cidade_nasc -cidade_atual -perfil -estado_civil -data_nasc -sol_enviadas -sol_recebidas -logado -ativo -inimizade"
      )
      .limit(20);
    return res.status(200).json(usuarios);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};

exports.deletarUsuario = async (req, res) => {
  try {
    const { _id } = req.body;
    const usuario = await Usuario.deleteOne({ _id: _id });
    console.log(usuario);

    return res.status(200).json({ status: "Usuario deletado com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};

exports.desativarUsuario = async (req, res) => {
  try {
    const { _id } = req.body;
    const desativarPerfil = await Usuario.findByIdAndUpdate(
      { _id: _id },
      {
        ativo: false,
      }
    );

    return res.status(200).json({ status: "Usuario desativado com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const {
      _id,
      nome,
      sobrenome,
      email,
      username,
      cidade_nasc,
      cidade_atual,
      estado_civil,
      data_nasc,
      perfil,
    } = req.body;
    const atualizarUser = await Usuario.findByIdAndUpdate(
      { _id: _id },
      {
        $set: {
          nome: nome,
          sobrenome: sobrenome,
          email: email,
          username: username,
          cidade_nasc: cidade_nasc,
          cidade_atual: cidade_atual,
          estado_civil: estado_civil,
          data_nasc: data_nasc,
          perfil: perfil,
        },
      }
    );

    return res.status(200).json({ status: "Usuario atualizado com sucesso" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};

// let inimizades = [];
// let resultado;
// resultado = Usuario.findOne({ id: inimizade });
// inimizades = {
//   _id: resultado._id,
//   id: resultado.id,
//   username: resultado.username,
//   nome: resultado.nome,
//   sobrenome: resultado.sobrenome,
// };

//Inimizades

exports.getInimizades = async (req, res) => {
  try {
    const { _id } = req.params;
    const result = await Usuario.findOne({ _id: _id }).select("");
    console.log(result);
    const resultado = result.inimizade;
    console.log(resultado);
    const mapInimizades = async (resultado, index, inimizades) => {
      if (index === resultado.length) {
        return inimizades;
      }

      console.log(resultado[index])
      const response = await Usuario.findOne({ _id: resultado[index] }).select(
        "-email -senha -cidade_nasc -cidade_atual -perfil -estado_civil -data_nasc -sol_enviadas -sol_recebidas -logado -ativo -inimizade"
      );
      console.log(response);
      inimizades.push(response);
      return mapInimizades(resultado, index + 1, inimizades);
    };

    let inimigos = await mapInimizades(resultado, 0, []);
    console.log("150", inimigos);
    return res
      .status(200)
      .json({ status: "inimizades encontradas", inimizades: inimigos });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.toString());
  }
};

exports.deletarInimizade = async (req, res) => {
  try {
    const { _idlogado, _idinimigo } = req.body;
    const encontrar = await Usuario.findOne({ _id: _idlogado }).select(
      "-senha"
    );
    let inimizades = encontrar.inimizade;
    inimizades.forEach((inimigo, index) => {
      if (inimigo === _idinimigo) {
        inimizades.splice(index, 1);
      }
    });

    encontrar.save();
    console.log(encontrar);

    const encontrarIni = await Usuario.findOne({ _id: _idinimigo }).select(
      "-senha"
    );
    let inimigos = encontrarIni.inimizade;
    inimigos.forEach((inimigo, index) => {
      if (inimigo === _idlogado) {
        inimigos.splice(index, 1);
      }
    });
    encontrarIni.save();
    return res.status(200).json({ status: "Inimigo deletado com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};

exports.adicionarInimizade = async (req, res) => {
  try {
    const { _idlogado, _idinimigo } = req.body;
    const adicionar = await Usuario.findOne({ _id: _idlogado }).select(
      "-senha"
    );
    let inimizades = adicionar.inimizade;
    inimizades.push(_idinimigo);
    adicionar.save();
    console.log(adicionar);

    const adicionarIni = await Usuario.findOne({ _id: _idinimigo }).select(
      "-senha"
    );

    let inimigos = adicionarIni.inimizade;
    inimigos.push(_idlogado);
    adicionarIni.save();
    return res.status(200).json({ status: "Inimigo adicionado com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};

//Solicitacoes

exports.enviarSolicitacao = async (req, res) => {
  try {
    const { _idlogado, _idinimigo } = req.body;
    //Salvando nas solicitações recebidas do inimigo
    const enviarSol = await Usuario.findById({ _id: _idinimigo }).select(
      "-email -senha -cidade_nasc -cidade_atual -perfil -estado_civil -data_nasc -logado -ativo -inimizade"
    );

    console.log(enviarSol);
    let solEnviada = enviarSol.sol_recebidas;
    let solRecebida = enviarSol.sol_enviadas;
    if (
      ifExist(solEnviada, _idinimigo) === _idinimigo ||
      ifExist(solRecebida, _idinimigo) === _idinimigo
    ) {
      return res
        .status(400)
        .json({ erro: "Essa solicitação já foi enviada" });
    }
    solEnviada.push(_idlogado);
    enviarSol.save();
    //Salvando nas solicitaçoes enviadas de quem está logado
    const salvarSol = await Usuario.findById({ _id: _idlogado }).select(
      "-email -senha -cidade_nasc -cidade_atual -perfil -estado_civil -data_nasc -sol_recebidas -logado -ativo -inimizade"
    );
    let solEnvSalva = salvarSol.sol_enviadas;
    solEnvSalva.push(_idinimigo);
    salvarSol.save();
    return res.status(200).json({ status: "Solicitação enviada com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};

exports.deletarSolicitacao = async (req, res) => {
  try {
    const { _idlogado, _idinimigo } = req.body;
    //Deletando nas solicitações recebidas do inimigo
    const encontrarSol = await Usuario.findById({ _id: _idinimigo }).select(
      "-email -senha -cidade_nasc -cidade_atual -perfil -estado_civil -data_nasc -sol_enviadas -logado -ativo -inimizade"
    );

    let solEncontrada = encontrarSol.sol_recebidas;
    console.log(solEncontrada);
    if (!ifExist(solEncontrada, _idlogado)) {
      return res
        .status(400)
        .json({ status: "Essa solicitação já foi cancelada" });
    }
    solEncontrada.forEach((id, index) => {
      if (id === _idlogado) {
        solEncontrada.splice(index, 1);
      }
    });
    // console.log(solEncontrada)
    encontrarSol.save();
    //Deletando nas solicitaçoes enviadas de quem está logado
    const deletarSolEnv = await Usuario.findById({ _id: _idlogado }).select(
      "-email -senha -cidade_nasc -cidade_atual -perfil -estado_civil -data_nasc -sol_recebidas -logado -ativo -inimizade"
    );
    let delSolicitacao = deletarSolEnv.sol_enviadas;
    delSolicitacao.forEach((id, index) => {
      if (id === _idinimigo) {
        delSolicitacao.splice(index, 1);
      }
    });
    deletarSolEnv.save();
    return res
      .status(200)
      .json({ status: "Solicitação cancelada com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ erro: error.toString() });
  }
};
