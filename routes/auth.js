/*
  Rutas de usuarios / Auth
  host + /api/auth
*/

const { Router } = require("express");

const router = Router();
const { check } = require("express-validator");

const {
  createUser,
  loginUser,
  revalidateToken,
} = require("../controllers/auth");
const { fieldValidator } = require("../middlewares/fieldValidator");
const { jwtValidate } = require("../middlewares/jwtValidator");

router.post(
  "/",
  [
    check("name", "es obligatorio").not().isEmpty(),
    check("email", "es obligatorio el email").isEmail(),
    check("password", "el password debe tener 6 caracteres").isLength(6),
    fieldValidator,
  ],
  loginUser
);

router.post(
  "/new",
  [
    check("name", "es obligatorio").not().isEmpty(),
    check("email", "es obligatorio el email").isEmail(),
    check("password", "el password debe tener 6 caracteres").isLength(6),
    fieldValidator,
  ],
  createUser
);

router.get("/renew", jwtValidate, revalidateToken);

module.exports = router;
