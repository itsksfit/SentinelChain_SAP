async function test() {
  const query = encodeURIComponent('(semiconductor OR chip) (shortage OR strike OR disruption)');
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${query}&mode=artlist&maxrecords=5&format=json`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }});
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
