"use client";

import { DemoWorkflow } from "@/components/demo/DemoWorkflow";

/**
 * Demo entry — fluid Airlock transition, then real fixture routes.
 * Not production authentication.
 */
export default function EnterPage() {
  return <DemoWorkflow mode="navigate" />;
}
