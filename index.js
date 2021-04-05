require("dotenv").config();
const debug = require("debug")("principal");
const morgan = require("morgan");
const fetch = require("node-fetch");
const { response } = require("express");
const express = require("express");
const app = express();

let lineasAPI;
let paradasAPI;
let respuestaLineas;
let codigoLinea;

const server = app.listen(5000, () => {
  console.log("Servidor levantado");
});


const pedirLineas = () => fetch(`${process.env.TMB_LINEAS_API}?app_id=${process.env.TMB_API_APP_ID}&app_key=${process.env.TMB_API_APP_KEY}`)
  .then(resp => resp.json())
  .then(datos => lineasAPI = datos.features);

const conseguirCodigo = nombreLineaBuscada => {
  pedirLineas()
    .then(lineasAPI => lineasAPI.find(linea => linea.properties.NOM_LINIA === nombreLineaBuscada))
    .then(linea => codigoLinea = linea.properties.CODI_LINIA)
    .then(codigo => pedirParadas(codigo, nombreLineaBuscada))
}

const pedirParadas = (codigoLinea, nombreLineaBuscada) =>
  fetch(`${process.env.TMB_LINEAS_API}/${codigoLinea}/estacions/?app_id=${process.env.TMB_API_APP_ID}&app_key=${process.env.TMB_API_APP_KEY}`)
    .then(resp => resp.json())
    .then(datos => {
      let linea = respuestaLineas.find(linea => linea.linea === nombreLineaBuscada);
      paradasAPI = ({
        linea: linea.linea,
        descripcion: linea.descripcion,
        paradas:
          datos.features.map(linea => (
            {
              id: linea.properties.ID_ESTACIO_LINIA,
              nombre: linea.properties.NOM_ESTACIO
            }
          ))
      })
    }
    );

const devolverLineas = () =>
  pedirLineas()
    .then(() => {
      respuestaLineas = lineasAPI.map(({ properties: { ID_LINIA, NOM_LINIA, DESC_LINIA } }) => ({
        id: ID_LINIA,
        linea: NOM_LINIA,
        descripcion: DESC_LINIA
      }));
    });

devolverLineas();

server.on("error", err => {
  debug(err);
});

app.use(morgan("dev"));
app.use(express.static("public"));
app.get("/metro/lineas", (req, res, next) => {
  res.send(respuestaLineas);
})
app.get("/metro/linea/:num", (req, res, next) => {
  const { num } = req.params;
  conseguirCodigo(num);
  res.send(paradasAPI);
});
app.put("/*", (req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
});
app.post("/*", (req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
});
app.delete("/*", (req, res, next) => {
  res.status(403).json({ error: true, mensaje: "Te pensabas que podías hackerme" });
});
app.use((req, res, next) => {
  res.status(404).json({ error: true, mensaje: "Recurso no encontrado" });
});
app.use((err, req, res, next) => {
  debug(err);
  res.status(500).json({ error: true, mensaje: "Error general" });
});
