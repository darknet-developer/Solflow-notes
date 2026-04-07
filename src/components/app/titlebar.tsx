type TitlebarProps = {
  title: string;
};

export function Titlebar({ title }: TitlebarProps) {
  return (
    <div className="titlebar">
      <div className="tb-center-wrap">
        <div className="tb-search-wrap">
          <svg className="tb-search-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
          <input
            className="tb-search-input"
            type="text"
            placeholder={`Global + all search in ${title.toLowerCase()}`}
            aria-label="Global and all search"
          />
        </div>
      </div>

      <div className="tb-right">
        <div className="tb-actions">
          <button type="button" className="tb-action-btn">Copy Link</button>
          <button type="button" className="tb-action-btn">Quick</button>
        </div>
      </div>
    </div>
  );
}
