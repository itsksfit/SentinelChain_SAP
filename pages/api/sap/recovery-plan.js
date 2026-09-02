import { submitRecoveryPlan } from "../../../lib/sap/ariba";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { planDetails } = req.body;
  
  const result = await submitRecoveryPlan(planDetails);
  
  res.status(200).json({
    ...result,
    sapSource: process.env.SAP_ARIBA_BASE_URL ? "SAP Ariba Cloud Direct" : "Enterprise Sourcing Gateway"
  });
}
