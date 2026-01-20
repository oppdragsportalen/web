"use client";

import { useEffect, useState } from "react";

interface TimeBasedGreetingProps {
  displayName: string;
}

export default function TimeBasedGreeting({
  displayName,
}: TimeBasedGreetingProps) {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <h1 className="text-3xl font-bold">
      {greeting}, {displayName}
    </h1>
  );
}
