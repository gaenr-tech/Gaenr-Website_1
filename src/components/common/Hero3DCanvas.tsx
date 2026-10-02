import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CityHub {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

// Key global talent & client innovation hubs across all continents
const HUBS: CityHub[] = [
  { id: 'dhaka', name: 'Dhaka', lat: 23.8103, lon: 90.4125 },
  { id: 'london', name: 'London', lat: 51.5074, lon: -0.1278 },
  { id: 'sf', name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { id: 'ny', name: 'New York', lat: 40.7128, lon: -74.006 },
  { id: 'singapore', name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { id: 'dubai', name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { id: 'sydney', name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { id: 'berlin', name: 'Berlin', lat: 52.52, lon: 13.405 },
  { id: 'toronto', name: 'Toronto', lat: 43.6532, lon: -79.3832 },
];

// Multi-point global connections across the entire world (no single central bottleneck)
const NETWORK_ROUTES: [string, string][] = [
  ['sf', 'ny'],
  ['ny', 'london'],
  ['london', 'berlin'],
  ['berlin', 'dubai'],
  ['dubai', 'dhaka'],
  ['dhaka', 'singapore'],
  ['singapore', 'tokyo'],
  ['tokyo', 'sf'],
  ['sf', 'sydney'],
  ['singapore', 'sydney'],
  ['london', 'toronto'],
  ['toronto', 'sf'],
  ['dhaka', 'london'],
  ['dubai', 'singapore'],
  ['dhaka', 'tokyo'],
];

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

/**
 * Boundaryless Transparent 3D Global Connection Visual.
 * - 100% transparent PNG feel: no borders, no boxes, no edge cutoffs.
 * - Decentralized full-mesh talent network connecting hubs across all continents.
 * - Generous camera frustum padding to guarantee no clipping on top, bottom, or sides.
 */
export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    // Scene & Camera centered with ample field of view so nothing ever clips
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    // Positioned strictly along center (y=0) with enough z-distance
    camera.position.set(0, 0, 5.6);

    // Transparent WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% transparent background
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const blueLight = new THREE.DirectionalLight(0x0256d0, 3.2);
    blueLight.position.set(4, 3, 4);
    scene.add(blueLight);

    const cyanLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    cyanLight.position.set(-4, -1, 3);
    scene.add(cyanLight);

    // Root Globe Group centered at (0, 0, 0)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.rotation.x = 0.22;
    globeGroup.rotation.y = 0.6;

    // Sized comfortably to fit inside camera frustum with >20% boundary clearance
    const GLOBE_RADIUS = 1.32;

    // Inner Translucent Core Sphere
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.98, 48, 48);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x0256d0,
      emissive: 0x023680,
      specular: 0x60a5fa,
      shininess: 35,
      transparent: true,
      opacity: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Soft Atmospheric Halo
    const haloGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.025, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x0256d0,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.12,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // Latitude & Longitude Coordinate Lines
    const gridLinesGroup = new THREE.Group();
    const latAngles = [-60, -40, -20, 0, 20, 40, 60];
    latAngles.forEach((lat) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const r = GLOBE_RADIUS * Math.sin(phi);
      const y = GLOBE_RADIUS * Math.cos(phi);
      const ringGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
      }
      ringGeo.setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x0256d0,
        transparent: true,
        opacity: lat === 0 ? 0.35 : 0.15,
      });
      gridLinesGroup.add(new THREE.Line(ringGeo, ringMat));
    });

    for (let i = 0; i < 8; i++) {
      const lonRingGeo = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let j = 0; j <= segments; j++) {
        const phi = (j / segments) * Math.PI * 2;
        const x = GLOBE_RADIUS * Math.cos(phi);
        const y = GLOBE_RADIUS * Math.sin(phi);
        points.push(new THREE.Vector3(x, y, 0));
      }
      lonRingGeo.setFromPoints(points);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0x0256d0,
        transparent: true,
        opacity: 0.14,
      });
      const lineMesh = new THREE.Line(lonRingGeo, ringMat);
      lineMesh.rotation.y = (i / 8) * Math.PI;
      gridLinesGroup.add(lineMesh);
    }
    globeGroup.add(gridLinesGroup);

    // Continental Matrix Particles
    const pointCount = 1000;
    const dotPositions: number[] = [];
    const dotColors: number[] = [];
    const colorBlue = new THREE.Color(0x0256d0);
    const colorCyan = new THREE.Color(0x38bdf8);

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / pointCount);
      const theta = Math.PI * (1 + 5 ** 0.5) * i;

      const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = GLOBE_RADIUS * Math.cos(phi);
      const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);

      dotPositions.push(x, y, z);
      const c = Math.random() > 0.4 ? colorBlue : colorCyan;
      dotColors.push(c.r, c.g, c.b);
    }

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute('color', new THREE.Float32BufferAttribute(dotColors, 3));

    const dotMat = new THREE.PointsMaterial({
      size: 0.034,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const pointsMesh = new THREE.Points(dotGeo, dotMat);
    globeGroup.add(pointsMesh);

    // Global Hub Pins with Pulse Rings
    const hubMap = new Map<string, THREE.Vector3>();
    const hubsGroup = new THREE.Group();
    const pulseRings: { mesh: THREE.Mesh; maxScale: number; speed: number }[] = [];

    HUBS.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS);
      hubMap.set(hub.id, pos);

      const hubGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const hubMat = new THREE.MeshBasicMaterial({
        color: 0x0256d0,
      });
      const hubMesh = new THREE.Mesh(hubGeo, hubMat);
      hubMesh.position.copy(pos);
      hubsGroup.add(hubMesh);

      // Expanding pulse ring on each hub
      const ringGeo = new THREE.RingGeometry(0.015, 0.038, 20);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      hubsGroup.add(ringMesh);

      pulseRings.push({
        mesh: ringMesh,
        maxScale: 2.2,
        speed: 0.02 + Math.random() * 0.01,
      });
    });
    globeGroup.add(hubsGroup);

    // Decentralized Multi-point Connection Arcs
    const arcsGroup = new THREE.Group();
    interface ArcData {
      curve: THREE.CubicBezierCurve3;
      pulseMesh: THREE.Mesh;
      progress: number;
      speed: number;
      direction: 1 | -1;
    }
    const arcsData: ArcData[] = [];

    NETWORK_ROUTES.forEach(([fromId, toId], idx) => {
      const fromPos = hubMap.get(fromId);
      const toPos = hubMap.get(toId);
      if (!fromPos || !toPos) return;

      const distance = fromPos.distanceTo(toPos);
      const mid = fromPos.clone().add(toPos).multiplyScalar(0.5);
      // Elevation kept within compact range so arcs never touch viewport edges
      const elevation = GLOBE_RADIUS + Math.min(distance * 0.35, 0.42);

      const ctrl1 = fromPos.clone().lerp(mid, 0.45).normalize().multiplyScalar(elevation);
      const ctrl2 = toPos.clone().lerp(mid, 0.45).normalize().multiplyScalar(elevation);

      const curve = new THREE.CubicBezierCurve3(fromPos, ctrl1, ctrl2, toPos);
      const curvePoints = curve.getPoints(36);

      const arcGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x0256d0,
        transparent: true,
        opacity: 0.45,
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcsGroup.add(arcLine);

      // Glowing traveling light pulse packet along each route
      const pulseGeo = new THREE.SphereGeometry(0.038, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x0256d0 : 0x0084ff,
      });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      arcsGroup.add(pulseMesh);

      arcsData.push({
        curve,
        pulseMesh,
        progress: (idx / NETWORK_ROUTES.length) * 0.95,
        speed: 0.004 + (idx % 4) * 0.002,
        direction: idx % 2 === 0 ? 1 : -1,
      });
    });
    globeGroup.add(arcsGroup);

    // Subtle orbital ring safely contained within viewport
    const orbitRingGeo = new THREE.RingGeometry(GLOBE_RADIUS * 1.2, GLOBE_RADIUS * 1.215, 64);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x0256d0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.16,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.2;
    orbitRing.rotation.y = 0.2;
    globeGroup.add(orbitRing);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth ambient rotation
      globeGroup.rotation.y += 0.002;

      // Animate hub pulse rings
      pulseRings.forEach((pr) => {
        pr.mesh.scale.x += pr.speed;
        pr.mesh.scale.y += pr.speed;
        const mat = pr.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(0, 1 - pr.mesh.scale.x / pr.maxScale);

        if (pr.mesh.scale.x >= pr.maxScale) {
          pr.mesh.scale.set(1, 1, 1);
        }
      });

      // Animate pulses along routes (bidirectional flow across the globe)
      arcsData.forEach((arc) => {
        if (arc.direction === 1) {
          arc.progress += arc.speed;
          if (arc.progress > 1) arc.progress = 0;
        } else {
          arc.progress -= arc.speed;
          if (arc.progress < 0) arc.progress = 1;
        }
        const point = arc.curve.getPoint(arc.progress);
        arc.pulseMesh.position.copy(point);
      });

      // Subtle breathing float oscillation
      const time = Date.now() * 0.001;
      globeGroup.position.y = Math.sin(time) * 0.025;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] mx-auto flex items-center justify-center bg-transparent pointer-events-none select-none">
      <div ref={mountRef} className="w-full h-full bg-transparent flex items-center justify-center" />
    </div>
  );
};
