import { Transport } from "@nestjs/microservices";
import { TcpClientOptions } from "@nestjs/microservices/interfaces/client-metadata.interface";

export const KafkaClientConfig: TcpClientOptions = {
  transport: Transport.TCP,
  // transport: Transport.KAFKA,
  // options: {
  //   client: {
  //     clientId: "ship-automation",
  //     brokers: ["localhost:9092"],
  //   },
  //   consumer: {
  //     groupId: "ship-automation-consumer",
  //   },
  // },
};
