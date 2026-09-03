"use client";

import { useEffect, useState } from "react";
import { getOrCreateVisitorId } from "@/lib/visitor";

export default function LiveUsers() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const id = getOrCreateVisitorId();
    if (id) {
      fetch("/api/live-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: id }),
      }).catch(() => {});
    }

    const load = () => {
      fetch("/api/live-users")
        .then((r) => r.json())
        .then((d) => setCount(Number(d.liveUsers) || 0))
        .catch(() => {});
    };
    load();
    const timer = setInterval(load, 60000);
    return () => clearInterval(timer);
  }, []);

  return <span>{count === null ? "—" : count.toLocaleString()}</span>;
}
