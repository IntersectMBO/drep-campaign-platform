import { Module } from "@nestjs/common";
import { DrepModule } from "./drep/drep.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "ormconfig";

@Module({
  imports: [DrepModule, TypeOrmModule.forRoot(config)],
  controllers: [],
  providers: [],
})
export class AppModule {}
