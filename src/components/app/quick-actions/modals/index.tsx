"use client";

import type { ComponentType } from "react";
type ModalProps = { onClose: () => void };

import { CaptureNoteModal } from "./capture-note-modal";
import { LogTradeModal } from "./log-trade-modal";
import { WriteDecisionModal } from "./write-decision-modal";
import { ConnectWalletModal } from "./connect-wallet-modal";
import { OpenAgentModal } from "./open-agent-modal";
import { ReviewUsageModal } from "./review-usage-modal";
import { DailyReviewModal } from "./daily-review-modal";
import { ClosePositionModal } from "./close-position-modal";
import { SetPriceAlertModal } from "./set-price-alert-modal";
import { QuickCaptureVoiceModal } from "./quick-capture-voice-modal";
import { ImportStatementModal } from "./import-statement-modal";
import { ExportWeeklyReportModal } from "./export-weekly-report-modal";
import { CreateChecklistModal } from "./create-checklist-modal";
import { TagBacklogModal } from "./tag-backlog-modal";
import { SummarizeResearchModal } from "./summarize-research-modal";
import { GeneratePostMortemModal } from "./generate-post-mortem-modal";
import { ReconcileWalletTxModal } from "./reconcile-wallet-tx-modal";
import { CreateAutomationModal } from "./create-automation-modal";
import { AddEventModal } from "./add-event-modal";
import { ScheduleTradeReviewModal } from "./schedule-trade-review-modal";
import { SetRecurringRoutineModal } from "./set-recurring-routine-modal";
import { MoveAlertToCalendarModal } from "./move-alert-to-calendar-modal";
import { RescheduleMissedTaskModal } from "./reschedule-missed-task-modal";
import { AutoFillTomorrowPlanModal } from "./auto-fill-tomorrow-plan-modal";

export type QuickActionModalComponent = ComponentType<ModalProps>;

export const QUICK_ACTION_MODAL_MAP: Record<string, QuickActionModalComponent> = {
  "Capture note": CaptureNoteModal,
  "Log trade": LogTradeModal,
  "Write decision": WriteDecisionModal,
  "Connect wallet": ConnectWalletModal,
  "Open agent": OpenAgentModal,
  "Review usage": ReviewUsageModal,
  "Daily review": DailyReviewModal,
  "Close position": ClosePositionModal,
  "Set price alert": SetPriceAlertModal,
  "Quick capture voice": QuickCaptureVoiceModal,
  "Import statement": ImportStatementModal,
  "Export weekly report": ExportWeeklyReportModal,
  "Create checklist": CreateChecklistModal,
  "Tag backlog": TagBacklogModal,
  "Summarize research": SummarizeResearchModal,
  "Generate post-mortem": GeneratePostMortemModal,
  "Reconcile wallet tx": ReconcileWalletTxModal,
  "Create automation": CreateAutomationModal,
  "Add event": AddEventModal,
  "Schedule trade review": ScheduleTradeReviewModal,
  "Set recurring routine": SetRecurringRoutineModal,
  "Move alert to calendar": MoveAlertToCalendarModal,
  "Reschedule missed task": RescheduleMissedTaskModal,
  "Auto-fill tomorrow plan": AutoFillTomorrowPlanModal,
};

