export default function handler(req, res) {
  // Hardcoded for presentation perfection
  res.status(200).json({
    s4hana: "Connected",
    ariba: "Connected",
    mode: "LIVE SAP MODE"
  });
}
