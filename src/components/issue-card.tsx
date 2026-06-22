import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type Issue, formatDate } from "@/lib/issues";

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <a href={`/issues/${issue.slug}`} className="group block">
      <Card className="h-full border-border/60 transition-shadow group-hover:shadow-md">
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              #{issue.number}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(issue.date)}
            </span>
          </div>
          <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">
            {issue.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">
            {issue.teaser}
          </p>
          <div className="flex items-center justify-between pt-1">
            <div className="flex gap-1 flex-wrap">
              {issue.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{issue.readTime}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
