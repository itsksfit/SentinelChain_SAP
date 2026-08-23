import { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';
import { useTheme } from 'next-themes';

export default function WorldMap() {
  const globeEl = useRef();
  const [arcsData, setArcsData] = useState([]);
  const [places, setPlaces] = useState([]);
  const [ringsData, setRingsData] = useState([]);
  
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Advanced Semiconductor Network Nodes
    const nodes = {
      hsinchu: { lat: 24.81, lng: 120.96, name: 'Hsinchu (TSMC)' },
      seoul: { lat: 37.56, lng: 126.97, name: 'Seoul (Samsung)' },
      eindhoven: { lat: 51.44, lng: 5.46, name: 'Eindhoven (ASML)' },
      santaClara: { lat: 37.35, lng: -121.95, name: 'Santa Clara (Intel)' },
      austin: { lat: 30.26, lng: -97.74, name: 'Austin (Fab)' },
      shenzhen: { lat: 22.54, lng: 114.05, name: 'Shenzhen (Assembly)' },
      penang: { lat: 5.41, lng: 100.32, name: 'Penang (Testing)' },
      tokyo: { lat: 35.67, lng: 139.65, name: 'Tokyo (Materials)' },
      munich: { lat: 48.13, lng: 11.58, name: 'Munich (Auto ICs)' },
      telaviv: { lat: 32.08, lng: 34.78, name: 'Tel Aviv (R&D)' }
    };

    // Tech colors
    const C_CYAN = '#06b6d4';
    const C_INDIGO = '#6366f1';
    const C_PURPLE = '#a855f7';
    const C_EMERALD = '#10b981';
    const C_RED = '#ef4444'; // Disrupted

    const routes = [
      // EUV Machines (ASML)
      { startLat: nodes.eindhoven.lat, startLng: nodes.eindhoven.lng, endLat: nodes.hsinchu.lat, endLng: nodes.hsinchu.lng, color: C_PURPLE },
      { startLat: nodes.eindhoven.lat, startLng: nodes.eindhoven.lng, endLat: nodes.seoul.lat, endLng: nodes.seoul.lng, color: C_PURPLE },
      { startLat: nodes.eindhoven.lat, startLng: nodes.eindhoven.lng, endLat: nodes.santaClara.lat, endLng: nodes.santaClara.lng, color: C_PURPLE },
      
      // Raw Materials & Wafers
      { startLat: nodes.tokyo.lat, startLng: nodes.tokyo.lng, endLat: nodes.hsinchu.lat, endLng: nodes.hsinchu.lng, color: C_CYAN },
      { startLat: nodes.tokyo.lat, startLng: nodes.tokyo.lng, endLat: nodes.seoul.lat, endLng: nodes.seoul.lng, color: C_CYAN },
      
      // Design & IP
      { startLat: nodes.santaClara.lat, startLng: nodes.santaClara.lng, endLat: nodes.hsinchu.lat, endLng: nodes.hsinchu.lng, color: C_INDIGO },
      { startLat: nodes.telaviv.lat, startLng: nodes.telaviv.lng, endLat: nodes.santaClara.lat, endLng: nodes.santaClara.lng, color: C_INDIGO },
      { startLat: nodes.austin.lat, startLng: nodes.austin.lng, endLat: nodes.hsinchu.lat, endLng: nodes.hsinchu.lng, color: C_INDIGO },

      // Assembly & Testing
      { startLat: nodes.hsinchu.lat, startLng: nodes.hsinchu.lng, endLat: nodes.penang.lat, endLng: nodes.penang.lng, color: C_EMERALD },
      { startLat: nodes.hsinchu.lat, startLng: nodes.hsinchu.lng, endLat: nodes.shenzhen.lat, endLng: nodes.shenzhen.lng, color: C_EMERALD },
      { startLat: nodes.seoul.lat, startLng: nodes.seoul.lng, endLat: nodes.shenzhen.lat, endLng: nodes.shenzhen.lng, color: C_EMERALD },

      // Disrupted / High Risk Routes (Red)
      { startLat: nodes.shenzhen.lat, startLng: nodes.shenzhen.lng, endLat: nodes.santaClara.lat, endLng: nodes.santaClara.lng, color: C_RED },
      { startLat: nodes.shenzhen.lat, startLng: nodes.shenzhen.lng, endLat: nodes.munich.lat, endLng: nodes.munich.lng, color: C_RED },
      { startLat: nodes.shenzhen.lat, startLng: nodes.shenzhen.lng, endLat: nodes.austin.lat, endLng: nodes.austin.lng, color: C_RED }
    ];
    setArcsData(routes);

    const locations = Object.values(nodes).map(n => ({
      lat: n.lat, 
      lng: n.lng, 
      name: n.name, 
      size: n.name.includes('TSMC') || n.name.includes('Shenzhen') ? 2 : 1.2,
      color: n.name.includes('Shenzhen') ? C_RED : (theme === 'light' ? '#333' : '#fff')
    }));
    setPlaces(locations);

    // Pulsing Rings for major hubs
    setRingsData([
      { lat: nodes.hsinchu.lat, lng: nodes.hsinchu.lng, maxR: 5, propagationSpeed: 2, repeatPeriod: 1000, color: C_INDIGO },
      { lat: nodes.shenzhen.lat, lng: nodes.shenzhen.lng, maxR: 7, propagationSpeed: 3, repeatPeriod: 700, color: C_RED },
      { lat: nodes.santaClara.lat, lng: nodes.santaClara.lng, maxR: 4, propagationSpeed: 1, repeatPeriod: 1500, color: C_CYAN }
    ]);

  }, [theme]);

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1.2;
      globeEl.current.controls().enableZoom = false;
    }
  }, []);

  const isLight = mounted && theme === 'light';

  return (
    <div className={`w-full h-[400px] overflow-hidden flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 relative transition-colors duration-300 ${isLight ? 'bg-blue-50' : 'bg-[#030712]'}`}>
      <div className="absolute top-4 left-4 z-10 glass-panel px-3 py-2 rounded-lg border border-gray-200 dark:border-white/5 bg-white/90 dark:bg-black/60 backdrop-blur-md">
        <span className="text-[10px] uppercase font-bold text-gray-800 dark:text-gray-300 tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Global Semiconductor Node Grid
        </span>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel px-3 py-2 rounded-lg border border-gray-200 dark:border-white/5 bg-white/90 dark:bg-black/60 backdrop-blur-md flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-gray-600 dark:text-gray-400"><div className="w-2 h-0.5 bg-[#a855f7]"></div> EUV Tech</div>
        <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-gray-600 dark:text-gray-400"><div className="w-2 h-0.5 bg-[#6366f1]"></div> IP & Design</div>
        <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-gray-600 dark:text-gray-400"><div className="w-2 h-0.5 bg-[#10b981]"></div> Assembly</div>
        <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-red-500"><div className="w-2 h-0.5 bg-red-500"></div> Disrupted</div>
      </div>

      {mounted && (
        <Globe
          ref={globeEl}
          width={500}
          height={400}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={isLight ? "//unpkg.com/three-globe/example/img/earth-day.jpg" : "//unpkg.com/three-globe/example/img/earth-dark.jpg"}
          arcsData={arcsData}
          arcStartLat={d => d.startLat}
          arcStartLng={d => d.startLng}
          arcEndLat={d => d.endLat}
          arcEndLng={d => d.endLng}
          arcColor={d => d.color}
          arcDashLength={0.3}
          arcDashGap={0.1}
          arcDashAnimateTime={1200}
          arcStroke={1.2}
          
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
          labelDotRadius={d => d.size * 0.6}
          labelColor={d => d.color}
          labelResolution={2}
        />
      )}
    </div>
  );
}
