"use client";

import type { ReactNode } from "react";

type QuickActionModalBaseProps = {
  title: string;
  description: string;
  onClose: () => void;
  children?: ReactNode;
};

export function QuickActionModalBase({ title, description, onClose, children }: QuickActionModalBaseProps) {
  return (
    <div className="qa-modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="qa-modal">
        <button type="button" className="qa-modal-close" onClick={onClose} aria-label="Close modal">
          Close
        </button>
        <p className="qa-modal-label">Quick Action</p>
        <h3 className="qa-modal-title">{title}</h3>
        <p className="qa-modal-desc">{description}</p>
        <div className="qa-modal-body">{children}</div>
        <div className="qa-modal-footer">Coming soon - this action screen is scaffolded and ready for custom logic.</div>
      </div>
      <style jsx>{`
        .qa-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 80;
          background: rgba(0, 0, 0, 0.72);
          display: grid;
          place-items: center;
          padding: 20px;
        }
        .qa-modal {
          width: min(560px, 100%);
          border-radius: 16px;
          border: 1px solid rgba(200, 195, 230, 0.14);
          background: #171732;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
          padding: 18px 18px 14px;
          position: relative;
        }
        .qa-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          border: 1px solid rgba(200, 195, 230, 0.16);
          border-radius: 999px;
          background: transparent;
          color: #a8a1c3;
          font-size: 11px;
          padding: 4px 10px;
          cursor: pointer;
        }
        .qa-modal-label {
          margin: 0 0 6px;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8f88ad;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
        }
        .qa-modal-title {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          color: #ededf0;
          letter-spacing: -0.02em;
        }
        .qa-modal-desc {
          margin: 6px 0 0;
          font-size: 13px;
          color: #a8a1c3;
        }
        .qa-modal-body {
          margin-top: 14px;
          border: 1px solid rgba(200, 195, 230, 0.1);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 12px;
        }
        .qa-modal-footer {
          margin-top: 10px;
          color: #8f88ad;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
}

