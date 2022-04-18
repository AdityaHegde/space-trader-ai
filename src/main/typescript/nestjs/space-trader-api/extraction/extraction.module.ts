import {CacheModule, Module} from "@nestjs/common";
import {ExtractionService} from "./extraction.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SurveyEntity} from "./survey.entity";
import {SpaceTraderClientModule} from "../space-trader-client/space-trader-client.module";

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([SurveyEntity]),
    SpaceTraderClientModule,
  ],
  providers: [
    ExtractionService,
  ],
  exports: [
    TypeOrmModule,
    ExtractionService,
  ],
})
export class ExtractionModule {}
