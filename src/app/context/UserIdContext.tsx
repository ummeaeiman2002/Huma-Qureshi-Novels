"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface UserIdContextType {
  userId: string | null;
  isPremium: boolean;
  isLoading: boolean;
}

const UserIdContext = createContext<UserIdContextType | undefined>(undefined);

export function UserIdProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (session?.user?.id && session.user.paymentStatus === "completed") {
      setUserId(session.user.id);
      setIsPremium(true);
    } else {
      setUserId(null);
      setIsPremium(false);
    }

    setIsLoading(false);
  }, [session, status]);

  return (
    <UserIdContext.Provider value={{ userId, isPremium, isLoading }}>
      {children}
    </UserIdContext.Provider>
  );
}

export function useUserId() {
  const context = useContext(UserIdContext);
  if (context === undefined) {
    throw new Error("useUserId must be used within a UserIdProvider");
  }
  return context;
}
