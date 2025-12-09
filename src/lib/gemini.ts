export async function askGemini(question: string, documentText: string): Promise<string> {
  try {
     const res = await fetch("http://localhost:4000/api/ask", {
    // const res = await fetch("https://document-qa-app-server.onrender.com/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, documentText }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} - ${text}`);
    }

    const data = await res.json();
    return data.answer;
  } catch (err: any) {
    console.error(err);
    return `Error: ${err.message}`;
  }
}
