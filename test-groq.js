async function test() {
  const response = await fetch("https://api.groq.com/openai/v1/models", {
    method: "GET",
    headers: {
      "Authorization": `Bearer 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`,
    }
  });
  console.log(await response.text());
}
test();
