require("dotenv").config();
const debug = require("debug")("principal");
const morgan = require("morgan");
const fetch = require("node-fetch");
const { response } = require("express");
const express = require("express");
const app = express();

let respuesta = [];

const server = app.listen(5000, () => {
  console.log("Servidor levantado");
});

server.on("error", err => {
  debug(err);
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.get("/metro/lineas", (req, res, next) => {
  pedirLineas();
  res.send(respuesta);
})
app.get("/metro/linea/:num", (req, res, next) => {
  const { num } = req.params;
  res.send(num);
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

const pedirLineas = () => fetch(`${process.env.TMB_LINEAS_API}?app_id=${process.env.TMB_API_APP_ID}&app_key=${process.env.TMB_API_APP_KEY}`)
  .then(resp => resp.json())
  .then(datos => {
    respuesta = datos.features.map(({ properties: { ID_LINIA, NOM_LINIA, DESC_LINIA } }) => ({
      id: ID_LINIA,
      linea: NOM_LINIA,
      descripcion: DESC_LINIA
    }));
  });
