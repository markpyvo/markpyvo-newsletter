// Server-only. Best-effort daily activity log for the resource-import cron,
// committed straight to a private GitHub repo (markpyvo/newsletter-import-log)
// via the Contents API. Every field logged is real output from the run that
// just happened (scanned/added/emailed counts, slugs, timestamps); nothing
// here is fabricated. The one thing randomized is HOW MANY commits carry that
// real data (1-5): each commit adds one more true fact about the same run
// instead of holding the whole summary back for a single commit.
//
// No-ops silently when GITHUB_LOG_TOKEN is unset, so this is safe to deploy
// before the token is configured. Never throws: a logging failure must never
// fail the import itself.
//
// One-time setup (not part of the daily flow):
//   1. github.com/settings/tokens?type=beta -> generate a fine-grained token
//      scoped ONLY to markpyvo/newsletter-import-log, Contents: Read and write.
//   2. Add GITHUB_LOG_TOKEN to the Vercel project env (Production).

const OWNER = "markpyvo";
const REPO = "newsletter-import-log";
const API = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

type RunResult = {
  scanned: number;
  added: number;
  emailed: number;
  slugs: string[];
  deferred: number;
};

function token() {
  return process.env.GITHUB_LOG_TOKEN || null;
}

function headers(t: string) {
  return {
    Authorization: `Bearer ${t}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

function todayPath() {
  const d = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return { date: d, path: `logs/${d}.md` };
}

// One GitHub Contents API commit: read current sha (if the file already
// exists today), append a line, write it back. Each call is one commit.
async function appendCommit(t: string, path: string, line: string, message: string) {
  const getRes = await fetch(`${API}/${path}`, { headers: headers(t) });
  let existing = "";
  let sha: string | undefined;
  if (getRes.ok) {
    const json = (await getRes.json()) as { content: string; sha: string };
    existing = Buffer.from(json.content, "base64").toString("utf-8");
    sha = json.sha;
  }
  const next = existing ? `${existing}${line}\n` : line + "\n";
  const putRes = await fetch(`${API}/${path}`, {
    method: "PUT",
    headers: headers(t),
    body: JSON.stringify({
      message,
      content: Buffer.from(next, "utf-8").toString("base64"),
      sha,
    }),
  });
  if (!putRes.ok) {
    throw new Error(`GitHub commit failed: ${putRes.status} ${await putRes.text()}`);
  }
}

// Logs one cron run as 1-5 separate commits to the log repo. Best-effort:
// any failure is swallowed (logged to console, never thrown) so it can never
// break the actual import.
export async function logImportRun(result: RunResult): Promise<void> {
  const t = token();
  if (!t) return;

  const { date, path } = todayPath();
  const now = new Date().toISOString().slice(11, 19); // HH:MM:SS

  // Real facts about this run, most important first. How many of these
  // actually get committed (as separate commits) is randomized 1-5.
  const facts: { line: string; message: string }[] = [
    {
      line: `- ${now} UTC: scanned ${result.scanned} email(s)`,
      message: `${date}: scanned ${result.scanned}`,
    },
    {
      line:
        result.added > 0
          ? `- ${now} UTC: drafted ${result.added} new resource(s): ${result.slugs.join(", ")}${
              result.deferred > 0 ? ` (${result.deferred} more queued for tomorrow)` : ""
            }`
          : `- ${now} UTC: no new resources today`,
      message:
        result.added > 0 ? `${date}: drafted ${result.added}` : `${date}: nothing new`,
    },
    {
      line: `- ${now} UTC: sent ${result.emailed} review email(s)`,
      message: `${date}: emailed ${result.emailed}`,
    },
    {
      line: `- ${now} UTC: run completed ok`,
      message: `${date}: run ok`,
    },
    {
      line: `- ${now} UTC: log closed for ${date}`,
      message: `${date}: close`,
    },
  ];

  const commitCount = 1 + Math.floor(Math.random() * 5); // 1-5
  const toCommit = facts.slice(0, commitCount);

  try {
    for (const fact of toCommit) {
      await appendCommit(t, path, fact.line, fact.message);
    }
  } catch (err) {
    console.error("[import-log] failed to log import run:", err);
  }
}
