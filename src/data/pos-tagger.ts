import { PosTagResult } from "@/types/demo";

export async function getPosTagResult(text: string): Promise<PosTagResult> {
  const res = await fetch(`https://inference.afifvdin.com/pos-tagger/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
