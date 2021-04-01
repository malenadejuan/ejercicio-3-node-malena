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
app.get("/metro/lineas", (req, res, next) => {
  res.send("lineas");
});
app.put("/:parametro?", (req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
});
app.post("/:parametro?", (req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
});
app.delete("/:parametro?", (req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
});
app.use((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});
app.use((err, req, res, next) => {
  debug(err);
  res.status(500).json({ error: true, mensaje: "Error general" });
})
