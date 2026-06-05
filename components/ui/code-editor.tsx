"use client";

import { useEffect, useMemo, useRef } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/github-dark.css";
import { cn } from "@/lib/utils";

hljs.registerLanguage("python", python);

export function CodeEditor({
  value,
  onChange,
  placeholder = "# escreva seu código Python aqui",
  minRows = 8,
  maxRows = 30,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
  className?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const caretRef = useRef<number | null>(null);

  const highlighted = useMemo(() => {
    if (!value) return "";
    const html = hljs.highlight(value, { language: "python" }).value;
    return value.endsWith("\n") ? html + "\n " : html;
  }, [value]);

  // restaura o cursor após mudanças controladas (Tab/Enter)
  useEffect(() => {
    if (caretRef.current != null && taRef.current) {
      taRef.current.selectionStart = taRef.current.selectionEnd = caretRef.current;
      caretRef.current = null;
    }
  }, [value]);

  const syncScroll = () => {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const ta = e.currentTarget;
    const s = ta.selectionStart;
    const en = ta.selectionEnd;
    const v = ta.value;

    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        // dedent: remove até 4 espaços no início da linha
        const lineStart = v.lastIndexOf("\n", s - 1) + 1;
        const line = v.slice(lineStart, s);
        const remove = Math.min(4, line.length - line.trimStart().length);
        if (remove > 0) {
          onChange(v.slice(0, lineStart) + v.slice(lineStart + remove));
          caretRef.current = s - remove;
        }
      } else {
        onChange(v.slice(0, s) + "    " + v.slice(en));
        caretRef.current = s + 4;
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      const lineStart = v.lastIndexOf("\n", s - 1) + 1;
      const curLine = v.slice(lineStart, s);
      let indent = (curLine.match(/^[ \t]*/) ?? [""])[0];
      if (curLine.trimEnd().endsWith(":")) indent += "    ";
      const insert = "\n" + indent;
      onChange(v.slice(0, s) + insert + v.slice(en));
      caretRef.current = s + insert.length;
    } else if (
      e.key === "Backspace" &&
      s === en &&
      s > 0 &&
      v.slice(Math.max(0, s - 4), s) === "    " &&
      v.slice(v.lastIndexOf("\n", s - 1) + 1, s).trim() === ""
    ) {
      // apaga 4 espaços de indentação de uma vez
      e.preventDefault();
      onChange(v.slice(0, s - 4) + v.slice(s));
      caretRef.current = s - 4;
    }
  };

  const rows = Math.min(
    maxRows,
    Math.max(minRows, value.split("\n").length + 1),
  );

  const shared =
    "m-0 w-full whitespace-pre-wrap break-words font-mono text-xs leading-relaxed [tab-size:4] p-3";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-[#0d0d10] focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/40",
        className,
      )}
    >
      <pre
        ref={preRef}
        aria-hidden
        className={cn(shared, "pointer-events-none absolute inset-0 overflow-auto")}
      >
        {value ? (
          <code dangerouslySetInnerHTML={{ __html: highlighted }} />
        ) : (
          <code className="text-text-secondary/50">{placeholder}</code>
        )}
      </pre>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onScroll={syncScroll}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        rows={rows}
        className={cn(
          shared,
          "relative resize-none bg-transparent text-transparent caret-white outline-none [color:transparent]",
        )}
      />
    </div>
  );
}
