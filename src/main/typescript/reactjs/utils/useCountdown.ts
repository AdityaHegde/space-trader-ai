import { useState } from "react";

export const useCountdown = (): [number, (timeInSec: number) => void] => {
  const [countdown, setCountdown] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);

  const startCountdown = (timeInSec: number) => {
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      setCountdown(--timeInSec);
      if (timeInSec === 0) {
        clearInterval(newTimer);
        setTimer(0);
      }
    }, 1000);
    setTimer(newTimer as any);
    setCountdown(timeInSec);
  }

  return [countdown, startCountdown];
}
