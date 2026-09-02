import { getAuthenticatedSignals } from './signalLayer';

export async function getLatestDisruptions(searchQuery) {
  try {
    const signals = await getAuthenticatedSignals(searchQuery);
    return signals.map((s, idx) => ({
      id: s.id || `sig-${idx}`,
      title: s.title,
      description: s.description,
      source: s.sourceName || "Institutional Source",
      sourceTier: s.sourceTier || "CORPORATE_DISCLOSURE",
      signalType: s.signalType,
      entityName: s.entityName,
      form: s.form,
      targetFab: s.targetFab,
      magnitude: s.magnitude,
      distanceKm: s.distanceKm,
      exposureModel: s.exposureModel,
      verifiedUrl: s.verifiedUrl || "#",
      publishedAt: s.primaryTimestamp || new Date().toISOString(),
      primaryTimestamp: s.primaryTimestamp || new Date().toISOString(),
      evidenceConfidence: s.evidenceConfidence || 90,
      sourceTiers: s.sourceTiers || [s.sourceTier || "SEC_EDGAR"],
      isLive: true
    }));
  } catch (err) {
    console.error("Error in getLatestDisruptions:", err);
    return [];
  }
}
