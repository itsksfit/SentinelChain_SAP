async function test() {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": \`Bearer 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\`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai/gpt-oss-120b", messages: [{ role: "user", content: "Test output exactly this valid JSON: {\\"key\\":\\"value\\"}" }], response_format: { type: "json_object" } }),
    });
  const data = await response.json();
  console.log(data);
}
test();
