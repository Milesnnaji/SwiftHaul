import { Suspense } from "react";
import TrackContent from "./track-content";

export default function TrackPage() {
  return (
    <Suspense>
      <TrackContent />
    </Suspense>
  );
}
