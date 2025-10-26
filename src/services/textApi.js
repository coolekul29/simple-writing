// Call backend /api/rewrite
export async function rewriteTextOnServer(text) {
  const response = await fetch("http://localhost:5000/api/rewrite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Rewrite failed");
  }

  return data.rewritten || "";
}

// Call backend /api/simplify
export async function simplifyTextOnServer(text) {
  const response = await fetch("http://localhost:5000/api/simplify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Simplify failed");
  }

  return data.rewritten || "";
}