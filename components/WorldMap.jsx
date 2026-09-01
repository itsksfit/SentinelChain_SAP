import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

// Dynamic import to prevent SSR canvas issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

export default function WorldMap() {
  const globeEl = useRef();
  const [arcsData, setArcsData] = useState([]);
  const [places, setPlaces] = useState([]);
  const [ringsData, setRingsData] = useState([]);
  
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && (theme === 'light' || resolvedTheme === 'light');

  useEffect(() => {
    // 20+ Global Semiconductor & Supply Chain Nodes
    const nodes = {
      // Foundries & Fabs
      hsinchu: { lat: 24.81, lng: 120.96, name: 'TSMC Fab 12/20 (Hsinchu)', type: 'fab' },
      tainan: { lat: 23.00, lng: 120.22, name: 'TSMC Fab 18 (Tainan 3nm)', type: 'fab' },
      seoul: { lat: 37.56, lng: 126.97, name: 'Samsung Foundry (Pyeongtaek)', type: 'fab' },
      hillsboro: { lat: 45.52, lng: -122.98, name: 'Intel D1X Fab (Oregon)', type: 'fab' },
      chandler: { lat: 33.30, lng: -111.84, name: 'Intel Ocotillo (Arizona)', type: 'fab' },
      austin: { lat: 30.26, lng: -97.74, name: 'Samsung / NXP (Austin)', type: 'fab' },
      dresden: { lat: 51.05, lng: 13.73, name: 'Silicon Saxony (Dresden)', type: 'fab' },
      
      // Equipment & Optics
      veldhoven: { lat: 51.41, lng: 5.40, name: 'ASML EUV (Veldhoven)', type: 'equip' },
      oberkochen: { lat: 48.78, lng: 10.10, name: 'Carl Zeiss Optics (Germany)', type: 'equip' },
      tokyo: { lat: 35.67, lng: 139.65, name: 'Tokyo Electron & SUMCO', type: 'equip' },

      // IP, EDA & Chip Design
      santaClara: { lat: 37.35, lng: -121.95, name: 'NVIDIA / Intel (Silicon Valley)', type: 'design' },
      sanDiego: { lat: 32.71, lng: -117.16, name: 'Qualcomm R&D (San Diego)', type: 'design' },
      cambridge: { lat: 52.20, lng: 0.12, name: 'Arm Architecture (Cambridge)', type: 'design' },
      telaviv: { lat: 32.08, lng: 34.78, name: 'Apple / Intel R&D (Israel)', type: 'design' },
      dallas: { lat: 32.77, lng: -96.79, name: 'Texas Instruments (Dallas)', type: 'design' },

      // Advanced Packaging, Assembly & Testing
      kaohsiung: { lat: 22.62, lng: 120.30, name: 'ASE Packaging (Kaohsiung)', type: 'assembly' },
      penang: { lat: 5.41, lng: 100.32, name: 'Inari / ASE (Penang Malaysia)', type: 'assembly' },
      shenzhen: { lat: 22.54, lng: 114.05, name: 'Foxconn / Assembly (Shenzhen)', type: 'assembly' },
      incheon: { lat: 37.45, lng: 126.70, name: 'Amkor Packaging (Korea)', type: 'assembly' },
      munich: { lat: 48.13, lng: 11.58, name: 'Infineon Auto ICs (Munich)', type: 'auto' }
    };

    // Color Palette
    const C_PURPLE = isLight ? '#9333ea' : '#c084fc'; // EUV & Optics
    const C_INDIGO = isLight ? '#4f46e5' : '#818cf8'; // IP & Design
    const C_EMERALD = isLight ? '#059669' : '#34d399'; // Foundries & Assembly
    const C_CYAN = isLight ? '#0284c7' : '#38bdf8'; // Materials & Wafers
    const C_RED = '#ef4444'; // Active Disruption Arcs

    const routes = [
      // 1. EUV Equipment & Optics to Leading Edge Fabs
      { startLat: nodes.oberkochen.lat, startLng: nodes.oberkochen.lng, endLat: nodes.veldhoven.lat, endLng: nodes.veldhoven.lng, color: C_PURPLE },
      { startLat: nodes.veldhoven.lat, startLng: nodes.veldhoven.lng, endLat: nodes.hsinchu.lat, endLng: nodes.hsinchu.lng, color: C_PURPLE },
      { startLat: nodes.veldhoven.lat, startLng: nodes.veldhoven.lng, endLat: nodes.seoul.lat, endLng: nodes.seoul.lng, color: C_PURPLE },
      { startLat: nodes.veldhoven.lat, startLng: nodes.veldhoven.lng, endLat: nodes.chandler.lat, endLng: nodes.chandler.lng, color: C_PURPLE },
      { startLat: nodes.veldhoven.lat, startLng: nodes.veldhoven.lng, endLat: nodes.dresden.lat, endLng: nodes.dresden.lng, color: C_PURPLE },

      // 2. Silicon Wafers & Chemicals from Japan
      { startLat: nodes.tokyo.lat, startLng: nodes.tokyo.lng, endLat: nodes.hsinchu.lat, endLng: nodes.hsinchu.lng, color: C_CYAN },
      { startLat: nodes.tokyo.lat, startLng: nodes.tokyo.lng, endLat: nodes.tainan.lat, endLng: nodes.tainan.lng, color: C_CYAN },
      { startLat: nodes.tokyo.lat, startLng: nodes.tokyo.lng, endLat: nodes.seoul.lat, endLng: nodes.seoul.lng, color: C_CYAN },
      { startLat: nodes.tokyo.lat, startLng: nodes.tokyo.lng, endLat: nodes.hillsboro.lat, endLng: nodes.hillsboro.lng, color: C_CYAN },

      // 3. Silicon Valley & Global IP Design Transfers
      { startLat: nodes.santaClara.lat, startLng: nodes.santaClara.lng, endLat: nodes.hsinchu.lat, endLng: nodes.hsinchu.lng, color: C_INDIGO },
      { startLat: nodes.santaClara.lat, startLng: nodes.santaClara.lng, endLat: nodes.tainan.lat, endLng: nodes.tainan.lng, color: C_INDIGO },
      { startLat: nodes.sanDiego.lat, startLng: nodes.sanDiego.lng, endLat: nodes.tainan.lat, endLng: nodes.tainan.lng, color: C_INDIGO },
      { startLat: nodes.cambridge.lat, startLng: nodes.cambridge.lng, endLat: nodes.santaClara.lat, endLng: nodes.santaClara.lng, color: C_INDIGO },
      { startLat: nodes.telaviv.lat, startLng: nodes.telaviv.lng, endLat: nodes.santaClara.lat, endLng: nodes.santaClara.lng, color: C_INDIGO },
      { startLat: nodes.dallas.lat, startLng: nodes.dallas.lng, endLat: nodes.munich.lat, endLng: nodes.munich.lng, color: C_INDIGO },

      // 4. Wafer to Advanced Packaging & Assembly
      { startLat: nodes.hsinchu.lat, startLng: nodes.hsinchu.lng, endLat: nodes.kaohsiung.lat, endLng: nodes.kaohsiung.lng, color: C_EMERALD },
      { startLat: nodes.tainan.lat, startLng: nodes.tainan.lng, endLat: nodes.penang.lat, endLng: nodes.penang.lng, color: C_EMERALD },
      { startLat: nodes.seoul.lat, startLng: nodes.seoul.lng, endLat: nodes.incheon.lat, endLng: nodes.incheon.lng, color: C_EMERALD },
      { startLat: nodes.dresden.lat, startLng: nodes.dresden.lng, endLat: nodes.munich.lat, endLng: nodes.munich.lng, color: C_EMERALD },

      // 5. Active Critical Disrupted Routes (Red Glowing Strings)
      { startLat: nodes.hsinchu.lat, startLng: nodes.hsinchu.lng, endLat: nodes.munich.lat, endLng: nodes.munich.lng, color: C_RED },
      { startLat: nodes.tainan.lat, startLng: nodes.tainan.lng, endLat: nodes.austin.lat, endLng: nodes.austin.lng, color: C_RED },
      { startLat: nodes.shenzhen.lat, startLng: nodes.shenzhen.lng, endLat: nodes.santaClara.lat, endLng: nodes.santaClara.lng, color: C_RED }
    ];
    setArcsData(routes);

    // Render node markers
    const locations = Object.values(nodes).map(n => ({
      lat: n.lat, 
      lng: n.lng, 
      name: n.name, 
      size: n.type === 'fab' ? 1.8 : 1.2,
      color: n.name.includes('Hsinchu') || n.name.includes('Shenzhen') 
        ? C_RED 
        : (isLight ? '#1e293b' : '#ffffff')
    }));
    setPlaces(locations);

    // Pulsing seismic & factory alert rings
    setRingsData([
      { lat: nodes.hsinchu.lat, lng: nodes.hsinchu.lng, maxR: 6, propagationSpeed: 2.2, repeatPeriod: 800, color: C_RED },
      { lat: nodes.tainan.lat, lng: nodes.tainan.lng, maxR: 5, propagationSpeed: 1.8, repeatPeriod: 1100, color: C_RED },
      { lat: nodes.veldhoven.lat, lng: nodes.veldhoven.lng, maxR: 4, propagationSpeed: 1.2, repeatPeriod: 1400, color: C_PURPLE },
      { lat: nodes.santaClara.lat, lng: nodes.santaClara.lng, maxR: 4.5, propagationSpeed: 1.5, repeatPeriod: 1300, color: C_INDIGO }
    ]);

  }, [isLight, theme, resolvedTheme]);

  useEffect(() => {
    // Auto-rotate with smooth controls
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1.3;
      globeEl.current.controls().enableZoom = false;
      globeEl.current.pointOfView({ lat: 22, lng: 115, altitude: 2.2 }, 1000);
    }
  }, []);

  return (
    <div className={`w-full h-[430px] overflow-hidden flex items-center justify-center rounded-2xl border relative transition-all duration-300 shadow-sm ${
      isLight 
        ? 'bg-gradient-to-br from-sky-50 via-indigo-50/50 to-slate-100 border-slate-200' 
        : 'bg-gradient-to-br from-[#0c1222] via-[#080d1a] to-[#030712] border-white/10'
    }`}>
      {/* Top Header Badge */}
      <div className={`absolute top-4 left-4 z-10 px-3.5 py-2 rounded-xl border backdrop-blur-md shadow-sm ${
        isLight 
          ? 'bg-white/90 border-slate-200 text-slate-800' 
          : 'bg-black/75 border-white/15 text-slate-100'
      }`}>
        <span className="text-[10px] uppercase font-extrabold tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Global Semiconductor Node Grid (20+ Live Fab Corridors)
        </span>
      </div>
      
      {/* Legend */}
      <div className={`absolute bottom-4 left-4 z-10 px-3.5 py-2.5 rounded-xl border backdrop-blur-md shadow-sm flex flex-col gap-1.5 ${
        isLight 
          ? 'bg-white/90 border-slate-200' 
          : 'bg-black/75 border-white/15'
      }`}>
        <div className="flex items-center gap-2 text-[9.5px] uppercase font-extrabold text-purple-600 dark:text-purple-300"><div className="w-2.5 h-1 rounded-full bg-purple-500"></div> ASML EUV & Optics</div>
        <div className="flex items-center gap-2 text-[9.5px] uppercase font-extrabold text-sky-600 dark:text-sky-300"><div className="w-2.5 h-1 rounded-full bg-sky-500"></div> Wafers & Materials</div>
        <div className="flex items-center gap-2 text-[9.5px] uppercase font-extrabold text-indigo-600 dark:text-indigo-300"><div className="w-2.5 h-1 rounded-full bg-indigo-500"></div> IP Design & EDA</div>
        <div className="flex items-center gap-2 text-[9.5px] uppercase font-extrabold text-emerald-600 dark:text-emerald-300"><div className="w-2.5 h-1 rounded-full bg-emerald-500"></div> Foundries & Assembly</div>
        <div className="flex items-center gap-2 text-[9.5px] uppercase font-extrabold text-red-600 dark:text-red-400"><div className="w-2.5 h-1 rounded-full bg-red-500 animate-pulse"></div> Active Disrupted Corridors</div>
      </div>

      {mounted && (
        <Globe
          ref={globeEl}
          width={540}
          height={430}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={isLight 
            ? "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg" 
            : "//unpkg.com/three-globe/example/img/earth-night.jpg"
          }
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          atmosphereColor={isLight ? "#38bdf8" : "#818cf8"}
          atmosphereAltitude={0.18}
          arcsData={arcsData}
          arcStartLat={d => d.startLat}
          arcStartLng={d => d.startLng}
          arcEndLat={d => d.endLat}
          arcEndLng={d => d.endLng}
          arcColor={d => d.color}
          arcDashLength={0.4}
          arcDashGap={0.15}
          arcDashAnimateTime={1100}
          arcStroke={1.4}
          
          ringsData={ringsData}
          ringColor={d => d.color}
          ringMaxRadius={d => d.maxR}
          ringPropagationSpeed={d => d.propagationSpeed}
          ringRepeatPeriod={d => d.repeatPeriod}
          
          labelsData={places}
          labelLat={d => d.lat}
          labelLng={d => d.lng}
          labelText={d => d.name}
          labelSize={d => d.size}
          labelDotRadius={d => d.size * 0.5}
          labelColor={d => d.color}
          labelResolution={2}
        />
      )}
    </div>
  );
}
