import { Suspense } from "react";
import FeedbackFormClient from "./FeedbackFormClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeedbackFormClient />
    </Suspense>
  );
}
