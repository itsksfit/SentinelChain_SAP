async function test() {
  const MOUSER_API_KEY = "bdec6af2-332b-416c-9ea9-53201f29edf1";
  try {
    const mouserRes = await fetch(`https://api.mouser.com/api/v2/search/keyword?apiKey=${MOUSER_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        SearchByKeywordRequest: {
          keyword: "AMD-MI300X",
          records: 1,
          startingRecord: 0,
          searchOptions: ""
        }
      })
    });
    const data = await mouserRes.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
