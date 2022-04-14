import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class FlightPlan {
  @PrimaryColumn()
  public id: string;
  @Column()
  public ship: string;
  @Column()
  public createdAt: string;
  @Column()
  public arrivesAt: string;
  @Column()
  public terminatedAt: string;
  @Column()
  public departure: string;
  @Column()
  public destination: string;
  @Column()
  public distance: number;
  @Column()
  public fuelConsumed: number;
  @Column()
  public fuelRemaining: number;
  @Column()
  public timeRemainingInSeconds: number;

  public updateFlightPlan(json: FlightPlan) {
    this.timeRemainingInSeconds = json.timeRemainingInSeconds;
    this.terminatedAt = json.terminatedAt;
  }

  public static fromJson(json: FlightPlan) {
    const flightPlan = new FlightPlan();
    flightPlan.id = json.id;
    flightPlan.ship = json.ship;
    flightPlan.createdAt = json.createdAt;
    flightPlan.arrivesAt = json.arrivesAt;
    flightPlan.departure = json.departure;
    flightPlan.destination = json.destination;
    flightPlan.distance = json.distance;
    flightPlan.fuelConsumed = json.fuelConsumed;
    flightPlan.fuelRemaining = json.fuelRemaining;
    flightPlan.timeRemainingInSeconds = json.timeRemainingInSeconds;
    return flightPlan;
  }
}
