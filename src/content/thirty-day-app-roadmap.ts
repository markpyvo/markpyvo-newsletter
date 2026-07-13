// Body for the hand-written "30-Day App Roadmap" resource (see lib/resources.ts).
// Authored as semantic HTML to match the .resource-body article styling used by
// imported posts. No em dashes anywhere, per the site's writing rule.
export const THIRTY_DAY_APP_ROADMAP_HTML = `
<p><strong>Build, market, monetize, scale.</strong> One small idea, four weeks, a real app that makes money and doesn't break at 2am.</p>

<p>This is the full playbook behind the carousel. The premise is simple: you don't need six months and a co-founder to ship something real. You need one small idea, a modern AI-assisted stack, and the discipline to move through four phases without skipping ahead. Each week builds on the last: you can't market vapor, can't charge for something nobody wants, and can't scale something that isn't earning. Do them in order.</p>

<p>Each week below has a theme, the mindset that makes it work, a detailed checklist with <em>how</em> to actually do each item, the traps to avoid, and a clear finish line.</p>

<h2>The arc at a glance</h2>

<table>
  <thead>
    <tr><th>Week</th><th>Theme</th><th>The goal</th><th>Finish line</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>🛠️ Build</td><td>Ship a working prototype</td><td>Live app on a real domain (Day 7)</td></tr>
    <tr><td>2</td><td>📣 Market</td><td>Get users + gauge market fit</td><td>Solid feedback + improved app (Day 14)</td></tr>
    <tr><td>3</td><td>💰 Monetize</td><td>Make it pay</td><td>Working paywall + first paying customers (Day 21)</td></tr>
    <tr><td>4</td><td>📈 Scale</td><td>Make it durable</td><td>Growing users, climbing revenue, a repeatable system (Day 30)</td></tr>
  </tbody>
</table>

<p><strong>The one rule that ties it together:</strong> ship embarrassingly early at every stage. A rough app in front of real users on Day 7 teaches you more than a polished one you launch on Day 30. Speed is the strategy.</p>

<hr>

<h2>Week 1: Build</h2>

<p><em>This week is about picking one SMALL idea and shipping a WORKING prototype with Claude Code.</em></p>

<p><strong>The mindset:</strong> The enemy this week isn't difficulty, it's your own perfectionism. Most "founders" spend week one collecting Notion docs, comparing frameworks, and buying domains for apps that never get built. You're going to have a live, working app by Day 7 instead. The way you beat perfectionism is by planning <em>in code</em> rather than on paper: a running skeleton is progress, a beautiful spec is procrastination.</p>

<p><strong>How to pick the idea:</strong> Go small enough that you'd be slightly embarrassed to pitch it. One core action, one type of user, one problem. "A tool that X for people who Y" should fit in a sentence. If you can't describe it in a sentence, it's too big for 30 days.</p>

<h3>The checklist</h3>

<h4>1. Pick one tiny app idea and get Claude to write a PRD.</h4>
<p>A PRD (Product Requirements Document) is the blueprint. Have Claude draft it covering three things: what the app does, who it helps, and what tech stack you'll use. Keep it to one page. The PRD matters because it's what you'll hand to Claude Code next. A clear PRD produces a clean scaffold, a vague one produces mush. Include the core feature and <em>deliberately</em> list what you're NOT building, so scope creep has nowhere to hide.</p>

<h4>2. Paste the PRD into Claude Code and let it scaffold the skeleton.</h4>
<p>This is the leverage moment. Claude Code reads the PRD and generates the project structure for you: React Native frontend and Supabase backend. React Native gives you iOS, Android, and web from one codebase; Supabase gives you a database, auth, and APIs without hand-writing a backend. Let it generate the whole skeleton in one pass, then run it and confirm the core loop works before touching anything else.</p>

<h4>3. Push to GitHub and deploy on Railway.</h4>
<p>Get it off your laptop and onto a real URL. Push the repo to GitHub (this is also your version control and backup), then deploy on Railway so there's a live domain anyone can hit. The bar for "done" this week is <em>core features working</em>, not polish. Ugly and live beats gorgeous and imaginary. You'll fix the looks once you know people actually want it.</p>

<h3>Traps to avoid</h3>
<ul>
  <li><strong>Scope creep.</strong> Every "wouldn't it be cool if..." is a week-two problem at the earliest. Write it down, don't build it.</li>
  <li><strong>Framework shopping.</strong> The stack above works. Don't lose three days comparing alternatives.</li>
  <li><strong>Polishing pixels.</strong> Nobody has used the app yet. There's nothing to polish <em>for</em>.</li>
</ul>

<p><strong>By end of Day 7:</strong> You have a working app on a live domain.</p>

<blockquote><p><strong>The lesson:</strong> Planning on paper is procrastination. Planning in code is progress.</p></blockquote>

<hr>

<h2>Week 2: Market</h2>

<p><em>You can have the best app in the world, but without USERS it's useless. This week is all about marketing and gauging market fit.</em></p>

<p><strong>The mindset:</strong> The app is no longer the point, the <em>feedback</em> is. Week two exists to answer one question: does anyone actually want this? You get that answer by putting the app and the story of building it in front of real people, then watching how they react. Stay unattached to your original idea. The goal isn't to defend what you built; it's to find out what people will use.</p>

<p><strong>Why build in public works:</strong> It solves the two hardest early problems at once. It markets the app (people discover it), and it builds an audience that's rooting for you before you ever ask for money. The building journey itself is the content, people love watching something get made.</p>

<h3>The checklist</h3>

<h4>1. Build in public across short-form video.</h4>
<p>Post videos of your building journey on Instagram, TikTok, and YouTube Shorts. Show the messy middle: the bug that took four hours, the feature that finally clicked, the thing you almost gave up on. Repurpose one recording into all three platforms. Consistency matters more than production quality, post daily or every other day, not once perfectly.</p>

<h4>2. Write LinkedIn posts about your lessons and setbacks.</h4>
<p>One lesson or setback per post. LinkedIn rewards the honest, reflective angle that short-form video doesn't, and it reaches other builders and potential customers. Counterintuitively, the setback posts outperform the win posts. Vulnerability pulls comments and DMs; the highlight reel gets scrolled past. Each post is a small ad for you and the app.</p>

<h4>3. Gather feedback and be willing to PIVOT if your idea isn't landing.</h4>
<p>Actually collect what people tell you (DMs, comments, quick calls) and look for the pattern, not the loudest single voice. If the market's cold, change course without ego. This is normal and not a failure: <strong>YouTube started as a dating site and Slack was a video game.</strong> The willingness to pivot on real signal is the whole point of doing this week before you monetize.</p>

<h3>Traps to avoid</h3>
<ul>
  <li><strong>Posting into the void and calling it marketing.</strong> Engage back. Reply to every comment early on; it compounds.</li>
  <li><strong>Only sharing wins.</strong> The struggle content is what connects. Show it.</li>
  <li><strong>Ignoring feedback because you're attached.</strong> If three people trip on the same thing, it's the app, not them.</li>
</ul>

<p><strong>By end of Day 14:</strong> You have solid feedback and an improved app that's ready for its first paying users.</p>

<blockquote><p><strong>The lesson:</strong> Fall in love with the problem, not your first solution to it.</p></blockquote>

<hr>

<h2>Week 3: Monetize</h2>

<p><em>You validated the idea and refined your app. Now make it PAY.</em></p>

<p><strong>The mindset:</strong> This is the week most builders quietly stall, because charging people feels scary, like you're not "allowed" yet. You are. Your first paying customer changes how you see the entire project: it turns a hobby into a business and proves, beyond any comment or like, that what you made has value. Do the scary thing. And keep this week focused purely on the money mechanics, promotion and growth are week four's job. Week three is just "the machine can now take money."</p>

<p><strong>Who to sell to first:</strong> Your warmest buyers are the people who gave you feedback in week two. They already care. Convert them before chasing strangers.</p>

<h3>The checklist</h3>

<h4>1. Wire up payment links with Stripe.</h4>
<p>Stripe is the fastest path to accepting real money. Start with payment links or a simple checkout, you don't need a custom billing system on day one. The goal is a working path from "user wants to pay" to "money in account," nothing fancier.</p>

<h4>2. Set your pricing and build the paywall.</h4>
<p>Pick a price and put up the wall that gates your paid value. Don't agonize over the exact number, you will adjust it, and adjusting is easy. The mistake isn't pricing wrong; it's not pricing at all. Charge <em>someone</em> and learn from what happens.</p>

<h4>3. Pick your pricing model and match it to how people actually use the app.</h4>
<p>Your three options, and when each fits:</p>
<ul>
  <li><strong>Subscription:</strong> a recurring charge (monthly or yearly) for ongoing access. Best when the app delivers value repeatedly over time (a tool people return to). Predictable revenue, but you have to keep earning it or people churn.</li>
  <li><strong>One-time:</strong> a single payment for permanent access, no recurring bill. <em>Underrated, don't sleep on it.</em> It's the fastest way to real revenue while your user base is small, and it's an easier "yes" for buyers than a subscription. Great for apps that solve a discrete problem.</li>
  <li><strong>Freemium:</strong> free forever, with paid upgrades for premium features, more usage, or a better experience (think Spotify, Dropbox, Notion). It only works at volume, since a small single-digit percentage of free users convert. Powerful once you have traffic; hard when you're just starting.</li>
</ul>
<p>Match the model to real usage, not to what's trendy. If people use it once and move on, one-time. If they come back weekly, subscription. If you have huge top-of-funnel, freemium.</p>

<h3>Traps to avoid</h3>
<ul>
  <li><strong>Waiting until it's "ready" to charge.</strong> It never feels ready. Ship the paywall anyway.</li>
  <li><strong>Defaulting to subscription because everyone does.</strong> Match the model to behavior; one-time is often the smarter early move.</li>
  <li><strong>Bleeding marketing into this week.</strong> Stay on the money mechanics. Promotion is week four.</li>
</ul>

<p><strong>By end of Day 21:</strong> A working paywall, a model that fits how people use your app, and your first paying customers.</p>

<blockquote><p><strong>The lesson:</strong> "Ready to charge" is a feeling that never arrives. Charging is a decision.</p></blockquote>

<hr>

<h2>Week 4: Scale</h2>

<p><em>Now that you have paying users, make your app scalable so nothing breaks at 2am.</em></p>

<p><strong>The mindset:</strong> Scaling isn't chasing every growth hack you've seen. It's making the machine <em>durable and observable</em>, so it keeps running when you're asleep, and so you can see what's happening inside it. Paying users raise the stakes: a crash or a breach now costs real trust and real money. This week you instrument the app, lock the doors, and learn to read your own numbers so growth is something you can steer instead of something that buries you.</p>

<h3>The checklist</h3>

<h4>1. Add your observability and communication stack.</h4>
<p>Three tools, each closing a blind spot:</p>
<ul>
  <li><strong>Sentry</strong> for error tracking, so you find out about crashes before your users tell you (or worse, don't tell you and just leave).</li>
  <li><strong>PostHog</strong> for analytics, so you can see what people actually do in the app, not what you assume they do.</li>
  <li><strong>Resend</strong> for emails, wire up onboarding sequences (so new users don't ghost) and win-back sequences (so churned users come back). Email is a retention lever, not just a setup chore.</li>
</ul>

<h4>2. Run a full security audit.</h4>
<p>With paying users and real data, security stops being optional. Lock down your RLS (Row-Level Security, the rules that decide who can read or write which rows in Supabase), your environment variables and secrets (API keys, tokens, never exposed to the client), and your webhooks (verify they're authenticated so nobody can spoof them). This is the unglamorous work that prevents the 2am disaster.</p>

<h4>3. Track the metrics that matter.</h4>
<p>Four numbers tell you the health of the whole funnel: <strong>signups</strong> (are people arriving?), <strong>activation</strong> (do they reach the "aha" moment?), <strong>conversion</strong> (do they pay?), and <strong>churn</strong> (do they leave?). Watch where people drop off and fix that specific step. Data turns growth from guessing into steering: double down on what the numbers reward, cut what they don't.</p>

<h3>Traps to avoid</h3>
<ul>
  <li><strong>Chasing every channel at once.</strong> Go deep on the one that worked in week two, not wide across all of them.</li>
  <li><strong>Skipping the security audit because nothing's broken yet.</strong> "Yet" is the operative word.</li>
  <li><strong>Tracking vanity metrics.</strong> Likes feel good; activation and churn tell the truth.</li>
</ul>

<p><strong>By end of Day 30:</strong> A growing user base, climbing revenue, and a repeatable system, not just an app, but a machine.</p>

<blockquote><p><strong>The lesson:</strong> An app is a thing you built. A machine is a thing that keeps working while you sleep.</p></blockquote>

<hr>

<h2>The 30-day payoff</h2>

<p>In one month, starting from a single small idea, you go from a blank repo to:</p>
<ul>
  <li>A live, working app on a real domain</li>
  <li>An audience watching you build across three platforms</li>
  <li>Real feedback that shaped the product into something people want</li>
  <li>A paywall, a fitting pricing model, and your first paying customers</li>
  <li>Monitoring, security, and metrics keeping the whole thing standing on its own</li>
</ul>

<p>And here's the compounding part: the second time through, you're faster. You've already got the stack, the content muscle, the payment setup, and the instincts. The 30 days don't just produce one app, they produce a <em>system</em> for producing apps.</p>

<hr>

<h2>Quick-reference checklist</h2>

<h3>Week 1: Build</h3>
<ul>
  <li>☐ Write a one-page PRD with Claude (what / who / stack)</li>
  <li>☐ Scaffold the skeleton in Claude Code (React Native + Supabase)</li>
  <li>☐ Push to GitHub, deploy on Railway, core features live</li>
</ul>

<h3>Week 2: Market</h3>
<ul>
  <li>☐ Build in public on IG, TikTok, YT Shorts</li>
  <li>☐ Post lessons + setbacks on LinkedIn (one per post)</li>
  <li>☐ Gather feedback, pivot if it's not landing</li>
</ul>

<h3>Week 3: Monetize</h3>
<ul>
  <li>☐ Wire up payments with Stripe</li>
  <li>☐ Set pricing, build the paywall</li>
  <li>☐ Pick a model (subscription / one-time / freemium) that fits usage</li>
</ul>

<h3>Week 4: Scale</h3>
<ul>
  <li>☐ Add Sentry + PostHog + Resend</li>
  <li>☐ Run a full security audit (RLS, secrets, webhooks)</li>
  <li>☐ Track signups, activation, conversion, churn</li>
</ul>
`;
