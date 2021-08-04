const { response } = require("express");
const { validationResult } = require("express-validator");
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const { generateJwt } = require("../helpers/jwt");

const createUser = async (req, res = resopnse) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "ya existe el usuario",
      });
    }
    user = new User(req.body);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();
    const token = await generateJwt(user.id, user.name);
    return res.status(201).json({
      ok: true,
      msg: "registrado",
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ ok: false, msg: "Hablar con el administrador" });
  }
};

const loginUser = async (req, res = resopnse) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });
  try {
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }
    const token = await generateJwt(user.id, user.name);
    return res
      .status(200)
      .json({ ok: "todo bien", msg: "login", name, email, token });
  } catch (e) {
    return res
      .status(500)
      .json({ ok: false, msg: "Por favor hablar con el administrador" });
  }
};

const revalidateToken = async (req, res = resopnse) => {
  const { uid, name } = req;
  const token = await generateJwt(uid, name);
  return res.json({ ok: true, uid, name, token });
};

module.exports = { createUser, loginUser, revalidateToken };
