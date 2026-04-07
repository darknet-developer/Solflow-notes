"use client";

import { useState } from "react";
import { QuickActionModalBase } from "@/components/app/quick-actions/quick-action-modal-base";

type Props = { onClose: () => void };

export function RescheduleMissedTaskModal({ onClose }: Props) {
  const [draft, setDraft] = useState("");

  return (
    <QuickActionModalBase
      title="Reschedule missed task"
      description="Shift incomplete tasks to a new day/time"
      onClose={onClose}
    >
      <label style={{ display: "grid", gap: 6 }}>
        <span style={{ fontSize: 11, color: "#b8b0d0" }}>Placeholder input</span>
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Enter initial config..."
          style={{
            height: 34,
            borderRadius: 8,
            border: "1px solid rgba(200,195,230,0.12)",
            background: "rgba(255,255,255,0.02)",
            color: "#ededf0",
            padding: "0 10px",
            outline: "none",
            fontSize: 12,
          }}
        />
      </label>
    </QuickActionModalBase>
  );
}
