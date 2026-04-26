const { getStore } = require("@netlify/blobs");

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

exports.handler = async (event) => {
  if (event.httpMethod !== "GET" && event.httpMethod !== "POST") {
    return { statusCode: 405, headers: HEADERS, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  let store;
  try { store = getStore("ministranten_data"); }
  catch (e) { return { statusCode: 503, headers: HEADERS, body: JSON.stringify({ error: "Blobs nicht verfügbar" }) }; }

  try {
    if (event.httpMethod === "GET") {
      let data = {};
      try { data = await store.get("db_store", { type: "json" }) || {}; } catch (e) {}
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify(data) };
    }

    if (event.httpMethod === "POST") {
      if (Buffer.byteLength(event.body || "", "utf8") > 4 * 1024 * 1024)
        return { statusCode: 413, headers: HEADERS, body: JSON.stringify({ error: "Zu groß" }) };

      let data;
      try { data = JSON.parse(event.body); } 
      catch (e) { return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "Ungültiges JSON" }) }; }

      if (!data || typeof data.users !== "object")
        return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ error: "Ungültige Struktur" }) };

      await store.setJSON("db_store", data);
      return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ ok: true }) };
    }
  } catch (e) {
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ error: e.message }) };
  }
};
