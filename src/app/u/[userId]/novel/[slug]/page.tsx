"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/app/components/Loader";

export default function RedirectPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  useEffect(() => {
    // Redirect to the actual novel page
    router.replace(`/novel/${userId}`);
  }, [userId, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader />
    </div>
  );
}
