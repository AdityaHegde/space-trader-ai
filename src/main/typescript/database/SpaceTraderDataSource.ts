import {DataSource} from "typeorm";
import {Good} from "./models/Good";
import {Location} from "./models/Location";
import {Ship} from "./models/Ship";
import {MyShip} from "./models/MyShip";
import {System} from "./models/System";

export const SpaceTraderDataSource = new DataSource({
  type: "postgres",
  username: "postgres",
  password: "password",
  database: "postgres",
  entities: [
    Good, Location, System,
    Ship, MyShip,
  ],
  synchronize: true,
});
