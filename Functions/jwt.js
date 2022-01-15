const jwt = require("jsonwebtoken");
require('dotenv').config;

exports.autorizarToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "Nenhum token fornecido!" });
  }
  jwt.verify(token, process.env.SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).send({ message: "Não autorizado" });
    }

    req._id = decoded._id;
    next();
  });
};
