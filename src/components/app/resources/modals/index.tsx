"use client";

import type { ComponentType } from "react";
type ModalProps = { onClose: () => void };

import { CaptureYourFirstNoteResourceModal } from "./capture-your-first-note-resource-modal";
import { SetUpYourTradeJournalResourceModal } from "./set-up-your-trade-journal-resource-modal";
import { ConnectYourWalletResourceModal } from "./connect-your-wallet-resource-modal";
import { UnderstandingOnChainProofResourceModal } from "./understanding-on-chain-proof-resource-modal";
import { AiMemoryExplainedResourceModal } from "./ai-memory-explained-resource-modal";
import { PayWithUsdcResourceModal } from "./pay-with-usdc-resource-modal";
import { ExportYourBrainPackResourceModal } from "./export-your-brain-pack-resource-modal";
import { KeyboardShortcutsResourceModal } from "./keyboard-shortcuts-resource-modal";
import { TradeEntryResourceModal } from "./trade-entry-resource-modal";
import { PostMortemResourceModal } from "./post-mortem-resource-modal";
import { MeetingNotesResourceModal } from "./meeting-notes-resource-modal";
import { DecisionLogResourceModal } from "./decision-log-resource-modal";
import { ResearchNoteResourceModal } from "./research-note-resource-modal";
import { WeeklyReviewResourceModal } from "./weekly-review-resource-modal";
import { EncryptionResourceModal } from "./encryption-resource-modal";
import { StorageResourceModal } from "./storage-resource-modal";
import { BackupResourceModal } from "./backup-resource-modal";
import { PrivacyResourceModal } from "./privacy-resource-modal";
import { NewNoteResourceModal } from "./new-note-resource-modal";
import { SearchResourceModal } from "./search-resource-modal";
import { QuickCaptureResourceModal } from "./quick-capture-resource-modal";
import { ImportExportResourceModal } from "./import-export-resource-modal";
import { SendFeedbackResourceModal } from "./send-feedback-resource-modal";

export type ResourceModalComponent = ComponentType<ModalProps>;

export const RESOURCE_MODAL_MAP: Record<string, ResourceModalComponent> = {
  "Capture your first note": CaptureYourFirstNoteResourceModal,
  "Set up your trade journal": SetUpYourTradeJournalResourceModal,
  "Connect your wallet": ConnectYourWalletResourceModal,
  "Understanding on-chain proof": UnderstandingOnChainProofResourceModal,
  "AI memory explained": AiMemoryExplainedResourceModal,
  "Pay with USDC": PayWithUsdcResourceModal,
  "Export your brain pack": ExportYourBrainPackResourceModal,
  "Keyboard shortcuts": KeyboardShortcutsResourceModal,
  "Trade entry": TradeEntryResourceModal,
  "Post-mortem": PostMortemResourceModal,
  "Meeting notes": MeetingNotesResourceModal,
  "Decision log": DecisionLogResourceModal,
  "Research note": ResearchNoteResourceModal,
  "Weekly review": WeeklyReviewResourceModal,
  "Encryption": EncryptionResourceModal,
  "Storage": StorageResourceModal,
  "Backup": BackupResourceModal,
  "Privacy": PrivacyResourceModal,
  "New note": NewNoteResourceModal,
  "Search": SearchResourceModal,
  "Quick capture": QuickCaptureResourceModal,
  "Import / export": ImportExportResourceModal,
  "Send feedback": SendFeedbackResourceModal,
};

