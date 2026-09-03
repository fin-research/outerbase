import React from "react";
import bash from "@shikijs/langs/bash";
import css from "@shikijs/langs/css";
import html from "@shikijs/langs/html";
import http from "@shikijs/langs/http";
import javascript from "@shikijs/langs/javascript";
import json from "@shikijs/langs/json";
import jsx from "@shikijs/langs/jsx";
import markdown from "@shikijs/langs/markdown";
import tsx from "@shikijs/langs/tsx";
import typescript from "@shikijs/langs/typescript";
import dracula from "@shikijs/themes/dracula";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const ALLOWED_LANGS = [
  "javascript",
  "typescript",
  "html",
  "css",
  "json",
  "markdown",
  "bash",
  "http",
  "jsx",
  "tsx",
] as const;

type AllowedLanguage = (typeof ALLOWED_LANGS)[number];

interface CodeBlockProps {
  children: string;
  className?: string;
}

const highlighterPromise = createHighlighterCore({
  themes: [dracula],
  langs: [
    javascript,
    typescript,
    html,
    css,
    json,
    markdown,
    bash,
    http,
    jsx,
    tsx,
  ],
  engine: createJavaScriptRegexEngine(),
});

function getValidLang(className?: string): AllowedLanguage | "text" {
  const language = className ? className.replace(/language-/, "") : "text";
  return ALLOWED_LANGS.includes(language as AllowedLanguage)
    ? (language as AllowedLanguage)
    : "text";
}

async function CodeBlockInner({ children, className }: CodeBlockProps) {
  const validLang = getValidLang(className);
  const highlighter = await highlighterPromise;
  const highlightedCode = highlighter.codeToHtml(children, {
    lang: validLang,
    themes: {
      dark: "dracula",
      light: "dracula",
    },
  });

  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
  return <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />;
}

interface MDXCodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

async function CodeBlock(props: MDXCodeBlockProps) {
  if (typeof props.children === "string") {
    console.log("here");
    return <CodeBlockInner {...(props as CodeBlockProps)} />;
  }

  const codeElement = React.Children.toArray(props.children).find(
    (child) =>
      React.isValidElement(child) && (child as any).type().type === "code"
  ) as React.ReactElement | undefined;

  if (codeElement && typeof codeElement.props.children === "string") {
    return <CodeBlockInner {...(codeElement.props as CodeBlockProps)} />;
  }

  return (
    <pre>
      <code {...props} />
    </pre>
  );
}

export default CodeBlock;
