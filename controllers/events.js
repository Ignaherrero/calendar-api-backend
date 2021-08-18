const Event = require("../models/Event");

const getEvent = async (req, res) => {
  const events = await Event.find().populate("user", "name");
  res.json({
    ok: true,
    events,
  });
};

const createEvent = async (req, res) => {
  const event = new Event(req.body);
  try {
    event.user = req.uid;
    const saveEvent = await event.save();
    res.status(200).json({
      ok: true,
      event: saveEvent,
    });
  } catch (error) {}
};

const updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const { uid } = req;
  try {
    const event = await Event.findById(eventId);

    if (!event) {
      res.status(404).json({
        ok: false,
        msg: "evento no existe",
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "no tiene privilegios para hacer esta acción",
      });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const eventUpdate = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      msg: eventUpdate,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "hablar con el administrador",
    });
  }
};

const deleteEvent = async (req, res) => {
  const eventId = req.params.id;
  const { uid } = req;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      res.status(404).json({
        ok: false,
        msg: "evento no existe",
      });
    }

    if (event.user.toString() !== req.uid) {
      return res.status(401).json({
        ok: false,
        msg: "no tiene privilegios para hacer esta acción",
      });
    }

    await Event.findByIdAndDelete(eventId, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      msg: "evento eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "hablar con el administrador",
    });
  }
};

module.exports = { getEvent, createEvent, updateEvent, deleteEvent };
