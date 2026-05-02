import React, { useMemo, useState } from "react";

const examples = [
  "Molo, unjani?",
  "Ndiyaphila enkosi.",
  "Masithethe ngesiXhosa.",
  "Ewe, ndizakubuya ngomso."
];

const vowels = "aeiouAEIOU";

function toIsidubada(text) {
  return text
    .split("")
    .map((char) => {
      if (!vowels.includes(char)) return char;
      return `${char}d${char.toLowerCase()}`;
    })
    .join("");
}

function fromIsidubada(text) {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const current = text[i];
    const next = text[i + 1];
    const afterNext = text[i + 2];

    const isDubadaPattern =
      vowels.includes(current) &&
      next?.toLowerCase() === "d" &&
      afterNext?.toLowerCase() === current.toLowerCase();

    if (isDubadaPattern) {
      result += current;
      i += 2;
    } else {
      result += current;
    }
  }

  return result;
}

function runConversionTests() {
  const testCases = [
    {
      name: "converts a single isiXhosa greeting",
      input: "Molo",
      expected: "Modolodo"
    },
    {
      name: "converts mixed sentence text",
      input: "Molo, unjani?",
      expected: "Modolodo, udunjadanidi?"
    },
    {
      name: "keeps punctuation and numbers unchanged",
      input: "Molo 123!",
      expected: "Modolodo 123!"
    },
    {
      name: "reverses a basic Isidubada word",
      input: "Modolodo",
      expected: "Molo",
      reverse: true
    },
    {
      name: "reverses a full Isidubada sentence",
      input: "Modolodo, udunjadanidi?",
      expected: "Molo, unjani?",
      reverse: true
    }
  ];

  testCases.forEach((test) => {
    const actual = test.reverse ? fromIsidubada(test.input) : toIsidubada(test.input);

    if (actual !== test.expected) {
      console.error(`Test failed: ${test.name}`, {
        input: test.input,
        expected: test.expected,
        actual
      });
    }
  });
}

runConversionTests();

function Icon({ children, size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function CopyIcon(props) {
  return (
    <Icon {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </Icon>
  );
}

function ClearIcon(props) {
  return (
    <Icon {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v6h6" />
    </Icon>
  );
}

function ShareIcon(props) {
  return (
    <Icon {...props}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4" />
      <path d="M15.4 6.5l-6.8 4" />
    </Icon>
  );
}

function SparklesIcon(props) {
  return (
    <Icon {...props}>
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
      <path d="M5 3l.8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8L5 3z" />
    </Icon>
  );
}

function LanguageIcon(props) {
  return (
    <Icon {...props}>
      <path d="M4 5h10" />
      <path d="M9 3v2" />
      <path d="M5 9c1.5 3 4 5 8 6" />
      <path d="M13 9c-1 2.5-3 4.5-6 6" />
      <path d="M16 19l3-8 3 8" />
      <path d="M17.2 16h3.6" />
    </Icon>
  );
}

function SwapIcon(props) {
  return (
    <Icon {...props}>
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </Icon>
  );
}

export default function IsiDubadaWebApp() {
  const [input, setInput] = useState("Molo, unjani?");
  const [mode, setMode] = useState("toDubada");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input.trim()) return "";
    return mode === "toDubada" ? toIsidubada(input) : fromIsidubada(input);
  }, [input, mode]);

  const modeLabel = mode === "toDubada" ? "Normal text to Isidubada" : "Isidubada to normal text";

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed", error);
    }
  }

  async function shareOutput() {
    if (!output) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "IsiDubada Converter",
          text: output
        });
        return;
      }

      await copyOutput();
    } catch (error) {
      console.error("Share failed", error);
    }
  }

  function swapMode() {
    setInput(output || input);
    setMode((current) => (current === "toDubada" ? "fromDubada" : "toDubada"));
  }

  function clearText() {
    setInput("");
    setCopied(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <nav className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-lg shadow-cyan-500/20">
              <LanguageIcon size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200"></p>
              <h1 className="text-xl font-bold">IsiDubada Converter</h1>
            </div>
          </div>
          <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 sm:inline-flex">
            No login. No backend. Just vibes.
          </span>
        </nav>

        <section className="grid flex-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
              <SparklesIcon size={16} />
              Convert isiXhosa-style text into playful Isidubada
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                Masihlebe. <span className="text-cyan-300">Dubada</span> it instantly.
              </h2>
              <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                I am Sisipho Sidiya, BI Engineer who has created this childhood nostalgic that transforms text using a simple Isidubada pattern: after each vowel, it adds <span className="font-semibold text-white">d + the same vowel</span>.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <p className="mb-3 text-sm font-semibold text-slate-300">Try a quick example</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    onClick={() => setInput(example)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/40 backdrop-blur sm:p-6 animate-[fadeIn_0.6s_ease-out]">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-300">Current mode</p>
                <h3 className="text-xl font-bold">{modeLabel}</h3>
              </div>
              <button
                onClick={swapMode}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 font-bold text-slate-950 transition hover:scale-[1.02] hover:bg-cyan-200"
              >
                <SwapIcon size={18} />
                Swap mode
              </button>
            </div>

            <div className="grid gap-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-300">Input text</span>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type something like: Molo, unjani?"
                  className="min-h-40 w-full resize-none rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-base leading-7 text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-300/60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-300">Output</span>
                <div className="min-h-40 rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-base leading-7 text-cyan-50">
                  {output || <span className="text-slate-500">Your converted text will appear here.</span>}
                </div>
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <button
                onClick={copyOutput}
                disabled={!output}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white px-4 py-3 font-bold text-slate-950 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CopyIcon size={18} />
                {copied ? "Copied" : "Copy"}
              </button>

              <button
                onClick={shareOutput}
                disabled={!output}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-white transition hover:scale-[1.02] hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShareIcon size={18} />
                Share
              </button>

              <button
                onClick={clearText}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-slate-200 transition hover:scale-[1.02] hover:bg-white/10"
              >
                <ClearIcon size={18} />
                Clear
              </button>
            </div>

            <p className="mt-5 text-xs leading-6 text-slate-400">
              MVP note: this uses a simple vowel-based conversion rule. Real Isidubada pronunciation may vary by speaker and context, so later versions should be tested with native users.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
