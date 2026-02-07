export default function ExportShare({ rules, itineraryText, onBack }) {
  const shareText =
    `Team Travel Planner\n\n` +
    `Trip Rules:\n${JSON.stringify(rules, null, 2)}\n\n` +
    `Itinerary:\n${itineraryText}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert("Copied to clipboard ✅");
    } catch {
      alert("Copy failed ❌");
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([shareText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "itinerary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm text-slate-400">Export / Share</p>
        <h1 className="text-3xl font-semibold mt-2">Share itinerary</h1>
        <p className="text-slate-300 mt-3">
          Copy the itinerary for email/Slack or download as a text file.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
          <pre className="text-xs whitespace-pre-wrap break-words">
            {shareText}
          </pre>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={onBack}
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900 transition"
          >
            Back
          </button>

          <button
            onClick={copyToClipboard}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 transition"
          >
            Copy to clipboard
          </button>

          <button
            onClick={downloadTxt}
            className="rounded-lg border border-slate-800 px-4 py-2 text-sm hover:bg-slate-900 transition"
          >
            Download .txt
          </button>
        </div>
      </div>
    </div>
  );
}