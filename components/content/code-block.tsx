"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/github-dark.css";

hljs.registerLanguage("python", python);

export function CodeBlock({ code }: { code: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) hljs.highlightElement(ref.current);
  }, [code]);

  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-[#0d0d10] p-4 text-xs leading-relaxed">
      <code ref={ref} className="language-python">
        {code}
      </code>
    </pre>
  );
}
