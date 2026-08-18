const mailAsciiArt = `     ______________________
    |\\                    /|
    | \\                  / |
    |  \\                /  |
    |   \\       ✓       /   |
    |    \\            /    |
    |     \\          /     |
    |______\\________/______|`;

function MailIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export function SubscribeSuccess() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-5 pt-24 pb-16 max-w-md mx-auto w-full text-center">
        <pre
          aria-hidden="true"
          className='text-gray-800 leading-[1.15] text-[13px] [font-family:"Space_Mono","Courier_New",monospace] mb-8 select-none'
        >
          {mailAsciiArt}
        </pre>

        <h1 className='text-3xl font-bold text-gray-900 tracking-tight mb-4 [font-family:"Space_Mono","Courier_New",monospace]'>
          Check your inbox
        </h1>

        <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-sm">
          Your welcome package is waiting. If you&apos;re on Gmail, check
          Promotions, move it to Primary so you don&apos;t miss what&apos;s
          coming next.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://mail.google.com/mail/u/0/#inbox"
            target="_blank"
            rel="noopener noreferrer"
            className='flex items-center gap-2 bg-white border border-gray-200 rounded-[4px] px-5 py-3 [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase font-bold text-gray-900 hover:border-gray-400 transition-colors'
          >
            <MailIcon />
            Open Gmail
          </a>
          <a
            href="https://outlook.live.com/mail/0/inbox"
            target="_blank"
            rel="noopener noreferrer"
            className='flex items-center gap-2 bg-white border border-gray-200 rounded-[4px] px-5 py-3 [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase font-bold text-gray-900 hover:border-gray-400 transition-colors'
          >
            <MailIcon />
            Open Outlook
          </a>
        </div>
      </main>

      <footer className="pb-8 px-5">
        <p className='text-center text-[#7e7e7e] [font-family:"Space_Mono","Courier_New",monospace] text-[11px] tracking-[0.55px] uppercase my-0'>
          © 2026 0 → 1 BY MARK
        </p>
      </footer>
    </div>
  );
}
