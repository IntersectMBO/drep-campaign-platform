import { Drep } from "src/entities/drep.entity";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

//sample config object
const config: PostgresConnectionOptions = {
  type: "postgres",
  database: "1694",
  host: "web_db",
  port: 5432,
  username: "postgres",
  password: "postgres",
  entities: [Drep],
  //Setting to true will update in real time for dev envt only. In prod, risks loss of data
  synchronize: true,
};
export default config;
