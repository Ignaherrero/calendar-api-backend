const express = require("express");
const { dbConection } = require("./database/config");
require("dotenv").config();
const app = express();
const cors = require("cors");

app.use(cors());

dbConection();

app.use(express.static("public"));

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

app.listen(process.env.PORT, () => {
  console.log(`servidor corriendo en el puerto ${process.env.PORT} `);
});
