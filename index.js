require("dotenv").config();
const debug = require("debug")("principal");
const morgan = require("morgan");
const { response } = require("express");
const express = require("express");
const app = express();

const server = app.listen(5000, () => {
  console.log("Servidor levantado");
});

server.on("error", err => {
  debug(err);
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.get("/", (req, res, next) => {
  res.send("Hola");
});
app.get((req, res, next) => {
  res.status(404).send("No se ha encontrado");
});
