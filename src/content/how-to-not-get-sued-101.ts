// Body for the hand-written "How to Not Get Sued 101" resource (see lib/resources.ts).
// Authored as semantic HTML to match the .resource-body article styling used by
// imported posts. No em dashes anywhere, per the site's writing rule.
export const HOW_TO_NOT_GET_SUED_101_HTML = `
<p>Happy Monday, issue #1! Two parts each time: vibecoded app issues I see constantly plus how to fix them, and an agent I recently built that you're welcome to steal.</p>

<p>You guys loved my whiteboard video on vibecoded security, so here are 3 more that can get you a meeting with Harvey Specter if you ignore them.</p>

<h2>1. Fake reviews got a price tag of $51,744. Per review.</h2>

<p>Buying reviews, fake testimonials, your team dropping 5 stars on your own product, it used to just be a shady growth hack. Now the FTC's rule against fake reviews carries a civil penalty of <strong>$51,744 per violation</strong>, per review, not per company. It covers AI-generated testimonials too.</p>

<p><strong>The fix.</strong> Tell your AI:</p>
<blockquote><p><em>"Audit every review on the site. Flag any without a verifiable source, only display verified ones, and remove anything untraceable to a real person."</em></p></blockquote>

<h2>2. Anyone can view anyone else's data by changing a number in the URL</h2>

<p>Your app checks someone's logged in, but never that they own the thing they're requesting. Change <code>/orders/104</code> to <code>/orders/105</code> and you've got someone else's data.</p>

<p>Anthropic ran into this in July: shared Claude chats had no "noindex" tag, so Google indexed thousands, medical records and API keys included.</p>

<blockquote><p>Anthropic's own writeup on it, read the full story here:<br>
<a href="https://thenextweb.com/news/claude-shared-chats-artifacts-google-search-indexed" target="_blank" rel="noopener noreferrer">thenextweb.com: Claude shared chats indexed by Google</a></p></blockquote>

<p>It's cached elsewhere now too, and you could face HIPAA, GDPR, or CCPA rules.</p>

<p><strong>The fix.</strong> Tell your AI:</p>
<blockquote><p><em>"Audit every route reachable by a predictable URL. Add noindex and access checks where needed, and verify the requesting user actually owns the resource before returning private data."</em></p></blockquote>

<h2>3. Vibecoders hate disabled people.</h2>

<p>AI tools don't think about accessibility unless you ask: missing alt text, no keyboard navigation, bad contrast. Law firms now scan for this automatically, and a broken alt-text setup can get you a demand letter for thousands, no warning.</p>

<p><strong>The fix.</strong> Tell your AI:</p>
<blockquote><p><em>"Add an accessibility statement targeting WCAG 2.1 AA, then audit for missing alt text, heading structure, and keyboard-navigable forms, and fix what you find."</em></p></blockquote>

<hr>

<h2>This week's build: a stock news bot</h2>

<p>This stock bot has genuinely been helpful for tracking a company I'm invested in. My morning news routine was getting out of hand, so I built a ~250-line Python bot that tracks one stock's news and sends the top 3 headlines to Telegram with direction, range, and confidence.</p>

<blockquote><p>For example, this bot I made to track stock news and score price impact. You can use it for completely free here:<br>
<a href="https://github.com/markpyvo/tradenewsbot" target="_blank" rel="noopener noreferrer">github.com/markpyvo/tradenewsbot</a></p></blockquote>

<p><strong>How it works.</strong> Three Google News RSS feeds pull the last day's articles, and duplicates get skipped by hashing each link.</p>

<p>Every surviving article gets sent to MiniMax M3, prompted to act like an analyst and answer in strict JSON with direction, estimated move, and confidence. If it's not confident, it returns null instead of guessing, since an LLM will invent a plausible number for a headline that says nothing unless you give it a way to say <strong>"I don't know."</strong></p>

<p>Ranking isn't the LLM's job, it's just math: average estimated move times a confidence weight (high counts full, medium less, low least). A 3% move it's unsure about loses to a 2% move it's confident on.</p>

<p>Top 3 get sent to Telegram, the rest get dropped, that's what makes it usable. It runs twice daily via GitHub Actions since Vancouver's UTC offset shifts with daylight saving, so one run's a dud on purpose.</p>

<p>Best,<br>
Mark Pyvovarov</p>
`;
