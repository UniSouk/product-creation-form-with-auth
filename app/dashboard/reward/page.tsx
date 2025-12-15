// app/dashboard/reward/page.tsx
import { Suspense } from "react";
import RewardClient from "./RewardClient";

export default function Page() {
  return (
     <Suspense fallback={<div>Loading...</div>}>
        <RewardClient />
     </Suspense>
);
}
