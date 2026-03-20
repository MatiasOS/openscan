import { useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-python";
import "prismjs/components/prism-solidity";

function detectLanguage(fileName?: string): string | undefined {
  if (!fileName) return undefined;
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "sol") return "solidity";
  if (ext === "vy") return "python";
  if (ext === "json") return "json";
  return undefined;
}

interface CodeBlockProps {
  code: string;
  fileName?: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, fileName, language }) => {
  const lang = language ?? detectLanguage(fileName);
  const grammar = lang ? Prism.languages[lang] : undefined;

  const highlighted = useMemo(() => {
    if (!grammar || !lang) return null;
    return Prism.highlight(code, grammar, lang);
  }, [code, grammar, lang]);

  if (highlighted) {
    return (
      <pre className="source-file-code">
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Prism.highlight output is safe — it only tokenizes source code we control */}
        <code className={`language-${lang}`} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    );
  }

  return (
    <pre className="source-file-code">
      <code>{code}</code>
    </pre>
  );
};

export default CodeBlock;
