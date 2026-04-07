"use client";

import { useState } from "react";
import { ResourceModalBase } from "@/components/app/resources/resource-modal-base";

type Props = { onClose: () => void };

export function SetUpYourTradeJournalResourceModal({ onClose }: Props) {
  const [draft, setDraft] = useState("");

  return (
    <ResourceModalBase
      title="Set up your trade journal"
      description="Guide and reference content"
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
    </ResourceModalBase>
  );
}
