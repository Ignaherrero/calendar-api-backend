/*
Event Routes
/api/events
 */
const { Router } = require("express");
const { check } = require("express-validator");
const {
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { fieldValidator } = require("../middlewares/fieldValidator");
const { jwtValidate } = require("../middlewares/jwtValidator");
const router = Router();

router.use(jwtValidate);

router.get("/", getEvent);
router.post(
  "/",
  [
    check("title", "el titulo es obligatorio").not().isEmpty(),
    check("start", "fecha de inicio es obligatoria").custom(isDate),
    check("end", "fecha de finalización es obligatoria").custom(isDate),
    fieldValidator,
  ],
  createEvent
);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
