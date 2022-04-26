import { Injectable } from "@nestjs/common";
import { AutomationEntity, AutomationStatus, AutomationTask } from "./automation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ShipService } from "@space-trader-api/ships/ship.service";
import { ShipType } from "@commons/GameConstants";
import { ShipEntity } from "@space-trader-api/ships/ship.entity";
import { ExtractTask } from "@nestjs-server/automation/task/ExtractTask";
import { TravelTask } from "@nestjs-server/automation/task/TravelTask";
import { SellTask } from "@nestjs-server/automation/task/SellTask";
import { Task } from "@nestjs-server/automation/task/Task";
import { ShipLogger } from "@nestjs-server/logging/ShipLogger";

@Injectable()
export class ShipAutomationService {
  private tasksMap = new Map<AutomationTask, Task>();
  private readonly logger = new ShipLogger("ShipAutomation");

  public constructor(
    @InjectRepository(AutomationEntity)
    private readonly repository: Repository<AutomationEntity>,
    private readonly shipService: ShipService,

    private readonly travelTask: TravelTask,
    extractTask: ExtractTask,
    sellTask: SellTask,
  ) {
    this.tasksMap.set(AutomationTask.Extract, extractTask);
    this.tasksMap.set(AutomationTask.Sell, sellTask);
  }

  public async getOrCreate(shipSymbol: string): Promise<AutomationEntity> {
    const existingEntity = await this.repository.findOne({shipSymbol});
    if (existingEntity) return existingEntity;

    const newEntity = new AutomationEntity();
    newEntity.shipSymbol = shipSymbol;
    newEntity.taskIndex = 0;
    newEntity.status = AutomationStatus.Idle;
    await this.repository.save(newEntity);
    return newEntity;
  }

  public async update(automationEntity: AutomationEntity): Promise<AutomationEntity> {
    return this.repository.save(automationEntity);
  }

  public async automateShips(ships: Array<ShipEntity>): Promise<void> {
    for (let ship of ships) {
      // TODO: use queues here to distribute and rate limit
      if (ship.registration.role === ShipType.COMMAND) continue;
      const automation = await this.getOrCreate(ship.symbol);

      ShipAutomationService.assignTasks(ship, automation);

      try {
        await this.doTaskForShip(ship, automation);
        await this.update(automation);
      } catch (err) {
        console.log(err);
      }
    }
  }

  private async doTaskForShip(ship: ShipEntity, automation: AutomationEntity): Promise<void> {
    let task = this.tasksMap.get(automation.task);
    await ShipAutomationService.acquireTaskTarget(task, ship, automation);

    if (ship.location !== automation.target) {
      task = this.travelTask;
      await ShipAutomationService.acquireTaskTarget(task, ship, automation);
    }

    this.logger.shipLog(ship, `Task=${automation.task} Target=${automation.target}`);

    if (task.skip(ship, automation)) {
      return;
    }

    try {
      await task.doTask(ship, automation);
    } catch (err) {
      this.logger.error(err.message, err.stack);
    }

    if (task.isDone(ship, automation)) {
      await task.end(ship, automation);
      if (task !== this.travelTask) {
        automation.nextTask();
      }
    }

    // update if the task was done
    await this.shipService.updateExisting(ship);
  }

  private static assignTasks(ship: ShipEntity, automation: AutomationEntity): void {
    if (automation.tasks) return;
    switch (ship.registration.role) {
      case ShipType.EXCAVATOR:
        automation.tasks = [AutomationTask.Extract, AutomationTask.Sell];
        break;
    }
  }

  private static async acquireTaskTarget(
    task: Task, ship: ShipEntity, automation: AutomationEntity,
  ): Promise<void> {
    if (task.hasTarget(ship, automation)) return;

    await task.acquireTarget(ship, automation);
    await task.start(ship, automation);

    if (!task.hasTarget(ship, automation))
      throw new Error(`No target found for ${ship.symbol},${automation.task}`);
  }
}
