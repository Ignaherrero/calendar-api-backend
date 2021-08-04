const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const jwtValidate = (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "no hay token en la petición",
    });
  }

  try {
    const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "token no válido",
    });
  }

  next();
};

module.exports = {
  jwtValidate,
};
