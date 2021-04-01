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
app.get("/metro/lineas", (req, res, next) => {
  res.send("lineas");
})
app.get("/metro/linea", (req, res, next) => {
  res.send("linea");
});
app.use((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});
