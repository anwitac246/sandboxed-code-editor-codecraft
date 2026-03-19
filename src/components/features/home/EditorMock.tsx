const editorLines = [
  { line: 1, content: 'import express from "express";', color: "text-primary" },
  { line: 2, content: "", color: "" },
  { line: 3, content: "const app = express();", color: "text-foreground" },
  { line: 4, content: 'const PORT = process.env.PORT || 3000;', color: "text-foreground" },
  { line: 5, content: "", color: "" },
  { line: 6, content: 'app.get("/", (req, res) => {', color: "text-foreground" },
  { line: 7, content: '  res.json({ status: "running" });', color: "text-green-400" },
  { line: 8, content: "});", color: "text-foreground" },
  { line: 9, content: "", color: "" },
  { line: 10, content: "app.listen(PORT);", color: "text-primary" },
];

export function EditorMock() {
  return (
    <section className="relative px-6 pb-20 md:pb-32">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card glow-card">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border/40 bg-muted/50 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3 text-xs text-muted-foreground font-mono">server.ts — CodeCraft</span>
          </div>

          {/* Code area */}
          <div className="p-5 font-mono text-sm leading-7">
            {editorLines.map((l) => (
              <div key={l.line} className="flex gap-4">
                <span className="w-6 select-none text-right text-muted-foreground/40">{l.line}</span>
                <span className={l.color}>{l.content || "\u00A0"}</span>
              </div>
            ))}
            <div className="flex gap-4">
              <span className="w-6" />
              <span className="inline-block h-5 w-2 bg-primary animate-cursor-blink" />
            </div>
          </div>

          {/* Terminal */}
          <div className="border-t border-border/40 bg-muted/30 px-5 py-3 font-mono text-xs text-muted-foreground">
            <span className="text-green-400">$</span> node server.ts
            <br />
            <span className="text-muted-foreground/70">Server listening on port 3000</span>
          </div>
        </div>
      </div>
    </section>
  );
}
