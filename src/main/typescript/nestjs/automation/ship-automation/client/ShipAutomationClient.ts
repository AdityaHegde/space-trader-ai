import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Repository } from "typeorm";
import { AutomationEntity, AutomationTask } from "@nestjs-server/automation/ship-automation/client/automation.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ShipAutomationClient {
  public constructor(
    @Inject("SHIP_AUTOMATION_CLIENT")
    private readonly clientKafka: ClientKafka,
    @InjectRepository(AutomationEntity)
    private readonly automationRepository: Repository<AutomationEntity>
  ) {}

  public async schedule(automation: AutomationEntity): Promise<void> {
    automation.pulled = false;
    // using update as the object might not always be an Entity
    await this.automationRepository.update(
      {shipSymbol: automation.shipSymbol}, automation);
  }
  public async scheduleNavigation(
    automation: AutomationEntity,
    nextTask: AutomationTask,
  ): Promise<void> {
    automation.task = AutomationTask.Navigate;
    automation.nextTask = nextTask;
    return this.schedule(automation);
  }
  public async reschedule(automation: AutomationEntity) {
    automation.runAfter = new Date(Date.now() + 5 * 1000).toISOString();
    return this.schedule(automation);
  }

  public async getAll(): Promise<Array<AutomationEntity>> {
    const entities = await this.automationRepository.createQueryBuilder("automation")
      .where("automation.runAfter < TIMESTAMP 'NOW' AND automation.pulled = FALSE")
      .getMany();
    if (entities.length) {
      await this.automationRepository.createQueryBuilder()
        .update({pulled: true})
        .where("shipSymbol in (:...shipSymbols)",
          {shipSymbols: entities.map(entity => entity.shipSymbol)})
        .execute();
    }
    return entities;
  }

  public async getOrCreate(shipSymbol: string) {
    const existing = await this.automationRepository
      .findOne({where: {shipSymbol}});
    if (existing) return existing;
    const newAutomation = new AutomationEntity();
    newAutomation.shipSymbol = shipSymbol;
    newAutomation.pulled = false;
    await this.automationRepository.save(newAutomation);
    return newAutomation;
  }

  public enqueue(automation: AutomationEntity): void {
    this.clientKafka.emit(automation.task, automation);
  }
}
