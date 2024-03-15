import { Model, DataTypes } from "sequelize";
import { sequelize } from "./index";

export class Comercio extends Model {}

Comercio.init(
  {
    nombre: DataTypes.STRING,
    rubro: DataTypes.STRING,
    adress: DataTypes.FLOAT,
  },
  { sequelize, modelName: "comercio" }
);
