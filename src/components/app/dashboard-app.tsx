"use client";

import { useEffect, useMemo, useState } from "react";
import HomePage from "@/app/(app)/home/page";
import { DetailsPanel } from "@/components/app/details-panel";
import { NoteEditor } from "@/components/app/note-editor";
import { NotesPanel } from "@/components/app/notes-panel";
import { Sidebar } from "@/components/app/sidebar";
import { Titlebar } from "@/components/app/titlebar";
import { MOCK_NOTES } from "@/lib/mock-notes";
import type { DraftEditorBlock, TradeTemplateBlock } from "@/types/editor-block";
import type { NoteFilter, NoteId, NoteView } from "@/types/note";

const dashboardStyles = `
.sb-dashboard {
  --bg:#0c0c12;
  --bg2:#111120;
  --bg3:#16162a;
  --bg4:#1c1c30;
  --border:rgba(235, 235, 238, .06);
  --border2:rgba(235, 235, 238, .11);
  --text:#ebebee;
  --text2:#888898;
  --text3:#44445a;
  --accent:#a594e0;
  --accent2:#c0b4f0;
  --accent-d:rgba(165, 148, 224, .1);
  --accent-d2:rgba(165, 148, 224, .05);
  --green:#5fba7d;
  --green-d:rgba(95, 186, 125, .1);
  --red:#c46e6e;
  --red-d:rgba(196, 110, 110, .1);
  --sidebar-w:236px;
  --sidebar-collapsed-w:50px;
  --panel-w:292px;
  --rp-w:252px;
  --titlebar-h:42px;
  --ease:cubic-bezier(.4, 0, .2, 1);
  --sidebar-bg:#050505;
  --topbar-bg:#050505;
  min-height:100vh;
  background:var(--bg);
  color:var(--text);
  display:flex;
  flex-direction:column;
  overflow:hidden;
  position:relative}
.sb-dashboard::after {
  content:"";
  position:fixed;
  inset:0;
  pointer-events:none;
  z-index:1;
  opacity:0;
  background-image:url("data:image/svg+xml, %3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:180px 180px}
.sb-dashboard * {
  box-sizing:border-box}
.titlebar, .layout, .toast {
  position:relative;
  z-index:2}
.titlebar {
  height:var(--titlebar-h);
  background:var(--topbar-bg);
  border-bottom:1px solid var(--border);
  display:flex;
  align-items:center;
  padding:0 16px;
  gap:12px;
  flex-shrink:0}
.tb-dots, .tb-right, .pin-tags, .pn-tags, .panel-acts, .rp-tabs, .ai-shortcuts, .wallet-row, .usdc-row, .pn-foot, .ed-actions, .tb-right, .note-meta, .ai-head {
  display:flex}
.tb-dots {
  gap:7px}
.tbd {
  width:12px;
  height:12px;
  border-radius:50%}
.tbd-r {
  background:#ff5f57}
.tbd-y {
  background:#febc2e}
.tbd-g {
  background:#28c840}
.tb-center {
  margin:0 auto;
  transform:translateX(-30px);
  font-family:"DM Mono", monospace;
  font-size:11px;
  font-weight:300;
  color:var(--text3);
  letter-spacing:.04em}
.tb-right {
  gap:6px;
  margin-left:auto}
.tb-icon, .icon-btn, .collapse-btn, .rp-close {
  width:28px;
  height:28px;
  border:1px solid var(--border);
  border-radius:6px;
  background:transparent;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  color:var(--text3);
  transition:all .15s}
.tb-icon:hover, .icon-btn:hover, .collapse-btn:hover, .rp-close:hover {
  border-color:var(--border2);
  color:var(--text2)}
.tb-icon.active, .icon-btn.on {
  background:var(--accent-d);
  border-color:rgba(165, 148, 224, .22);
  color:var(--accent)}
.layout {
  display:flex;
  flex:1;
  overflow:hidden;
  min-height:0;
  height:calc(100dvh - var(--titlebar-h));
  padding-left:var(--sidebar-w)}
.layout.sidebar-collapsed {
  padding-left:var(--sidebar-collapsed-w)}
.sidebar {
  width:var(--sidebar-w);
  min-width:var(--sidebar-w);
  height:calc(100dvh - var(--titlebar-h));
  position:fixed;
  top:var(--titlebar-h);
  left:0;
  z-index:4;
  isolation:isolate;
  background:var(--sidebar-bg);
  border-right:1px solid var(--border);
  display:grid;
  grid-template-rows:minmax(0, 1fr) 68px;
  overflow:hidden;
  overscroll-behavior-y:contain;
  transition:width .24s var(--ease), min-width .24s var(--ease)}
.sidebar.collapsed {
  width:var(--sidebar-collapsed-w);
  min-width:var(--sidebar-collapsed-w)}
.sidebar.collapsed .sb-label, .sidebar.collapsed .nav-count, .sidebar.collapsed .sec-label, .sidebar.collapsed .sb-search-wrap, .sidebar.collapsed .sb-footer-inner, .sidebar.collapsed .logo-text {
  opacity:0;
  pointer-events:none;
  width:0;
  overflow:hidden;
  white-space:nowrap}
.sidebar.collapsed .logo {
  justify-content:center}
.sidebar.collapsed .new-btn {
  justify-content:center;
  padding:9px 0;
  background:transparent;
  border-color:transparent}
.sidebar.collapsed .new-btn-label {
  display:none}
.sidebar.collapsed .nav-item {
  padding:9px 0;
  justify-content:center}
.sidebar.collapsed .collapse-btn svg {
  transform:rotate(180deg)}
.sb-head {
  padding:16px 16px 14px;
  border-bottom:1px solid var(--border)}
.logo {
  display:flex;
  align-items:center;
  gap:9px;
  margin-bottom:14px;
  overflow:hidden;
  white-space:nowrap}
.logo-mark {
  width:26px;
  height:26px;
  border-radius:7px;
  background:var(--accent-d);
  border:1px solid rgba(165, 148, 224, .2);
  display:flex;
  align-items:center;
  justify-content:center;
  flex-shrink:0;
  color:var(--accent)}
.logo-text {
  font-family:"Playfair Display", serif;
  font-size:17px;
  color:var(--text)}
.new-btn {
  width:100%;
  padding:9px 13px;
  background:var(--accent-d);
  border:1px solid rgba(165, 148, 224, .18);
  border-radius:8px;
  color:var(--accent2);
  font-size:13px;
  cursor:pointer;
  display:flex;
  align-items:center;
  gap:9px}
.new-btn-icon {
  width:16px;
  height:16px;
  border-radius:50%;
  background:rgba(165, 148, 224, .22);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:15px}
.sb-search-wrap {
  padding:10px 16px 0;
  position:relative}
.sb-search-wrap input {
  width:100%;
  padding:8px 10px 8px 30px;
  background:var(--bg3);
  border:1px solid var(--border);
  border-radius:7px;
  font-size:12px;
  color:var(--text2);
  outline:none}
.s-icon {
  position:absolute;
  left:26px;
  top:50%;
  transform:translateY(-50%);
  color:var(--text3);
  pointer-events:none}
.sb-section {
  display:flex;
  align-items:center;
  padding:16px 16px 5px}
.sec-label {
  font-family:"DM Mono", monospace;
  font-size:9px;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:var(--text3)}
.nav-item {
  display:flex;
  align-items:center;
  gap:9px;
  padding:8px 16px;
  font-size:13px;
  color:var(--text2);
  cursor:pointer;
  border-left:2px solid transparent;
  background:transparent;
  border-top:none;
  border-right:none;
  border-bottom:none;
  text-align:left}
.nav-item:hover {
  color:var(--text);
  background:var(--bg2)}
.nav-item.active {
  color:var(--accent2);
  background:var(--bg2);
  border-left-color:var(--accent)}
.nav-icon {
  width:14px;
  height:14px;
  flex-shrink:0;
  opacity:.45}
.nav-count {
  margin-left:auto;
  font-family:"DM Mono", monospace;
  font-size:10px;
  color:var(--text3);
  background:var(--bg4);
  padding:1px 7px;
  border-radius:10px}
.pinned-list, .panel-list, .ed-body, .rp-body {
  overflow-y:auto;
  min-height:0}
.sidebar-scroll {
  min-height:0;
  overflow-y:auto;
  overflow-x:hidden;
  overscroll-behavior-y:contain;
  touch-action:pan-y;
  padding-bottom:8px}
.pinned-list {
  padding:4px 0}
.pin-item, .pnote {
  background:transparent;
  border-top:none;
  border-right:none;
  text-align:left;
  cursor:pointer}
.pin-item {
  padding:10px 16px;
  border-left:2px solid transparent;
  border-bottom:1px solid var(--border)}
.pin-item:hover {
  background:var(--bg2)}
.pin-item.active {
  background:var(--bg2);
  border-left-color:var(--accent)}
.pin-top, .pn-head, .info-row, .rel-note, .chain-meta, .notarize-cost, .tc-head {
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:8px}
.pin-title, .pn-title {
  font-size:12px;
  font-weight:400;
  color:var(--text)}
.pin-time, .pn-date, .wallet-addr, .usdc-bal {
  font-family:"DM Mono", monospace}
.pin-snip, .pn-prev {
  font-size:11px;
  color:var(--text2);
  line-height:1.45;
  margin:6px 0}
.chip {
  font-family:"DM Mono", monospace;
  font-size:10px;
  padding:2px 7px;
  border-radius:4px;
  border:1px solid transparent}
.chip-p {
  background:var(--accent-d);
  border-color:rgba(165, 148, 224, .2);
  color:var(--accent2)}
.chip-g {
  background:var(--green-d);
  border-color:rgba(95, 186, 125, .2);
  color:var(--green)}
.chip-r {
  background:var(--red-d);
  border-color:rgba(196, 110, 110, .2);
  color:var(--red)}
.chip-d {
  background:var(--bg4);
  border-color:var(--border);
  color:var(--text3)}
.sb-footer {
  height:68px;
  padding:12px 16px;
  border-top:1px solid var(--border);
  background:var(--sidebar-bg)}
.wallet-label, .usdc-lbl {
  font-size:11px;
  color:var(--text3)}
.wallet-dot, .proof-dot, .np-dot, .chain-dot {
  width:7px;
  height:7px;
  border-radius:50%;
  background:var(--green);
  box-shadow:0 0 6px rgba(95, 186, 125, .5)}
.panel {
  width:var(--panel-w);
  min-width:var(--panel-w);
  height:100%;
  background:var(--bg2);
  border-right:1px solid var(--border);
  display:flex;
  flex-direction:column;
  overflow:hidden;
  transition:width .24s var(--ease), min-width .24s var(--ease)}
.panel.hidden, .rp.hidden {
  width:0;
  min-width:0;
  border:none;
  overflow:hidden}
.panel-head, .rp-head {
  padding:14px 16px;
  border-bottom:1px solid var(--border)}
.panel-title, .rp-head-title {
  font-family:"Playfair Display", serif;
  font-size:15px;
  color:var(--text)}
.panel-filters {
  padding:9px 14px;
  border-bottom:1px solid var(--border);
  display:flex;
  gap:5px;
  flex-wrap:wrap}
.fchip, .rp-tab, .sc, .ai-send, .act-btn {
  background:transparent;
  border:1px solid var(--border);
  border-radius:20px;
  color:var(--text3);
  cursor:pointer}
.fchip {
  font-size:11px;
  padding:4px 11px}
.fchip.active, .rp-tab.active {
  background:var(--accent-d);
  border-color:rgba(165, 148, 224, .28);
  color:var(--accent2)}
.pnote {
  padding:14px 16px;
  border-bottom:1px solid var(--border);
  border-left:2px solid transparent}
.pnote:hover {
  background:var(--bg3)}
.pnote.active {
  background:var(--bg3);
  border-left-color:var(--accent)}
.pn-prev {
  font-size:12px;
  line-height:1.55}
.pn-proof {
  display:flex;
  align-items:center;
  gap:4px;
  font-family:"DM Mono", monospace;
  font-size:10px;
  color:var(--accent2);
  opacity:.75}
.panel-empty, .details-empty {
  padding:28px 16px;
  font-size:13px;
  color:var(--text3);
  text-align:center;
  line-height:1.65}
.editor {
  flex:1;
  display:flex;
  flex-direction:column;
  min-width:0;
  height:100%;
  background:var(--bg);
  overflow-y:auto;
  overflow-x:hidden}
.editor-strip {
  position:sticky;
  top:0;
  z-index:12;
  min-height:64px;
  margin:0 12px;
  padding:0 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  border:1px solid rgba(165, 148, 224, .18);
  border-radius:24px;
  background:var(--bg2);
  box-shadow:0 8px 24px rgba(0, 0, 0, .28);
}
.strip-head {
  display:flex;
  align-items:center;
  gap:10px;
  min-width:0;
}
.editor-topbar {
  height:50px;
  border-bottom:1px solid var(--border);
  display:flex;
  align-items:center;
  padding:0 28px;
  gap:10px}
.breadcrumb {
  display:flex;
  align-items:center;
  gap:6px;
  font-size:12px;
  color:var(--text3);
  white-space:nowrap;
  overflow:hidden}
.breadcrumb span:last-child {
  color:var(--text2)}
.notarized-pill {
  display:flex;
  align-items:center;
  gap:6px;
  padding:5px 12px;
  border-radius:20px;
  background:var(--accent-d2);
  border:1px solid rgba(165, 148, 224, .2);
  font-family:"DM Mono", monospace;
  font-size:10px;
  color:var(--accent2)}
.act-btn {
  padding:6px 13px;
  border-radius:7px;
  display:flex;
  align-items:center;
  gap:6px;
  font-size:12px;
  color:var(--text2)}
.act-btn.primary {
  background:var(--accent-d);
  border-color:rgba(165, 148, 224, .22);
  color:var(--accent2)}
.toolbar {
  padding:7px 28px;
  border-bottom:1px solid var(--border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  flex-wrap:wrap}
.toolbar-group {
  display:flex;
  align-items:center;
  gap:6px;
}
.toolbar-group.mid {
  padding-inline:12px;
  border-inline:1px solid var(--border);
}
.tb-btn {
  min-width:28px;
  height:28px;
  padding:0 8px;
  border:none;
  border-radius:5px;
  background:transparent;
  color:var(--text3);
  cursor:pointer}
.tb-btn.on {
  background:var(--accent-d);
  color:var(--accent)}
@media (max-width:1100px) {
  .toolbar {
    justify-content:flex-start;
  }
  .toolbar-group.mid {
    border-inline:none;
    padding-inline:0;
  }
}
@media (max-width:1100px) {
  .editor-strip {
    flex-wrap:wrap;
    justify-content:flex-start;
    padding-top:8px;
    padding-bottom:8px;
    min-height:auto;
    border-radius:20px;
    top:8px;
    margin:8px 8px 0;
  }
  .strip-head {
    width:100%;
    justify-content:space-between;
  }
}
.ed-body {
  flex:1;
  display:flex;
  flex-direction:column;
  min-height:0;
  height:100%;
  overflow-y:auto;
  overflow-x:hidden;
  padding:64px 60px 44px}
.note-title {
  font-family:"Playfair Display", serif;
  font-size:36px;
  color:var(--text);
  background:transparent;
  border:none;
  outline:none;
  width:100%;
  margin-bottom:8px;
  letter-spacing:-.5px;
  line-height:1.15}
.note-meta {
  margin-bottom:30px;
  padding-bottom:20px;
  border-bottom:1px solid var(--border);
  font-size:12px;
  color:var(--text3);
  align-items:center;
  flex-wrap:wrap;
  gap:12px}
.meta-sep {
  width:3px;
  height:3px;
  border-radius:50%;
  background:var(--text3)}
.note-content {
  font-size:15px;
  line-height:1.85;
  color:var(--text2);
  max-width:700px}
.note-content.draft {
  max-width:none;
  display:block;
}
.draft-textarea {
  min-height:220px;
  height:auto;
  width:100%;
  overflow:hidden;
  white-space:pre-wrap;
  word-break:break-word;
}
.draft-textarea h1 {
  font-family:"Playfair Display", serif;
  font-size:34px;
  line-height:1.2;
  letter-spacing:-.4px;
  color:var(--text);
  margin:18px 0 10px;
}
.draft-textarea h2 {
  font-family:"Playfair Display", serif;
  font-size:26px;
  line-height:1.25;
  letter-spacing:-.25px;
  color:var(--text);
  margin:16px 0 8px;
}
.draft-textarea ul {
  list-style:disc;
  margin:10px 0 10px 24px;
  padding:0;
}
.draft-textarea li {
  margin:4px 0;
}
.draft-textarea p {
  margin:0 0 10px;
}
.draft-textarea img {
  display:block;
  width:100%;
  max-width:min(720px, 100%);
  height:auto;
  margin:14px 0;
  border-radius:10px;
  border:1px solid var(--border);
  object-fit:contain;
}
.draft-textarea:empty::before {
  content:attr(data-placeholder);
  color:var(--text3);
  pointer-events:none;
}
.note-content p {
  margin-bottom:16px}
.note-content h3 {
  font-family:"DM Mono", monospace;
  font-size:10px;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--text3);
  margin:26px 0 10px}
.note-content strong {
  color:var(--text);
  font-weight:500}
.note-content code {
  font-family:"DM Mono", monospace;
  font-size:12px;
  background:var(--bg2);
  border:1px solid var(--border);
  padding:1px 6px;
  border-radius:4px;
  color:var(--accent)}
.trade-card, .ai-card, .code-block, .chain-card {
  background:var(--bg2);
  border:1px solid var(--border2);
  border-radius:10px;
  padding:18px;
  margin:22px 0}
.tc-pair {
  font-family:"Playfair Display", serif;
  font-size:16px;
  color:var(--text)}
.tc-pnl {
  font-family:"DM Mono", monospace;
  font-size:16px;
  color:var(--green)}
.tc-pnl.neg {
  color:var(--red)}
.tc-pnl-sub, .tc-stat-l, .cb-lang, .ai-badge {
  font-family:"DM Mono", monospace;
  font-size:9px;
  color:var(--text3);
  text-transform:uppercase;
  letter-spacing:.08em}
.tc-grid {
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  gap:12px;
  margin-bottom:16px}
.tc-stat-v {
  font-family:"DM Mono", monospace;
  font-size:14px;
  color:var(--text)}
.tc-thesis {
  border-top:1px solid var(--border);
  padding-top:14px}
.tc-thesis-t, .ai-text {
  font-size:13px;
  line-height:1.65;
  color:var(--text2)}
.callout {
  border-left:1px solid var(--accent);
  padding:12px 18px;
  background:var(--accent-d2);
  border-radius:0 8px 8px 0;
  margin:18px 0;
  font-size:14px;
  line-height:1.7;
  color:var(--text2)}
.callout strong {
  color:var(--accent2)}
.ai-head {
  justify-content:flex-start;
  align-items:center;
  gap:7px;
  margin-bottom:8px}
.ai-badge-dot {
  width:5px;
  height:5px;
  border-radius:50%;
  background:var(--accent)}
.code-block {
  padding:0;
  overflow:hidden}
.cb-head {
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:10px 14px;
  border-bottom:1px solid var(--border)}
.cb-copy {
  background:transparent;
  border:none;
  color:var(--accent2);
  cursor:pointer;
  font-family:"DM Mono", monospace;
  font-size:10px;
  text-transform:uppercase}
.cb-body {
  margin:0;
  padding:16px;
  overflow:auto;
  font-family:"DM Mono", monospace;
  font-size:12px;
  line-height:1.75;
  color:#c0b4f0;
  white-space:pre-wrap}
.ai-bar {
  border-top:1px solid var(--border);
  padding:12px 20px;
  display:flex;
  align-items:center;
  gap:10px;
  background:rgba(12, 12, 18, .88)}
.ai-avt {
  width:24px;
  height:24px;
  border-radius:999px;
  border:1px solid rgba(165, 148, 224, .22);
  display:flex;
  align-items:center;
  justify-content:center}
.ai-input {
  flex:1;
  min-width:0;
  background:var(--bg2);
  border:1px solid var(--border);
  border-radius:10px;
  padding:12px 14px;
  color:var(--text2);
  outline:none}
.sc {
  padding:7px 10px;
  font-size:10px;
  font-family:"DM Mono", monospace;
  border-radius:999px}
.ai-send {
  padding:10px 14px;
  border-radius:10px;
  color:var(--accent2);
  border-color:rgba(165, 148, 224, .22);
  background:var(--accent-d)}
.rp {
  width:var(--rp-w);
  min-width:var(--rp-w);
  height:100%;
  border-left:1px solid var(--border);
  background:var(--bg2);
  display:flex;
  flex-direction:column;
  overflow:hidden;
  transition:width .24s var(--ease), min-width .24s var(--ease)}
.rp-tabs {
  padding:8px 16px;
  gap:8px;
  border-bottom:1px solid var(--border)}
.rp-tab {
  padding:6px 10px;
  border-radius:8px;
  border:none;
  font-size:11px}
.rp-body {
  flex:1;
  padding:16px}
.info-row {
  padding:6px 0}
.il {
  font-size:11px;
  color:var(--text3)}
.iv {
  font-size:11px;
  color:var(--text)}
.mono {
  font-family:"DM Mono", monospace}
.green {
  color:var(--green)}
.red {
  color:var(--red)}
.rp-div {
  height:1px;
  background:var(--border);
  margin:14px 0}
.rp-sec-label {
  font-family:"DM Mono", monospace;
  font-size:10px;
  color:var(--text3);
  text-transform:uppercase;
  letter-spacing:.1em;
  margin-bottom:10px}
.rel-note {
  display:block;
  padding:10px 0;
  border-bottom:1px solid var(--border)}
.rel-title {
  font-size:12px;
  color:var(--text);
  margin-bottom:4px}
.rel-match {
  font-size:11px;
  color:var(--text3)}
.chain-card {
  margin-top:0}
.chain-head {
  display:flex;
  align-items:center;
  gap:7px;
  font-family:"DM Mono", monospace;
  font-size:10px;
  color:var(--accent2);
  text-transform:uppercase;
  letter-spacing:.08em;
  margin-bottom:10px}
.hash-box {
  border:1px solid var(--border);
  background:var(--bg3);
  border-radius:8px;
  padding:12px;
  font-family:"DM Mono", monospace;
  font-size:11px;
  color:var(--text2);
  word-break:break-all}
.chain-meta {
  margin-top:10px;
  font-family:"DM Mono", monospace;
  font-size:10px;
  color:var(--text3)}
.chain-note, .notarize-prompt {
  font-size:12px;
  line-height:1.7;
  color:var(--text2);
  margin:14px 0}
.chain-btn, .notarize-btn {
  width:100%;
  padding:10px 12px;
  border-radius:8px;
  border:1px solid rgba(165, 148, 224, .22);
  background:var(--accent-d);
  color:var(--accent2);
  cursor:pointer}
.notarize-cost {
  font-family:"DM Mono", monospace;
  font-size:11px;
  color:var(--text3);
  margin-bottom:12px}
.toast {
  position:fixed;
  bottom:18px;
  right:18px;
  background:var(--bg3);
  border:1px solid var(--border2);
  border-radius:10px;
  padding:12px 14px;
  color:var(--text2);
  font-size:12px;
  opacity:0;
  transform:translateY(8px);
  pointer-events:none;
  transition:all .18s}
.toast.show {
  opacity:1;
  transform:translateY(0)}
.sb-dashboard {
  --bg:#0a0a11;
  --bg2:#0f0f1a;
  --bg3:#141420;
  --bg-recessed:#08080e;
  --border:rgba(200, 195, 230, .06);
  --border-h:rgba(200, 195, 230, .12);
  --text:#e8e8ec;
  --text2:#87879a;
  --text3:#4e4e62;
  --accent:#a594e0;
  --accent2:#c0b4f0;
  --accent-d:rgba(165, 148, 224, .08);
  --accent-d2:rgba(165, 148, 224, .14);
  --amber:#C9A84C;
  --amber-d:rgba(201, 168, 76, .10);
  --green:#5fba7d;
  --green-d:rgba(95, 186, 125, .09);
  --green-b:rgba(95, 186, 125, .20);
  --red:#c46e6e;
  --red-d:rgba(196, 110, 110, .09);
  --red-b:rgba(196, 110, 110, .20);
  --sq:36px;
  --sqh:34px}
.sidebar {
  background:var(--sidebar-bg);
  display:grid;
  grid-template-rows:minmax(0, 1fr) auto;
  overflow:hidden;
  overscroll-behavior-y:contain}
.sidebar.collapsed .hide-c {
  opacity:0;
  pointer-events:none;
  width:0;
  max-width:0;
  overflow:hidden;
  white-space:nowrap;
  margin:0;
  padding:0}
.sidebar.collapsed .sb-head {
  padding:10px 7px 6px;
  border-bottom:none}
.sidebar.collapsed .logo {
  display:none}
.sidebar.collapsed .collapse-btn {
  width:var(--sq);
  height:var(--sqh);
  margin:0 auto;
  border-radius:8px}
.sidebar.collapsed .action-row {
  flex-direction:column;
  gap:2px;
  padding:0 7px}
.sidebar.collapsed .new-note-sq {
  width:var(--sq);
  height:var(--sqh);
  margin:0 auto}
.sidebar.collapsed .search-wrap {
  width:var(--sq);
  height:var(--sqh);
  min-width:var(--sq);
  flex:none;
  margin:0 auto}
.sidebar.collapsed .search-wrap input {
  padding:0;
  text-indent:-999px;
  cursor:pointer}
.sidebar.collapsed .search-wrap .s-icon {
  left:50%;
  transform:translate(-50%, -50%)}
.sidebar.collapsed .sb-section {
  display:none}
.sidebar.collapsed .nav-group {
  padding:2px 7px;
  gap:2px}
.sidebar.collapsed .nav-item {
  padding:0;
  width:var(--sq);
  height:var(--sqh);
  justify-content:center;
  margin:0 auto;
  border-radius:8px}
.sidebar.collapsed .pinned-cards {
  padding:2px 7px 0;
  gap:2px}
.sidebar.collapsed .pin-item {
  border-radius:8px}
.sidebar.collapsed .pin-row {
  padding:0;
  width:var(--sq);
  height:var(--sqh);
  justify-content:center;
  margin:0 auto;
  gap:0}
.sidebar.collapsed .pin-chevron {
  display:none}
.sidebar.collapsed .pin-icon-c {
  display:flex}
.sidebar.collapsed .pin-expand {
  max-height:0!important;
  padding:0!important}
.sidebar.collapsed .c-divider {
  display:block;
  height:1px;
  margin:4px 7px;
  background:var(--border)}
.sidebar.collapsed .sb-footer {
  padding:6px 7px 10px}
.sidebar.collapsed .sb-footer-inner {
  gap:2px}
.sidebar.collapsed .footer-row {
  width:var(--sq);
  height:var(--sqh);
  margin:0 auto;
  justify-content:center;
  border-radius:8px;
  gap:0;
  padding:0}
.sidebar.collapsed .footer-row.credits-row {
  width:var(--sq);
  height:var(--sqh);
  padding:0;
  margin:0 auto}
.sidebar-scroll {
  min-height:0;
  overflow-y:auto;
  overflow-x:hidden;
  overscroll-behavior-y:contain;
  touch-action:pan-y;
  padding-bottom:6px}
.sidebar-scroll::-webkit-scrollbar {
  width:3px}
.sidebar-scroll::-webkit-scrollbar-track {
  background:transparent}
.sidebar-scroll::-webkit-scrollbar-thumb {
  background:rgba(255, 255, 255, .06);
  border-radius:3px}
.sb-head {
  padding:14px 14px 12px;
  border-bottom:1px solid var(--border);
  transition:padding .24s var(--ease), border-color .24s}
.logo {
  display:flex;
  align-items:center;
  gap:0;
  margin-bottom:12px;
  overflow:hidden;
  white-space:nowrap}
.logo-text {
  font-size:15px;
  font-weight:600;
  color:var(--text);
  letter-spacing:-.02em;
  font-family:"DM Sans", sans-serif}
.collapse-btn {
  width:26px;
  height:26px;
  margin-left:auto;
  border:1px solid var(--border);
  border-radius:6px;
  background:transparent;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  color:var(--text3);
  transition:all .15s var(--ease);
  flex-shrink:0}
.collapse-btn:hover {
  border-color:var(--border-h);
  color:var(--text2);
  background:rgba(255, 255, 255, .025)}
.action-row {
  display:flex;
  align-items:center;
  gap:6px;
  padding:10px 14px 0;
  transition:padding .24s var(--ease)}
.new-note-sq {
  width:32px;
  height:32px;
  flex-shrink:0;
  background:var(--accent-d);
  border:1px solid rgba(165, 148, 224, .18);
  border-radius:8px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  color:var(--accent2);
  transition:all .18s var(--ease)}
.new-note-sq:hover {
  background:var(--accent-d2);
  border-color:rgba(165, 148, 224, .30);
  box-shadow:0 2px 12px rgba(165, 148, 224, .08)}
.new-note-sq:active {
  transform:translateY(.5px)}
.new-note-sq svg {
  width:14px;
  height:14px}
.search-wrap {
  flex:1;
  min-width:0;
  position:relative;
  height:32px;
  transition:all .24s var(--ease)}
.search-wrap input {
  width:100%;
  height:100%;
  padding:0 32px 0 30px;
  background:var(--bg-recessed);
  border:1px solid var(--border);
  border-radius:7px;
  font-size:12px;
  font-family:inherit;
  color:var(--text2);
  outline:none;
  transition:border-color .15s, background .15s}
.search-wrap input::placeholder {
  color:var(--text3)}
.search-wrap input:hover {
  border-color:var(--border-h)}
.search-wrap input:focus {
  border-color:rgba(165, 148, 224, .25);
  background:var(--bg2)}
.s-icon {
  position:absolute;
  left:9px;
  top:50%;
  transform:translateY(-50%);
  color:var(--text3);
  pointer-events:none;
  transition:left .24s var(--ease)}
.search-shortcut {
  position:absolute;
  right:7px;
  top:50%;
  transform:translateY(-50%);
  font-family:"DM Mono", monospace;
  font-size:9px;
  color:var(--text3);
  background:rgba(255, 255, 255, .03);
  border:1px solid var(--border);
  border-radius:3px;
  padding:1px 4px;
  pointer-events:none;
  line-height:1.4}
.sb-section {
  display:flex;
  align-items:center;
  gap:8px;
  padding:14px 14px 5px}
.sec-label {
  font-family:"DM Mono", monospace;
  font-size:9px;
  letter-spacing:.13em;
  text-transform:uppercase;
  color:var(--text3);
  font-weight:500;
  flex-shrink:0}
.sec-line {
  flex:1;
  height:1px;
  background:linear-gradient(90deg, var(--border), transparent 80%)}
.c-divider {
  display:none}
.nav-group {
  padding:0 6px;
  display:flex;
  flex-direction:column;
  gap:1px}
.nav-item {
  display:flex;
  align-items:center;
  gap:9px;
  padding:7px 10px;
  height:33px;
  font-size:12.5px;
  font-weight:400;
  font-family:inherit;
  color:var(--text2);
  cursor:pointer;
  border:none;
  border-radius:6px;
  background:transparent;
  text-align:left;
  width:100%;
  transition:all .15s var(--ease)}
.nav-item:hover {
  color:var(--text);
  background:rgba(255, 255, 255, .025)}
.nav-item:hover .nav-icon {
  opacity:.65}
.nav-item.active {
  color:var(--text);
  font-weight:500;
  background:rgba(255, 255, 255, .035);
  border-left:none}
.nav-item.active .nav-icon {
  opacity:.85}
.nav-icon {
  width:15px;
  height:15px;
  flex-shrink:0;
  opacity:.35;
  color:currentColor;
  transition:opacity .15s}
.nav-count {
  margin-left:auto;
  font-family:"DM Mono", monospace;
  font-size:10px;
  color:var(--text3);
  background:rgba(255, 255, 255, .03);
  border:1px solid var(--border);
  padding:1px 7px;
  border-radius:10px;
  font-variant-numeric:tabular-nums}
.pinned-list {
  padding:2px 0 0}
.pinned-cards {
  padding:2px 6px 0;
  display:flex;
  flex-direction:column;
  gap:1px}
.pin-item {
  display:flex;
  flex-direction:column;
  padding:0;
  cursor:pointer;
  text-align:left;
  width:100%;
  border:none;
  border-radius:6px;
  background:transparent;
  overflow:hidden;
  font-family:inherit;
  transition:background .15s var(--ease)}
.pin-item:hover {
  background:rgba(255, 255, 255, .025)}
.pin-item.active {
  border-left:none;
  background:rgba(255, 255, 255, .025)}
.pin-row {
  display:flex;
  align-items:center;
  gap:8px;
  padding:7px 10px;
  min-height:33px}
.pin-chevron {
  width:12px;
  height:12px;
  flex-shrink:0;
  color:var(--text3);
  transition:transform .2s var(--ease), color .15s}
.pin-item.expanded .pin-chevron {
  transform:rotate(90deg);
  color:var(--text2)}
.pin-title {
  font-size:12px;
  font-weight:500;
  color:var(--text);
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  flex:1;
  min-width:0}
.pin-meta {
  display:flex;
  align-items:center;
  gap:5px;
  flex-shrink:0}
.pin-pnl {
  font-family:"DM Mono", monospace;
  font-size:10px;
  font-weight:500;
  font-variant-numeric:tabular-nums;
  padding:1px 6px;
  border-radius:3px}
.pin-pnl.pos {
  color:var(--green);
  background:var(--green-d)}
.pin-pnl.neg {
  color:var(--red);
  background:var(--red-d)}
.pin-expand {
  max-height:0;
  overflow:hidden;
  transition:max-height .25s var(--ease), padding .25s var(--ease);
  padding:0 10px 0 30px}
.pin-item.expanded .pin-expand {
  max-height:80px;
  padding:0 10px 8px 30px}
.pin-desc {
  font-size:10.5px;
  color:var(--text2);
  line-height:1.45;
  margin-bottom:4px}
.pin-detail-row {
  display:flex;
  align-items:center;
  gap:5px}
.pin-pair {
  font-family:"DM Mono", monospace;
  font-size:9.5px;
  color:var(--text3);
  text-transform:uppercase}
.pin-date {
  font-family:"DM Mono", monospace;
  font-size:9.5px;
  color:var(--text3)}
.pin-icon-c {
  display:none;
  width:15px;
  height:15px;
  color:var(--text3);
  opacity:.4}
.sb-footer {
  padding:10px 14px 12px;
  border-top:1px solid var(--border);
  height:auto;
  background:var(--sidebar-bg);
  transition:padding .24s var(--ease)}
.sb-footer-inner {
  display:flex;
  flex-direction:column;
  gap:5px}
.footer-row {
  display:flex;
  align-items:center;
  gap:7px;
  font-size:11px;
  padding:2px 0;
  transition:all .15s}
.footer-row.clickable {
  cursor:pointer;
  border-radius:6px}
.footer-row.clickable:hover {
  color:var(--text);
  background:rgba(255, 255, 255, .02)}
.footer-row.clickable:hover .footer-copy {
  opacity:1}
.wallet-dot {
  width:6px;
  height:6px;
  border-radius:50%;
  flex-shrink:0;
  background:var(--green);
  box-shadow:0 0 6px rgba(95, 186, 125, .5);
  animation:pulse-dot 2.5s ease-in-out infinite}
.footer-label {
  color:var(--text3)}
.footer-val {
  color:var(--text2);
  margin-left:auto;
  font-variant-numeric:tabular-nums}
.footer-val.amber {
  color:var(--amber);
  font-weight:600}
.footer-icon {
  flex-shrink:0;
  color:var(--text3)}
.footer-copy {
  opacity:0;
  color:var(--text3);
  flex-shrink:0;
  transition:opacity .15s}
.footer-row.credits-row {
  background:var(--amber-d);
  border:1px solid rgba(201, 168, 76, .08);
  border-radius:5px;
  padding:4px 7px;
  margin-top:1px}
@keyframes pulse-dot {
  0%, 100% {
  box-shadow:0 0 6px rgba(95, 186, 125, .5);
  opacity:1}
50% {
  box-shadow:0 0 12px rgba(95, 186, 125, .2);
  opacity:.6}
}
.sidebar.collapsed .sidebar-scroll {
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
  padding:8px 0 10px}
.sidebar.collapsed .sb-head {
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
  padding:0;
  border-bottom:none;
  width:100%;
  flex:none}
.sidebar.collapsed .logo {
  display:flex;
  align-items:center;
  justify-content:center;
  width:100%;
  margin:0}
.sidebar.collapsed .collapse-btn {
  margin:0 auto}
.sidebar.collapsed .action-row {
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
  padding:0;
  width:100%;
  flex:none}
.sidebar.collapsed .nav-group, .sidebar.collapsed .pinned-cards, .sidebar.collapsed .sb-footer-inner {
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:6px;
  padding:0;
  width:100%;
  flex:none}
.sidebar.collapsed .pinned-list {
  padding:0;
  width:100%;
  flex:none}
.sidebar.collapsed .c-divider {
  width:26px;
  margin:2px auto}
.sidebar.collapsed .sb-footer {
  padding:0 0 4px;
  border-top:none;
  background:transparent;
  height:auto;
  flex:none}
.sidebar.collapsed .footer-row, .sidebar.collapsed .nav-item, .sidebar.collapsed .pin-row, .sidebar.collapsed .new-note-sq, .sidebar.collapsed .search-wrap, .sidebar.collapsed .collapse-btn {
  width:var(--sq);
  height:var(--sqh);
  min-width:var(--sq);
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:rgba(255, 255, 255, .025);
  border:1px solid #31123a}
.sidebar.collapsed .nav-item.active {
  background:#6f016f;
  border-color:#a304e7}
.sidebar.collapsed .nav-item:hover, .sidebar.collapsed .pin-row:hover, .sidebar.collapsed .footer-row:hover, .sidebar.collapsed .new-note-sq:hover, .sidebar.collapsed .search-wrap:hover, .sidebar.collapsed .collapse-btn:hover {
  
  border-color:#a304e7}
.sidebar.collapsed .nav-item .nav-icon, .sidebar.collapsed .pin-icon-c, .sidebar.collapsed .footer-icon {
  opacity:.6}
.sidebar.collapsed .pin-item {
  padding:0;
  border:none;
  background:transparent}
.sidebar.collapsed .pin-row {
  cursor:pointer}
.sidebar.collapsed .footer-row {
  padding:0}
.sidebar.collapsed .footer-row.credits-row {
  background:rgba(255, 255, 255, .025);
  border:1px solid #8515d6}
@media (max-height:700px) {
  .sidebar.collapsed .sidebar-scroll {
  gap:4px;
  padding-top:6px}
.sidebar.collapsed .nav-group, .sidebar.collapsed .pinned-cards, .sidebar.collapsed .sb-footer-inner {
  gap:4px}
}
.sidebar.collapsed .collapse-btn, .sidebar.collapsed .new-note-sq, .sidebar.collapsed .search-wrap, .sidebar.collapsed .nav-item, .sidebar.collapsed .pin-row, .sidebar.collapsed .footer-row {
  padding:0!important;
  gap:0!important;
  display:flex;
  align-items:center;
  justify-content:center}
.sidebar.collapsed .nav-item, .sidebar.collapsed .pin-row, .sidebar.collapsed .footer-row {
  line-height:0}
.sidebar.collapsed .nav-icon, .sidebar.collapsed .pin-icon-c, .sidebar.collapsed .footer-icon {
  margin:0 auto;
  display:block}
.sidebar.collapsed .search-wrap .s-icon {
  left:50%!important;
  top:50%!important;
  transform:translate(-50%, -50%)!important}
.sidebar.collapsed .pin-meta, .sidebar.collapsed .pin-title, .sidebar.collapsed .pin-chevron {
  display:none!important}
.sidebar.collapsed .nav-item>*:not(.nav-icon), .sidebar.collapsed .footer-row>*:not(.footer-icon):not(.wallet-dot) {
  display:none!important}
.sidebar.collapsed .wallet-dot {
  margin:0 auto}
.sidebar.collapsed .pin-item {
  display:flex;
  align-items:center;
  justify-content:center}
.sidebar.collapsed .pinned-cards {
  align-items:center}
.sidebar.collapsed .nav-group {
  align-items:center}
.pre-nav-divider {
  height:1px;
  margin:8px 14px 0;
  background:var(--border)}
.sidebar.collapsed .pre-nav-divider {
  width:26px;
  margin:2px auto 0}
.collapse-inline {
  margin-left:0;
  flex-shrink:0}
.collapse-top-only {
  display:none}
.sidebar:not(.collapsed) .collapse-inline {
  display:flex}
.sidebar:not(.collapsed) .collapse-top-only {
  display:none}
.sidebar:not(.collapsed) .logo {
  display:none}
.sidebar:not(.collapsed) .sb-head {
  padding:8px 14px 10px}
.sidebar:not(.collapsed) .action-row {
  padding-top:0}
.sidebar.collapsed .collapse-inline {
  display:none!important}
.sidebar.collapsed .collapse-top-only {
  display:flex!important}
.sb-dashboard, .layout {
  overflow:hidden}
.sidebar {
  position:fixed!important;
  top:var(--titlebar-h)!important;
  left:0!important;
  bottom:0!important;
  height:auto!important;
  max-height:calc(100dvh - var(--titlebar-h))!important;
  overflow:hidden!important}
.sidebar-scroll {
  height:100%!important;
  max-height:100%!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  overscroll-behavior-y:contain!important}
.titlebar {
  position:fixed!important;
  top:0!important;
  left:0!important;
  right:0!important;
  z-index:20!important}
.layout {
  margin-top:var(--titlebar-h)!important;
  height:calc(100dvh - var(--titlebar-h))!important}
.sidebar {
  position:fixed!important;
  top:0!important;
  left:0!important;
  bottom:0!important;
  height:100dvh!important;
  max-height:100dvh!important;
  padding-top:var(--titlebar-h)!important;
  border-right:1px solid var(--border)!important;
  z-index:18!important}
.sidebar-scroll {
  height:100%!important;
  max-height:100%!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  overscroll-behavior-y:contain!important}
.sb-dashboard, .layout {
  overflow:hidden!important}
.titlebar {
  display:flex!important;
  align-items:center;
  justify-content:flex-end;
  gap:10px;
  padding:0 14px!important;
  position:fixed!important;
  top:0!important;
  left:0!important;
  right:0!important;
  z-index:20!important;
  background:var(--topbar-bg)!important;
  backdrop-filter:blur(10px)}
.tb-left {
  display:flex;
  align-items:center;
  gap:10px;
  min-width:0}
.tb-actions {
  display:flex;
  align-items:center;
  gap:6px}
.tb-right {
  display:flex;
  align-items:center;
  justify-content:flex-end}
.tb-action-btn {
  height:26px;
  padding:0 10px;
  border:1px solid var(--border);
  border-radius:6px;
  background:rgba(255, 255, 255, .02);
  color:var(--text2);
  font-size:11px;
  cursor:pointer;
  white-space:nowrap}
.tb-action-btn:hover {
  border-color:var(--border2);
  color:var(--text)}
.tb-center-wrap {
  position:fixed;
  left:calc(50% + 30px);
  top:calc(var(--titlebar-h) / 2);
  transform:translate(-50%, -50%);
  width:min(560px, calc(100vw - 220px));
  min-width:220px}
.tb-search-wrap {
  width:100%;
  position:relative}
.tb-search-icon {
  position:absolute;
  left:10px;
  top:50%;
  transform:translateY(-50%);
  color:var(--text3);
  pointer-events:none}
.tb-search-input {
  width:100%;
  height:28px;
  border-radius:7px;
  border:1px solid var(--border);
  background:rgba(255, 255, 255, .02);
  color:var(--text2);
  font-size:11px;
  padding:0 10px 0 30px;
  outline:none}
.tb-search-input::placeholder {
  color:var(--text3)}
.tb-search-input:hover {
  border-color:#8515d6}
.tb-search-input:focus {
  border-color:#a304e7;
  box-shadow:0 0 0 1px rgba(163, 4, 231, .22)}
.tb-center {
  display:none}
@media (max-width:1180px) {
  .tb-search-wrap {
  width:100%}
}
@media (max-width:980px) {
  .tb-center-wrap {
  left:calc(50% + 70px);
  width:min(460px, calc(100vw - 170px))}
  .tb-actions .tb-action-btn:last-child {
  display:none}
}

/* Editor Redesign Override (visual only) */
.editor {
}
.editor-topbar {
  height:56px!important;
  padding:0 20px!important;
  border-bottom:1px solid rgba(255, 255, 255, .075)!important;
}
.breadcrumb {
  font-size:12px!important;
  color:var(--text2)!important;
  max-width:60%!important;
}
.ed-actions {
  gap:8px!important;
}
.act-btn {
  height:32px!important;
  padding:0 14px!important;
  border-radius:9px!important;
  border:1px solid var(--border2)!important;
  color:var(--text2)!important;
}
.act-btn.primary {
  border-color:rgba(165, 148, 224, .34)!important;
  color:var(--accent2)!important;
}
.toolbar {
  min-height:52px!important;
  padding:0 20px!important;
  border-bottom:1px solid rgba(255, 255, 255, .075)!important;
  gap:10px!important;
}
.toolbar-group {
  gap:8px!important;
}
.toolbar-group.left,
.toolbar-group.mid,
.toolbar-group.right {
  border:1px solid rgba(255, 255, 255, .07);
  border-radius:10px;
  padding:4px;
}
.toolbar-group.mid {
  border-inline:1px solid rgba(255, 255, 255, .07)!important;
  padding-inline:4px!important;
}
.tb-btn {
  min-width:34px!important;
  height:32px!important;
  padding:0 10px!important;
  border-radius:8px!important;
  color:var(--text3)!important;
  font-size:11px!important;
  letter-spacing:.06em!important;
}
.tb-btn:hover {
  color:var(--accent2)!important;
}
.tb-btn.on {
  color:var(--accent2)!important;
  border:1px solid rgba(165, 148, 224, .38)!important;
}
.ed-body {
  padding:38px 56px 56px!important;
  overflow:visible!important;
}
.ed-body > .note-title,
.ed-body > .note-meta,
.ed-body > .note-content {
  width:min(980px, 100%);
  margin-left:auto;
  margin-right:auto;
}
.editor.with-left .ed-body {
  padding-left:20px!important;
}
.editor.with-left .ed-body > .note-title,
.editor.with-left .ed-body > .note-meta,
.editor.with-left .ed-body > .note-content {
  width:100%;
  max-width:none!important;
  margin-left:0;
  margin-right:0;
}
.note-title {
  font-size:52px!important;
  line-height:1.04!important;
  margin-bottom:10px!important;
  color:var(--text)!important;
}
.note-meta {
  margin-bottom:24px!important;
  padding-bottom:16px!important;
  font-size:12px!important;
  color:var(--text3)!important;
  border-bottom:1px solid rgba(255, 255, 255, .075)!important;
}
.note-content {
  font-size:15px!important;
  line-height:1.85!important;
  color:var(--text2)!important;
}
.draft-textarea {
  min-height:300px!important;
  border-radius:12px;
  padding:6px 2px!important;
}
.trade-card,
.code-block,
.chain-card {
  border:1px solid rgba(255, 255, 255, .1)!important;
  border-radius:12px!important;
}

/* Shared panel layout: collapsed = full-width canvas */
.editor-workspace {
  flex:1;
  min-height:0;
  display:grid;
  grid-template-columns:minmax(0, 1fr);
  transition:none!important;
}
.editor.with-left .editor-workspace {
  grid-template-columns:292px minmax(0, 1fr);
}
.editor.with-details .editor-workspace {
  grid-template-columns:minmax(0, 1fr) 332px;
}
.editor.with-left.with-details .editor-workspace {
  grid-template-columns:292px minmax(0, 1fr) 332px;
}
.editor.full-canvas .editor-workspace {
  grid-template-columns:minmax(0, 1fr)!important;
}
.editor-canvas {
  min-width:0;
  min-height:0;
  height:auto;
}
.editor-left-panel {
  min-width:0;
  border-right:1px solid rgba(255, 255, 255, .1);
  background:var(--bg2);
  overflow:hidden;
  display:block;
}
.editor-left-panel .panel {
  width:100%!important;
  min-width:0!important;
  height:100%!important;
  border:none!important;
  background:transparent!important;
}
.editor-right-panel {
  min-width:0;
  width:100%;
  border-left:1px solid rgba(255, 255, 255, .1);
  background:var(--bg2);
  overflow:hidden;
  display:block;
}
.editor.full-canvas .editor-left-panel,
.editor.full-canvas .editor-right-panel {
  display:none!important;
}
.rp {
  width:100%!important;
  min-width:0!important;
  height:100%!important;
  border:none!important;
  border-radius:0!important;
  background:transparent!important;
  box-shadow:none!important;
  overflow:hidden;
}
.rp.hidden {
  width:100%!important;
  min-width:0!important;
  border:none!important;
}
.rp-head {
  background:rgba(255, 255, 255, .01);
  border-bottom:1px solid rgba(255, 255, 255, .08)!important;
}
.rp-tabs {
  border-bottom:1px solid rgba(255, 255, 255, .08)!important;
}
.rp-body {
  padding:14px!important;
}
.editor.full-canvas .ed-body {
  padding:0!important;
}
.editor.full-canvas .ed-body > .note-title,
.editor.full-canvas .ed-body > .note-meta,
.editor.full-canvas .ed-body > .note-content {
  width:100%!important;
  max-width:none!important;
  margin:0!important;
  padding-left:24px!important;
  padding-right:24px!important;
  min-width:0!important;
}
.editor.full-canvas .note-title {
  margin-top:28px!important;
}
@media (max-width: 1024px) {
  .editor.with-left .editor-workspace {
    grid-template-columns:272px minmax(0, 1fr);
  }
  .editor.with-details .editor-workspace {
    grid-template-columns:minmax(0, 1fr) 300px;
  }
  .editor.with-left.with-details .editor-workspace {
    grid-template-columns:272px minmax(0, 1fr) 300px;
  }
  .editor.full-canvas .ed-body > .note-title,
  .editor.full-canvas .ed-body > .note-meta,
  .editor.full-canvas .ed-body > .note-content {
    padding-left:16px!important;
    padding-right:16px!important;
  }
}
@media (max-width: 860px) {
  .editor-left-panel,
  .editor-right-panel {
    display:none;
  }
}

/* Sticky lock: final override to defeat older duplicate rules above */
.editor {
  overflow-y:auto!important;
  overflow-x:hidden!important;
  position:relative;
}
.editor-strip {
  position:sticky!important;
  top:0!important;
  z-index:40!important;
}
.editor-workspace,
.editor-canvas,
.ed-body {
  height:auto!important;
  max-height:none!important;
  min-height:0!important;
  overflow:visible!important;
}
.ed-body {
  overflow:visible!important;
}
`;

const dashboardStabilityStyles = `
.sb-dashboard{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}
.sb-dashboard > .layout{max-height:calc(100dvh - var(--titlebar-h))!important}
`;

const sidebarRailFix = `.sb-dashboard::before{display:none!important}`;

const dashboardScrollFixStyles = `
html,body{height:100%}
body{overflow:hidden!important}
.sb-dashboard{height:100dvh!important;max-height:100dvh!important;overflow:hidden!important}
.sb-dashboard>.layout{height:calc(100dvh - var(--titlebar-h))!important;min-height:0!important;overflow:hidden!important}
.home-scroll-region{height:100%!important;min-height:0!important;overflow-y:scroll!important;overflow-x:hidden!important;scrollbar-gutter:stable}
.sidebar-scroll{scrollbar-width:none}
.sidebar-scroll::-webkit-scrollbar{width:0;height:0}
`;

export function DashboardApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [panelHidden, setPanelHidden] = useState(true);
  const [detailsHidden, setDetailsHidden] = useState(true);
  const [activeView, setActiveView] = useState<NoteView>("home");
  const [activeFilter, setActiveFilter] = useState<NoteFilter>("all");
  const [activeNoteId, setActiveNoteId] = useState<NoteId | null>(null);
  const [detailsTab, setDetailsTab] = useState<"info" | "linked" | "chain">("info");
  const [search, setSearch] = useState("");
  const [compactView, setCompactView] = useState(true);
  const [toolbarActive, setToolbarActive] = useState<number[]>([]);
  const [editorTitle, setEditorTitle] = useState("Home");
  const [aiValue, setAiValue] = useState("");
  const [toast, setToast] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);
  const [draftMode, setDraftMode] = useState(false);
  const [draftBody, setDraftBody] = useState("");
  const [draftBlocks, setDraftBlocks] = useState<DraftEditorBlock[]>([]);
  const [agentOpen, setAgentOpen] = useState(false);

  const filteredNotes = useMemo(
    () =>
      MOCK_NOTES.filter((note) => {
        const matchesView = activeView === "all" || activeView === "home" || note.view === activeView;
        const matchesFilter = activeFilter === "all" || note.filters.includes(activeFilter);
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          note.title.toLowerCase().includes(query) ||
          note.preview.toLowerCase().includes(query) ||
          note.related.some((relation) => relation.title.toLowerCase().includes(query));
        return matchesView && matchesFilter && matchesSearch;
      }),
    [activeFilter, activeView, search],
  );

  const activeNote = draftMode ? null : MOCK_NOTES.find((note) => note.id === activeNoteId) ?? null;

  useEffect(() => {
    if (activeView === "home") {
      setEditorTitle("Home");
      return;
    }
    if (activeNote) {
      setEditorTitle(activeNote.title);
    }
  }, [activeNote, activeView]);

  useEffect(() => {
    if (!draftMode && filteredNotes.length && !filteredNotes.some((note) => note.id === activeNoteId)) {
      setActiveNoteId(filteredNotes[0].id);
    }
  }, [activeNoteId, draftMode, filteredNotes]);

  useEffect(() => {
    if (!activeNote) {
      setPanelHidden(true);
      setDetailsHidden(true);
    }
  }, [activeNote]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string) => setToast(message);

  const handleSelectView = (view: NoteView) => {
    setActiveView(view);
    setActiveFilter("all");
    setDraftMode(false);
    setDraftBody("");
    setDraftBlocks([]);
    setAgentOpen(false);
    if (view === "home") {
      setActiveNoteId(null);
      setEditorTitle("Home");
      return;
    }
    const first = MOCK_NOTES.find((note) => view === "all" || note.view === view);
    setActiveNoteId(first?.id ?? null);
  };

  const handleNewNote = () => {
    setDraftMode(true);
    setEditorTitle("Untitled");
    setDraftBody("");
    setDraftBlocks([]);
    setAgentOpen(false);
    setDetailsTab("info");
    showToast("New note created");
  };

  const handleSelectNote = (id: NoteId) => {
    setDraftMode(false);
    setDraftBody("");
    setDraftBlocks([]);
    setAgentOpen(false);
    setActiveNoteId(id);
  };

  const insertCodeBlock = () => {
    if (!draftMode) return;
    const id = `code-${Date.now().toString(36)}`;
    setDraftBlocks((current) => [
      ...current,
      {
        id,
        type: "code",
        code: "// Position size - 15% book at $142\nconst calcPos = (book: number, pct: number, entry: number) => ({\n  usdc: book * (pct / 100),\n  tokens: (book * pct / 100) / entry,\n  risk: (book * pct / 100) * 0.049,\n});",
      },
    ]);
    showToast("Code block inserted");
  };

  const insertTradeBlock = () => {
    if (!draftMode) return;
    const id = `trade-${Date.now().toString(36)}`;
    const trade: TradeTemplateBlock = {
      pair: "SOL / USDC",
      entry: "$142.00",
      current: "$159.60",
      invalidation: "$135.00",
      conviction: "8 / 10",
      thesis:
        "Firedancer catalyst breakout with defined invalidation. Size follows risk plan and conviction score.",
    };
    setDraftBlocks((current) => [...current, { id, type: "trade", trade }]);
    showToast("Trade card inserted");
  };

  const handleCodeBlockChange = (blockId: string, code: string) => {
    setDraftBlocks((current) =>
      current.map((block) => (block.id === blockId && block.type === "code" ? { ...block, code } : block)),
    );
  };

  const handleTradeBlockChange = (blockId: string, trade: TradeTemplateBlock) => {
    setDraftBlocks((current) =>
      current.map((block) => (block.id === blockId && block.type === "trade" ? { ...block, trade } : block)),
    );
  };

  const handleRemoveDraftBlock = (blockId: string) => {
    setDraftBlocks((current) => current.filter((block) => block.id !== blockId));
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText("code copied");
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 1500);
    } catch {
      showToast("Clipboard unavailable");
    }
  };

  const handleExportPdf = ({ title, html }: { title: string; html: string }) => {
    const escapeHtml = (value: string) =>
      value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const printableTitle = title.trim() || "Untitled note";
    const printableHtml = html.trim() || "<p></p>";
    const safeTitle = escapeHtml(printableTitle);
    const popup = window.open("", "_blank", "width=1024,height=768");

    if (!popup) {
      showToast("Popup blocked. Allow popups to export PDF.");
      return;
    }

    popup.document.open();
    popup.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${safeTitle}</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 40px 48px;
        color: #0f172a;
        background: #ffffff;
        font-family: "Georgia", "Times New Roman", serif;
        line-height: 1.7;
      }
      .doc-title {
        margin: 0 0 22px;
        font-size: 32px;
        line-height: 1.2;
      }
      .content { font-size: 15px; }
      .content h1 { font-size: 30px; margin: 18px 0 10px; }
      .content h2 { font-size: 24px; margin: 16px 0 8px; }
      .content ul { margin: 10px 0 10px 24px; }
      .content p { margin: 0 0 10px; }
      .content pre, .content code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      }
      .content .pdf-block {
        border: 1px solid #d5d9e3;
        border-radius: 10px;
        padding: 14px;
        margin: 14px 0;
      }
      .content .pdf-block h3 {
        margin: 0 0 10px;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: .06em;
        color: #475569;
      }
      .content .pdf-code pre {
        margin: 0;
        padding: 12px;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        white-space: pre-wrap;
      }
      .content .pdf-trade-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 12px;
      }
      .content .pdf-trade-grid span {
        display: block;
        font-size: 11px;
        color: #64748b;
        margin-bottom: 2px;
      }
      .content .pdf-trade-grid strong {
        font-size: 16px;
        color: #0f172a;
      }
      @page { size: auto; margin: 14mm; }
    </style>
  </head>
  <body>
    <h1 class="doc-title">${safeTitle}</h1>
    <div class="content">${printableHtml}</div>
  </body>
</html>`);
    popup.document.close();
    popup.onload = () => {
      popup.focus();
      popup.print();
    };
  };

  return (
    <main className={`sb-dashboard${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
      <style jsx global>{dashboardStyles}</style>
      <style jsx global>{sidebarRailFix}</style>
      <style jsx global>{dashboardStabilityStyles}</style>
      <style jsx global>{dashboardScrollFixStyles}</style>
      <Titlebar
        title={editorTitle}
      />
      <div className={`layout${sidebarCollapsed ? " sidebar-collapsed" : ""}`}>
        <Sidebar
          collapsed={sidebarCollapsed}
          activeView={activeView}
          activeNoteId={draftMode ? null : activeNoteId}
          notes={MOCK_NOTES}
          search={search}
          onSearchChange={setSearch}
          onCollapse={() => setSidebarCollapsed((value) => !value)}
          onNewNote={handleNewNote}
          onSelectView={handleSelectView}
          onSelectNote={handleSelectNote}
        />
        {activeView === "home" ? (
          <div className="home-scroll-region flex-1 min-h-0">
            <HomePage />
          </div>
        ) : (
          <>
            <NoteEditor
              note={activeNote}
              title={editorTitle}
              draftBody={draftBody}
              draftBlocks={draftBlocks}
              panelHidden={panelHidden}
              detailsHidden={detailsHidden}
              toolbarActive={toolbarActive}
              copiedCode={copiedCode}
              aiValue={aiValue}
              agentOpen={agentOpen}
              leftPanel={
                <NotesPanel
                  hidden={false}
                  activeView={activeView}
                  activeFilter={activeFilter}
                  compactView={compactView}
                  activeNoteId={draftMode ? null : activeNoteId}
                  notes={filteredNotes}
                  onToggleCompact={setCompactView}
                  onSelectFilter={setActiveFilter}
                  onSelectNote={handleSelectNote}
                />
              }
              rightPanel={
                <DetailsPanel
                  hidden={false}
                  activeTab={detailsTab}
                  note={activeNote}
                  onClose={() => setDetailsHidden(true)}
                  onChangeTab={setDetailsTab}
                  onToast={showToast}
                />
              }
              onTogglePanel={() => setPanelHidden((value) => !value)}
              onToggleDetails={() => setDetailsHidden((value) => !value)}
              onToggleAgent={() => setAgentOpen((value) => !value)}
              onTitleChange={setEditorTitle}
              onDraftBodyChange={setDraftBody}
              onInsertCodeBlock={insertCodeBlock}
              onInsertTradeBlock={insertTradeBlock}
              onExportPdf={handleExportPdf}
              onCodeBlockChange={handleCodeBlockChange}
              onTradeBlockChange={handleTradeBlockChange}
              onRemoveBlock={handleRemoveDraftBlock}
              onToggleToolbar={(index) =>
                setToolbarActive((current) =>
                  current.includes(index) ? current.filter((item) => item !== index) : [...current, index],
                )
              }
              onShare={() => showToast("Link copied to clipboard")}
              onCopyCode={handleCopyCode}
              onAiChange={setAiValue}
              onAskAi={() => {
                if (aiValue.trim()) {
                  showToast(`AI: "${aiValue.trim().slice(0, 42)}${aiValue.trim().length > 42 ? "…" : ""}"…`);
                  setAiValue("");
                }
              }}
              onAiShortcut={setAiValue}
            />
          </>
        )}
      </div>
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </main>
  );
}
