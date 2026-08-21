import { useEffect, useState, useRef } from 'react';
import Globe from 'react-globe.gl';

export default function WorldMap() {
  const globeEl = useRef();
  const [arcsData, setArcsData] = useState([]);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    // Generate some mock supply chain routes
    const routes = [
      { startLat: 31.23, startLng: 121.47, endLat: 1.35, endLng: 103.81, color: '#3b82f6' }, // Shanghai to Singapore
      { startLat: 1.35, startLng: 103.81, endLat: 28.61, endLng: 77.20, color: '#ef4444' }, // Singapore to Delhi (Risk)
      { startLat: 51.50, startLng: -0.12, endLat: 40.71, endLng: -74.00, color: '#10b981' }, // London to NY
      { startLat: 35.67, startLng: 139.65, endLat: 37.77, endLng: -122.41, color: '#3b82f6' }, // Tokyo to SF
      { startLat: -33.86, startLng: 151.20, endLat: 1.35, endLng: 103.81, color: '#f59e0b' } // Sydney to Singapore
    ];
    setArcsData(routes);

    const locations = [
      { lat: 31.23, lng: 121.47, name: 'Shanghai (Supplier)', size: 1.5, color: 'white' },
      { lat: 1.35, lng: 103.81, name: 'Singapore (Hub)', size: 2, color: 'red' },
      { lat: 28.61, lng: 77.20, name: 'Delhi (Destination)', size: 1.5, color: 'white' },
      { lat: 40.71, lng: -74.00, name: 'New York (Port)', size: 1.5, color: 'white' },
      { lat: 51.50, lng: -0.12, name: 'London (HQ)', size: 2, color: 'white' }
    ];
    setPlaces(locations);
  }, []);

  useEffect(() => {
    // Auto-rotate
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 1.0;
      globeEl.current.controls().enableZoom = false;
    }
  }, []);

  return (
    <div className="w-full h-[350px] overflow-hidden flex items-center justify-center bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-white/10 relative">
      <div className="absolute top-4 left-4 z-10 glass-panel px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/5 bg-black/50 backdrop-blur-md">
        <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">3D Global Supply Network</span>
      </div>
      <Globe
        ref={globeEl}
        width={400}
        height={300}
        backgroundColor="#0a0a0a"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        arcsData={arcsData}
        arcStartLat={d => d.startLat}
        arcStartLng={d => d.startLng}
        arcEndLat={d => d.endLat}
        arcEndLng={d => d.endLng}
        arcColor={d => d.color}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1500}
        labelsData={places}
        labelLat={d => d.lat}
        labelLng={d => d.lng}
        labelText={d => d.name}
        labelSize={d => d.size}
        labelDotRadius={d => d.size * 0.5}
        labelColor={d => d.color}
        labelResolution={2}
      />
    </div>
  );
}
