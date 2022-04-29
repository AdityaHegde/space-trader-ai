import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CooldownEntity } from "@space-trader-api/cooldown/cooldown.entity";
import { CooldownService } from "@space-trader-api/cooldown/cooldown.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CooldownEntity]),
  ],
  providers: [CooldownService],
  exports: [TypeOrmModule, CooldownService],
})
export class CooldownModule {}
