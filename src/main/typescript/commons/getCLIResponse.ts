import {createInterface} from "readline";

export async function getCLIResponse(message: string) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(message + " ", async (answer) => {
      rl.close();

      resolve(answer.trim());
    });
  });
}
