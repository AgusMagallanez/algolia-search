import * as express from "express";
import { sequelize } from "./db";
import { index } from "./lib/algolia";
import { Comercio } from "./db/comercio";

index
  .search("", {
    aroundLatLng: "-37.32422,-59.1158882",
    aroundRadius: 10000,
  })
  .then((res) => {
    console.log(res);
  });

// index
//   .saveObject({
//     objectID: "2",
//     nombre: "carrefour",
//     rubro: "supermercado",
//     _geoloc: {
//       lat: -37.32422,
//       lng: -59.1158882,
//     },
//   })
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const port = process.env.PORT || 3003;
const app = express();
app.use(express.json());

// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });

app.post("/comercios", async (req, res) => {
  const comercio = await Comercio.create({
    ...req.body,
  });
  res.json(comercio);
});

app.get("/comercios", async (req, res) => {
  const comercios = await Comercio.findAll();
  res.json(comercios);
});

app.get("/comercios/:id", async (req, res) => {
  const comercio = await Comercio.findByPk(req.params.id);
  res.json(comercio);
});

app.get("/comercios-cerca-de?lat&lng", async (req, res) => {
  const { lat, lng } = req.query;
  res.json({});
});

app.listen(port, () => {
  console.log("servidor corriendo en el puerto ", port);
});
