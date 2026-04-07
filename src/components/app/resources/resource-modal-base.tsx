"use client";

import type { ReactNode } from "react";

type ResourceModalBaseProps = {
  title: string;
  description: string;
  onClose: () => void;
  children?: ReactNode;
};

export function ResourceModalBase({ title, description, onClose, children }: ResourceModalBaseProps) {
  return (
    <div className="rs-modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="rs-modal">
        <button type="button" className="rs-modal-close" onClick={onClose} aria-label="Close modal">
          Close
        </button>
        <p className="rs-modal-label">Resource</p>
        <h3 className="rs-modal-title">{title}</h3>
        <p className="rs-modal-desc">{description}</p>
        <div className="rs-modal-body">{children}</div>
        <div className="rs-modal-footer">Coming soon - this resource view is scaffolded and ready for custom logic.</div>
      </div>
      <style jsx>{`
        .rs-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 85;
          background: rgba(0, 0, 0, 0.72);
          display: grid;
          place-items: center;
          padding: 20px;
        }
        .rs-modal {
          width: min(560px, 100%);
          border-radius: 16px;
          border: 1px solid rgba(200, 195, 230, 0.14);
          background: #171732;
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
          padding: 18px 18px 14px;
          position: relative;
        }
        .rs-modal-close {
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
        .rs-modal-label {
          margin: 0 0 6px;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8f88ad;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
        }
        .rs-modal-title {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          color: #ededf0;
          letter-spacing: -0.02em;
        }
        .rs-modal-desc {
          margin: 6px 0 0;
          font-size: 13px;
          color: #a8a1c3;
        }
        .rs-modal-body {
          margin-top: 14px;
          border: 1px solid rgba(200, 195, 230, 0.1);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 12px;
          padding: 12px;
        }
        .rs-modal-footer {
          margin-top: 10px;
          color: #8f88ad;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
}

