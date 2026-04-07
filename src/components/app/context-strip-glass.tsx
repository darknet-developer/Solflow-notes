import { useEffect, useMemo, useState } from "react";

type SolState = {
  price: number;
  pct: number;
};

type MockState = {
  sync: { ago: string; ok: boolean };
  queue: number;
  review: number;
  alerts: number;
  sol: SolState;
  pnl: { value: number };
};

const MOCK: MockState = {
  sync: { ago: "2m ago", ok: true },
  queue: 12,
  review: 3,
  alerts: 2,
  sol: { price: 148.32, pct: 2.4 },
  pnl: { value: 142.3 },
};

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ContextStripGlass() {
  const today = useMemo(() => new Date(), []);
  const [sol, setSol] = useState<SolState>(MOCK.sol);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSol((p) => ({
        price: +(p.price + (Math.random() - 0.48) * 2).toFixed(2),
        pct: +((Math.random() - 0.45) * 5).toFixed(1),
      }));
    }, 300_000);
    return () => window.clearInterval(id);
  }, []);

  const pUp = MOCK.pnl.value >= 0;
  const sUp = sol.pct >= 0;

  return (
    <>
      <style>{CSS}</style>

      <nav className="g-strip" aria-label="Dashboard context strip">
        <div className="g-row1">
          <div className="g-left">
            <span className="g-small-home">SOLFLOW / HOME</span>
            <span className="g-date">
              {LONG[today.getDay()].slice(0, 3)}, {MO[today.getMonth()]} {today.getDate()}
            </span>
            <span className="g-tz">UTC+7</span>
          </div>

          <div className="g-status" role="status" aria-label="System status">
            <div className="gs">
              <i className="gd gd-ok" />
              <span>Synced</span>
              <b>{MOCK.sync.ago}</b>
            </div>
            <div className="gs">
              <span>Queue</span>
              <b>{MOCK.queue}</b>
            </div>
            <div className="gs">
              <i className={`gd ${MOCK.review > 5 ? "gd-warn" : "gd-dim"}`} />
              <span>Review</span>
              <b>{MOCK.review}</b>
            </div>
            {MOCK.alerts > 0 && (
              <div className="gs gs-dng">
                <i className="gd gd-dng" />
                <span>Alerts</span>
                <b>{MOCK.alerts}</b>
              </div>
            )}
          </div>

          <div className="g-chips" role="group" aria-label="Key metrics">
            <button className="gc" aria-label={`SOL ${sol.price}`}>
              <span className="gc-l">SOL</span>
              <span className={`gc-v ${sUp ? "up" : "dn"}`}>${sol.price.toFixed(2)}</span>
              <span className={`gc-d ${sUp ? "up" : "dn"}`}>
                {sUp ? "+" : "-"}
                {Math.abs(sol.pct)}%
              </span>
            </button>

            <button className="gc" aria-label={`PnL ${pUp ? "+" : "-"}$${Math.abs(MOCK.pnl.value)}`}>
              <span className="gc-l">PnL</span>
              <span className={`gc-v ${pUp ? "up" : "dn"}`}>
                {pUp ? "+" : "-"}${Math.abs(MOCK.pnl.value).toFixed(2)}
              </span>
            </button>

          </div>
        </div>
      </nav>
    </>
  );
}

const CSS = `
.g-strip{
  --panel:#000000;
  --glass:rgba(255,255,255,0.07);
  --glass-h:rgba(255,255,255,0.11);
  --glass-border:rgba(255,255,255,0.14);
  --glass-border-h:rgba(255,255,255,0.24);
  --glass-shine:linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 50%);
  --ac:#8515d6;
  --ac-h:#a304e7;
  --ac-glow:rgba(133,21,214,0.45);
  --ac-soft:rgba(133,21,214,0.1);
  --ok:#52d58f;
  --warn:#cfa446;
  --dng:#ff6f96;
  --tx:#f0f0f8;
  --tx2:#b9bac9;
  --tx3:#8b8d9f;
  --r:12px;
  --rs:8px;
  --rp:100px;
  --blur:16px;
  --strip-pad-x: 28px;
  background:var(--panel);
  border-bottom:1px solid var(--glass-border);
  position:relative;
}
.g-strip,.g-strip *,.g-strip *::before,.g-strip *::after{box-sizing:border-box}
.g-crumb{position:absolute;top:8px;left:var(--strip-pad-x);z-index:2;font-size:9px;font-weight:500;letter-spacing:2px;color:var(--tx3);text-transform:uppercase}
.g-row1{display:flex;align-items:center;gap:10px;padding:22px var(--strip-pad-x) 8px;flex-wrap:wrap}
.g-left{display:flex;align-items:baseline;gap:10px;flex-shrink:0}
.g-small-home{font-size:10px;font-weight:500;letter-spacing:1.6px;color:var(--tx3);text-transform:uppercase}
.g-greet{font-size:34px;font-weight:600;letter-spacing:-0.4px;color:var(--tx);white-space:nowrap;margin:0}
.g-date{font-size:12px;font-weight:400;color:var(--tx2);white-space:nowrap}
.g-tz{font-size:9px;font-weight:500;color:var(--tx3);background:var(--glass);border:1px solid var(--glass-border);padding:2px 8px;border-radius:var(--rp)}
.g-status{display:flex;align-items:center;gap:5px;margin-left:auto;flex-shrink:0}
.gs{display:flex;align-items:center;gap:5px;padding:5px 11px;border-radius:var(--rs);font-size:11px;font-weight:400;color:var(--tx2);background:var(--glass);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));border:1px solid var(--glass-border);transition:all .2s ease;white-space:nowrap;position:relative;overflow:hidden}
.gs::before{content:"";position:absolute;inset:0;background:var(--glass-shine);pointer-events:none}
.gs:hover{border-color:var(--glass-border-h);background:var(--glass-h)}
.gs b{font-weight:500;font-size:11px;color:var(--tx)}
.gs-dng span,.gs-dng b{color:var(--dng)}
.gd{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.gd-ok{background:var(--ok);box-shadow:0 0 8px rgba(82,213,143,0.5)}
.gd-warn{background:var(--warn);box-shadow:0 0 6px rgba(207,164,70,0.3)}
.gd-dim{background:var(--tx3)}
.gd-dng{background:var(--dng);box-shadow:0 0 8px rgba(255,111,150,0.5);animation:blink 2s ease infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.g-chips{display:flex;align-items:center;gap:5px;flex-shrink:0}
.gc{display:flex;align-items:center;gap:6px;padding:5px 11px;border-radius:var(--rp);font-size:11px;background:var(--glass);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));border:1px solid var(--glass-border);cursor:pointer;transition:all .2s ease;user-select:none;color:var(--tx);position:relative;overflow:hidden}
.gc::before{content:"";position:absolute;inset:0;background:var(--glass-shine);pointer-events:none}
.gc:hover,.gc:focus-visible{border-color:var(--glass-border-h);background:var(--glass-h);box-shadow:0 0 16px rgba(255,255,255,0.02);outline:none}
.gc:focus-visible{box-shadow:0 0 0 2px var(--ac-glow)}
.gc-on{border-color:rgba(133,21,214,0.35);background:var(--ac-soft)}
.gc-l{font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:var(--tx3)}
.gc-v{font-weight:500;font-size:11px}
.gc-d{font-size:8px;font-weight:500}
.gc-v.up,.gc-d.up{color:var(--ok)}
.gc-v.dn,.gc-d.dn{color:var(--dng)}
.gc-ico{width:13px;height:13px;opacity:.4;flex-shrink:0}
.wk{border-top:1px solid var(--glass-border);overflow:hidden}
.wk-head{display:flex;align-items:center;justify-content:space-between;padding:8px var(--strip-pad-x) 0}
.wk-lbl{font-size:11px;font-weight:500;color:var(--tx2);letter-spacing:.3px}
.wk-nav{display:flex;align-items:center;gap:4px}
.wk-btn-today{font-size:9px;font-weight:600;letter-spacing:.7px;text-transform:uppercase;padding:4px 10px;border-radius:var(--rp);border:1px solid var(--glass-border);background:var(--glass);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));color:var(--tx2);cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.wk-btn-today::before{content:"";position:absolute;inset:0;background:var(--glass-shine);pointer-events:none}
.wk-btn-today:hover{border-color:var(--glass-border-h);color:var(--tx);background:var(--glass-h)}
.wk-arr{width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:var(--rs);border:1px solid var(--glass-border);background:var(--glass);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));color:var(--tx2);cursor:pointer;font-size:14px;transition:all .2s;position:relative;overflow:hidden}
.wk-arr::before{content:"";position:absolute;inset:0;background:var(--glass-shine);pointer-events:none}
.wk-arr:hover{border-color:var(--glass-border-h);color:var(--tx);background:var(--glass-h)}
.wk-arr:focus-visible,.wk-btn-today:focus-visible{outline:none;box-shadow:0 0 0 2px var(--ac-glow)}
.wk-days{display:flex;padding:8px var(--strip-pad-x) 6px}
.dy{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 2px;border-radius:var(--r);cursor:pointer;transition:all .2s ease;position:relative;border:1px solid transparent}
.dy:hover{background:var(--glass);border-color:var(--glass-border)}
.dy:focus-visible{outline:none;box-shadow:0 0 0 2px var(--ac-glow);border-color:rgba(133,21,214,0.25)}
.dy-nm{font-size:9px;font-weight:600;letter-spacing:1px;color:var(--tx3);transition:color .2s}
.dy-n{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:13px;font-weight:600;color:var(--tx);transition:all .2s ease}
.dy:hover .dy-n{background:rgba(255,255,255,0.05)}
.dy-today .dy-n{background:var(--ac);color:#fff;box-shadow:0 0 16px var(--ac-glow),inset 0 1px 0 rgba(255,255,255,0.15)}
.dy-today:hover .dy-n{background:var(--ac-h)}
.dy-sel{background:var(--ac-soft)!important;border-color:rgba(133,21,214,0.25)!important}
.dy-sel .dy-nm{color:var(--tx)}
.dy-dots{display:flex;gap:3px;height:5px;align-items:center}
.dy-dot{width:4px;height:4px;border-radius:50%;background:var(--ac);opacity:.45}
.dy-sel .dy-dot,.dy-today .dy-dot{opacity:1;background:var(--ok);box-shadow:0 0 4px rgba(82,213,143,0.4)}
.wk-evts{display:flex;align-items:center;gap:6px;padding:4px var(--strip-pad-x) 10px;overflow-x:auto;scrollbar-width:none}
.wk-evts::-webkit-scrollbar{display:none}
.ev{flex-shrink:0;font-size:11px;font-weight:500;padding:5px 12px;border-radius:var(--rp);background:var(--glass);backdrop-filter:blur(var(--blur));-webkit-backdrop-filter:blur(var(--blur));border:1px solid var(--glass-border);color:var(--tx2);white-space:nowrap;transition:all .2s;position:relative;overflow:hidden}
.ev::before{content:"";position:absolute;inset:0;background:var(--glass-shine);pointer-events:none}
.ev:hover{border-color:var(--glass-border-h);color:var(--tx)}
.ev.ev-more{color:var(--tx3)}
.ev-no{font-size:11px;color:var(--tx3);font-style:italic;padding:5px 0}
@media(max-width:960px){
  .g-strip{--strip-pad-x:20px}
  .g-row1{padding:20px var(--strip-pad-x) 8px;gap:8px}
  .g-crumb{left:var(--strip-pad-x)}
  .g-status{order:3;margin-left:0;width:100%;overflow-x:auto;scrollbar-width:none}
  .g-status::-webkit-scrollbar{display:none}
  .g-chips{order:2;margin-left:auto}
}
@media(max-width:600px){
  .g-strip{--strip-pad-x:14px}
  .g-row1{padding:18px var(--strip-pad-x) 6px}
  .g-crumb{left:var(--strip-pad-x);font-size:8px}
  .g-greet{font-size:24px}
  .gc{padding:4px 9px;gap:4px}
  .gc-l{font-size:8px}
  .gc-v{font-size:10px}
  .dy-n{width:28px;height:28px;font-size:12px}
  .gs{padding:3px 8px;font-size:10px}
  .gs b{font-size:10px}
}
`;
