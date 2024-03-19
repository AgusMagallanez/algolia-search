import * as express from "express";
import { sequelize } from "./db";
import { index } from "./lib/algolia";
import { Comercio } from "./db/comercio";

const port = process.env.PORT || 3003;
const app = express();
app.use(express.json());

//sync de sequelize
// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });

//búsqueda algolia
// index
//   .search("", {
//     aroundLatLng: "-37.32422,-59.1158882",
//     aroundRadius: 10000,
//   })
//   .then((res) => {
//     console.log(res);
//   });

//Guardar un registro con algolia
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

//*END POINTS--------

//*Crear un comercio
app.post("/comercios", async (req, res) => {
  const comercio = await Comercio.create({
    ...req.body,
  });
  const algoliaRes = await index.saveObject({
    objectID: comercio.get("id"),
    nombre: comercio.get("nombre"),
    rubro: comercio.get("rubro"),
    _geoloc: {
      lat: comercio.get("lat"),
      lng: comercio.get("lng"),
    },
  });
  res.json(comercio);
});

//*Obtener listado de todos los comercios
app.get("/comercios", async (req, res) => {
  const comercios = await Comercio.findAll();
  res.json(comercios);
});

//*Obtener un comercio en particular por su ID
app.get("/comercios/:id", async (req, res) => {
  const comercio = await Comercio.findByPk(req.params.id);
  res.json(comercio);
});

//*Obtener comercios cerca de determinada localización
app.get("/comercios-cerca-de", async (req, res) => {
  const { lat, lng } = req.query;
  const { hits } = await index.search("", {
    aroundLatLng: [lat, lng].join(","),
    // aroundRadius: 10000,
  });
  res.json(hits);
});

//función auxiliar para transformar del formato body al formato de algolia
function bodyToIndex(body, id?) {
  const respuesta: any = {};
  if (body.nombre) {
    respuesta.nombre = body.nombre;
  }
  if (body.rubro) {
    respuesta.rubro = body.rubro;
  }
  if (body.lat && body.lng) {
    respuesta._geoloc = {
      lat: body.lat,
      lng: body.lng,
    };
  }
  if (id) {
    respuesta.objectID = id;
  }
  return respuesta;
}
//*Actualizar un registro
app.put("/comercios/:id", async (req, res) => {
  const [comercio] = await Comercio.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  const indexItem = bodyToIndex(req.body, req.params.id);
  const algoliaRes = await index.partialUpdateObject(indexItem);
  res.json(comercio);
});

app.get("*", express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log("servidor corriendo en el puerto ", port);
});
