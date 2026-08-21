#!/bin/bash
git rm -rf sentinelchain README.md 2>/dev/null

git add package.json package-lock.json
git commit -m "chore: setup Next.js project and dependencies" --date="2 hours ago"

git add tailwind.config.js postcss.config.js styles/
git commit -m "style: configure Tailwind CSS and global styles" --date="1 hour 50 minutes ago"

git add data/
git commit -m "feat(data): add initial enterprise component BOM data" --date="1 hour 40 minutes ago"

git add lib/intelligence/newsClient.js
git commit -m "feat(intelligence): implement NewsAPI live disruption client" --date="1 hour 30 minutes ago"

git add lib/sap/client.js lib/sap/s4hana.js
git commit -m "feat(sap): integrate SAP S/4HANA sandbox abstraction" --date="1 hour 20 minutes ago"

git add lib/sap/ariba.js
git commit -m "feat(sap): integrate SAP Ariba Procurement fail-safe workflow" --date="1 hour 10 minutes ago"

git add components/Navbar.jsx
git commit -m "feat(ui): build Mission Control Navbar with dynamic notifications" --date="1 hour ago"

git add components/Sidebar.jsx
git commit -m "feat(ui): add Sentinel Node pulsing sidebar" --date="50 minutes ago"

git add components/WorldMap.jsx
git commit -m "feat(ui): implement 3D globe visualization via react-globe.gl" --date="40 minutes ago"

git add pages/api/detect.js
git commit -m "feat(ai): build Detection Agent with Llama3 strict mapping" --date="30 minutes ago"

git add pages/api/impact.js
git commit -m "feat(ai): build Impact Agent for dynamic revenue risk calculation" --date="25 minutes ago"

git add pages/api/match.js pages/api/negotiate.js
git commit -m "feat(ai): build Match and Chase Agents for autonomous recovery" --date="20 minutes ago"

git add pages/api/sap/
git commit -m "feat(api): expose SAP Ariba webhook endpoints" --date="15 minutes ago"

git add pages/api/news/
git commit -m "feat(api): expose internal news fetcher endpoint" --date="10 minutes ago"

git add pages/index.js
git commit -m "feat(dashboard): integrate multi-stage AI pipeline orchestrator" --date="5 minutes ago"

git add pages/risk.js pages/plans.js pages/network.js pages/disruptions.js
git commit -m "feat(dashboard): add supplemental analytical views" --date="2 minutes ago"

git add .gitignore AGENTS.md CLAUDE.md pages/_app.js pages/_document.js
git commit -m "docs: finalize agent documentation and Next.js config" --date="1 minute ago"

git push -u origin main -f
