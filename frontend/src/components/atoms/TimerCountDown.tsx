import React, { useEffect, useState } from 'react';
type TimerCountDownProps = { minutes: number };
function TimerCountDown({ minutes }: TimerCountDownProps) {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const remainingMinutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return {
      minutes: remainingMinutes.toString().padStart(2, '0'),
      seconds: remainingSeconds.toString().padStart(2, '0'),
    };
  };

  const { minutes: minutesLeft, seconds: secondsLeft } = formatTime(timeLeft);

  return (
    <div className=" flex w-full items-start justify-center gap-4">
      <div className="timer w-16">
        <div className="">
          <h3 className="text-center text-3xl font-bold text-primary-300">
            {minutesLeft}
          </h3>
        </div>
        <p className="mt-1 w-full text-center text-sm font-normal text-gray-900">
          {' '}
          minutes
        </p>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">:</h3>
      <div className="timer w-16">
        <div className="">
          <h3 className="text-center text-3xl font-bold text-primary-300">
            {secondsLeft}
          </h3>
        </div>
        <p className="mt-1 w-full text-center text-sm font-normal text-gray-900">
          {' '}
          seconds
        </p>
      </div>
    </div>
  );
}

export default TimerCountDown;
