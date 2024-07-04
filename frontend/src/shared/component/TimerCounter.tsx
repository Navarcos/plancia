import { useEffect } from "react";
import * as React from "react";

export const TimerCounter = (props: { timestampMills: number }) => {
  let elapsedTime = formatElapsedTime(props.timestampMills);
  const [time, setTime] = React.useState(elapsedTime);

  useEffect(() => {
    let interval = setInterval(() => {
      let elapsedTime = formatElapsedTime(props.timestampMills);
      setTime(elapsedTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [props.timestampMills]);
  return <p>{time}</p>;
};

function formatElapsedTime(value: number): string {
  let now = new Date().getTime();
  let secondElapsed = Math.floor((now - value) / 1000);
  let days = Math.floor(secondElapsed / 86400);
  secondElapsed -= days * 86400;
  let hours = Math.floor(secondElapsed / 3600);
  secondElapsed -= hours * 3600;
  let minutes = Math.floor(secondElapsed / 60);
  secondElapsed -= minutes * 60;
  if (days > 10000) return "";
  if (days > 365) {
    return `> 1Y`;
  }
  if (days > 0) {
    return days + "d " + hours + "h";
  }
  if (hours > 0) {
    return hours + "h " + minutes + "m";
  }
  if (minutes > 0) {
    return minutes + "m " + secondElapsed + "s";
  }
  return secondElapsed + "s ";
}
