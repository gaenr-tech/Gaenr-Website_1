import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HeroGlobeMessages } from './HeroGlobeMessages';
import { useTheme } from '../../context/ThemeContext';
import { EARTH_LAND_POINTS } from '../../data/earthLandPoints';

interface CityHub {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface ThemeableObjects {
  ambientLight: THREE.AmbientLight;
  blueLight: THREE.DirectionalLight;
  secondaryBlueLight: THREE.DirectionalLight;
  coreMat: THREE.MeshPhongMaterial;
  haloMat: THREE.MeshBasicMaterial;
  latLineMats: { mat: THREE.LineBasicMaterial; isEquator: boolean }[];
  lonLineMats: THREE.LineBasicMaterial[];
  landMat: THREE.PointsMaterial;
  oceanMat: THREE.PointsMaterial;
  pinMats: THREE.MeshBasicMaterial[];
  pillarMats: THREE.LineBasicMaterial[];
  tipMats: THREE.MeshBasicMaterial[];
  ringMats: THREE.MeshBasicMaterial[];
  baseArcMats: THREE.LineBasicMaterial[];
  streamMats: THREE.LineBasicMaterial[];
  pulseMats: { mat: THREE.MeshBasicMaterial; isEven: boolean }[];
  orbitRingMat: THREE.MeshBasicMaterial;
}

function applyThemeToObjects(objs: ThemeableObjects, isDark: boolean) {
  // Ambient Light - soft blue tint
  objs.ambientLight.color.setHex(isDark ? 0xdbeafe : 0xf0f7ff);
  objs.ambientLight.intensity = isDark ? 3.0 : 2.2;

  // Key Blue Directional Light
  objs.blueLight.color.setHex(isDark ? 0x2563eb : 0x0256d0);
  objs.blueLight.intensity = isDark ? 4.2 : 3.2;

  // Secondary Blue Directional Light
  objs.secondaryBlueLight.color.setHex(isDark ? 0x3b82f6 : 0x1d4ed8);
  objs.secondaryBlueLight.intensity = isDark ? 3.0 : 2.0;

  // Core Globe Sphere - rich 3D planetary volume
  objs.coreMat.color.setHex(isDark ? 0x1d4ed8 : 0x0256d0);
  objs.coreMat.emissive.setHex(isDark ? 0x1e3a8a : 0x023680);
  objs.coreMat.specular.setHex(isDark ? 0x60a5fa : 0x3b82f6);
  objs.coreMat.shininess = isDark ? 55 : 40;
  objs.coreMat.opacity = isDark ? 0.28 : 0.18;
  objs.coreMat.needsUpdate = true;

  // Atmospheric Corona Halo (Planetary Fresnel Rim Glow)
  objs.haloMat.color.setHex(isDark ? 0x2563eb : 0x0256d0);
  objs.haloMat.opacity = isDark ? 0.22 : 0.12;
  objs.haloMat.needsUpdate = true;

  // Latitude Coordinate Rings (Ultra-faint, whisper-soft)
  objs.latLineMats.forEach(({ mat, isEquator }) => {
    mat.color.setHex(isDark ? 0x3b82f6 : 0x60a5fa);
    mat.opacity = isDark ? (isEquator ? 0.08 : 0.03) : (isEquator ? 0.05 : 0.02);
    mat.needsUpdate = true;
  });

  // Longitude Coordinate Rings (Ultra-faint, whisper-soft)
  objs.lonLineMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x3b82f6 : 0x60a5fa);
    mat.opacity = isDark ? 0.04 : 0.02;
    mat.needsUpdate = true;
  });

  // Continental Landmass Particles
  objs.landMat.size = isDark ? 0.044 : 0.035;
  objs.landMat.opacity = isDark ? 0.95 : 0.82;
  objs.landMat.needsUpdate = true;

  // Ocean Grid Dots (Faint Depth)
  objs.oceanMat.color.setHex(isDark ? 0x2563eb : 0x0256d0);
  objs.oceanMat.opacity = isDark ? 0.16 : 0.10;
  objs.oceanMat.needsUpdate = true;

  // City Hub Pins & Beacons (Blueish)
  objs.pinMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x3b82f6 : 0x0256d0);
    mat.needsUpdate = true;
  });

  objs.pillarMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x60a5fa : 0x3b82f6);
    mat.opacity = isDark ? 0.20 : 0.12;
    mat.needsUpdate = true;
  });

  objs.tipMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x60a5fa : 0x3b82f6);
    mat.needsUpdate = true;
  });

  // City Hub Radar Pulse Rings - Soft & subtle
  objs.ringMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x3b82f6 : 0x0256d0);
    mat.opacity = isDark ? 0.25 : 0.18;
    mat.needsUpdate = true;
  });

  // Persistent Base Arcs - Even less opacity (whisper-faint 0.012 / 0.020)
  objs.baseArcMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x3b82f6 : 0x60a5fa);
    mat.opacity = isDark ? 0.020 : 0.012;
    mat.needsUpdate = true;
  });

  // Dynamic Stream Arc Materials - Even less opacity (soft, subtle, luminous 0.20 / 0.28)
  objs.streamMats.forEach((mat) => {
    mat.opacity = isDark ? 0.28 : 0.20;
    mat.needsUpdate = true;
  });

  // Traveling Light Pulses (Beads) - Blueish & soft
  objs.pulseMats.forEach(({ mat, isEven }) => {
    mat.color.setHex(isDark ? (isEven ? 0x3b82f6 : 0x60a5fa) : (isEven ? 0x0256d0 : 0x2563eb));
    mat.needsUpdate = true;
  });

  // Orbital Ring - Ultra-subtle
  objs.orbitRingMat.color.setHex(isDark ? 0x3b82f6 : 0x60a5fa);
  objs.orbitRingMat.opacity = isDark ? 0.04 : 0.02;
  objs.orbitRingMat.needsUpdate = true;
}

// 18 Harmoniously distributed global innovation hubs spanning all hemispheres & longitudes
const HUBS: CityHub[] = [
  // South Asia (Gaenr HQ Talent Hub)
  { id: 'dhaka', name: 'Dhaka', lat: 23.8103, lon: 90.4125 },
  { id: 'mumbai', name: 'Mumbai', lat: 19.076, lon: 72.8777 },

  // Southeast & East Asia
  { id: 'singapore', name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { id: 'seoul', name: 'Seoul', lat: 37.5665, lon: 126.978 },

  // Oceania
  { id: 'sydney', name: 'Sydney', lat: -33.8688, lon: 151.2093 },

  // Pacific Ocean Bridge
  { id: 'honolulu', name: 'Honolulu', lat: 21.3069, lon: -157.8583 },

  // North America
  { id: 'sf', name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { id: 'vancouver', name: 'Vancouver', lat: 49.2827, lon: -123.1207 },
  { id: 'ny', name: 'New York', lat: 40.7128, lon: -74.006 },

  // North Atlantic Bridge
  { id: 'reykjavik', name: 'Reykjavik', lat: 64.1466, lon: -21.9426 },

  // Europe
  { id: 'london', name: 'London', lat: 51.5074, lon: -0.1278 },
  { id: 'zurich', name: 'Zurich', lat: 47.3769, lon: 8.5417 },

  // Middle East
  { id: 'dubai', name: 'Dubai', lat: 25.2048, lon: 55.2708 },

  // Africa
  { id: 'nairobi', name: 'Nairobi', lat: -1.2921, lon: 36.8219 },
  { id: 'capetown', name: 'Cape Town', lat: -33.9249, lon: 18.4241 },

  // South America
  { id: 'saopaulo', name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
  { id: 'santiago', name: 'Santiago', lat: -33.4489, lon: -70.6693 },
];

/**
 * 25 Global Interconnected Routes spanning all continents.
 * Each route has its own transit duration and staggered phase offset, ensuring
 * continuous, fluid, living motion across all connections without stopping.
 */
interface TimedRoute {
  id: string;
  from: string;
  to: string;
  duration: number;    // Loop duration in seconds
  phaseOffset: number; // Staggered phase offset [0, 1]
}

const TIMED_ROUTES: TimedRoute[] = [
  // Wave 1: South Asia & Asia-Pacific Relay
  { id: 'r1', from: 'dhaka', to: 'singapore', duration: 2.5, phaseOffset: 0.00 },
  { id: 'r2', from: 'dhaka', to: 'dubai', duration: 2.7, phaseOffset: 0.12 },
  { id: 'r3', from: 'singapore', to: 'tokyo', duration: 2.6, phaseOffset: 0.28 },
  { id: 'r4', from: 'singapore', to: 'sydney', duration: 2.9, phaseOffset: 0.40 },
  { id: 'r5', from: 'tokyo', to: 'seoul', duration: 2.3, phaseOffset: 0.52 },

  // Wave 2: Trans-Pacific Highway & Americas Spine
  { id: 'r6', from: 'tokyo', to: 'honolulu', duration: 3.1, phaseOffset: 0.18 },
  { id: 'r7', from: 'sydney', to: 'honolulu', duration: 3.3, phaseOffset: 0.34 },
  { id: 'r8', from: 'honolulu', to: 'sf', duration: 2.8, phaseOffset: 0.60 },
  { id: 'r9', from: 'sf', to: 'vancouver', duration: 2.4, phaseOffset: 0.72 },
  { id: 'r10', from: 'sf', to: 'ny', duration: 2.8, phaseOffset: 0.84 },
  { id: 'r11', from: 'sf', to: 'santiago', duration: 3.4, phaseOffset: 0.24 },
  { id: 'r12', from: 'ny', to: 'saopaulo', duration: 3.2, phaseOffset: 0.48 },

  // Wave 3: Trans-Atlantic & Euro-African Relay
  { id: 'r13', from: 'ny', to: 'london', duration: 3.0, phaseOffset: 0.08 },
  { id: 'r14', from: 'ny', to: 'reykjavik', duration: 2.6, phaseOffset: 0.36 },
  { id: 'r15', from: 'reykjavik', to: 'london', duration: 2.3, phaseOffset: 0.58 },
  { id: 'r16', from: 'saopaulo', to: 'capetown', duration: 3.5, phaseOffset: 0.70 },
  { id: 'r17', from: 'london', to: 'zurich', duration: 2.3, phaseOffset: 0.82 },
  { id: 'r18', from: 'saopaulo', to: 'santiago', duration: 2.5, phaseOffset: 0.94 },

  // Wave 4: Eurasian Crossroads & Convergence Back to Gaenr HQ
  { id: 'r19', from: 'zurich', to: 'dubai', duration: 2.8, phaseOffset: 0.15 },
  { id: 'r20', from: 'dubai', to: 'nairobi', duration: 2.6, phaseOffset: 0.32 },
  { id: 'r21', from: 'nairobi', to: 'capetown', duration: 2.7, phaseOffset: 0.50 },
  { id: 'r22', from: 'capetown', to: 'mumbai', duration: 3.2, phaseOffset: 0.65 },
  { id: 'r23', from: 'dubai', to: 'mumbai', duration: 2.5, phaseOffset: 0.78 },
  { id: 'r24', from: 'mumbai', to: 'dhaka', duration: 2.3, phaseOffset: 0.88 },
  { id: 'r25', from: 'seoul', to: 'dhaka', duration: 2.7, phaseOffset: 0.42 },
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
 * Revolutionary 3D Connected Cyber-Planet.
 * - Continuous, fluid, moving connection streams & dynamic undulations across the globe.
 * - Soft, ethereal low-opacity styling with signature blueish hues.
 * - Accurate Real-World Earth Continents generated from geographic coordinates.
 * - 3D Laser Beacons projecting from major innovation hubs.
 * - Interactive Mouse Gyro Tilt & Touch Drag-to-Spin.
 */
export const Hero3DCanvas: React.FC = () => {
  const { isDark } = useTheme();
  const isDarkRef = useRef(isDark);
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  const mountRef = useRef<HTMLDivElement>(null);
  const themeObjectsRef = useRef<ThemeableObjects | null>(null);

  useEffect(() => {
    if (themeObjectsRef.current) {
      applyThemeToObjects(themeObjectsRef.current, isDark);
    }
  }, [isDark]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    // Scene & Perspective Camera with generous view frustum
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.6);

    // Transparent WebGL Renderer with High-DPI support
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting: Pure Blue Directional Lights creating rich 3D planetary shading
    const ambientLight = new THREE.AmbientLight(0xf0f7ff, 2.2);
    scene.add(ambientLight);

    const blueLight = new THREE.DirectionalLight(0x0256d0, 3.2);
    blueLight.position.set(4, 3, 4);
    scene.add(blueLight);

    const secondaryBlueLight = new THREE.DirectionalLight(0x1d4ed8, 2.0);
    secondaryBlueLight.position.set(-4, -1, 3);
    scene.add(secondaryBlueLight);

    // Root Globe Group centered at (0, 0, 0)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroup.rotation.x = 0.22;
    globeGroup.rotation.y = 0.6;

    const GLOBE_RADIUS = 1.32;

    // Inner Translucent Core Sphere: gives rich 3D volume, specular gloss & depth occlusion
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.985, 48, 48);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x0256d0,
      emissive: 0x023680,
      specular: 0x3b82f6,
      shininess: 40,
      transparent: true,
      opacity: 0.18,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Atmospheric Corona Halo (Planetary Fresnel Rim Glow - Blueish & Low Opacity)
    const haloGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.03, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x0256d0,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.12,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // Latitude & Longitude Coordinate Lines (Subtle & Soft)
    const gridLinesGroup = new THREE.Group();
    const latAngles = [-60, -40, -20, 0, 20, 40, 60];
    const latLineMats: { mat: THREE.LineBasicMaterial; isEquator: boolean }[] = [];
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
        color: 0x60a5fa,
        transparent: true,
        opacity: lat === 0 ? 0.05 : 0.02,
        blending: THREE.AdditiveBlending,
      });
      latLineMats.push({ mat: ringMat, isEquator: lat === 0 });
      gridLinesGroup.add(new THREE.Line(ringGeo, ringMat));
    });

    const lonLineMats: THREE.LineBasicMaterial[] = [];
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
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.02,
        blending: THREE.AdditiveBlending,
      });
      lonLineMats.push(ringMat);
      const lineMesh = new THREE.Line(lonRingGeo, ringMat);
      lineMesh.rotation.y = (i / 8) * Math.PI;
      gridLinesGroup.add(lineMesh);
    }
    globeGroup.add(gridLinesGroup);

    // 1. REAL WORLD EARTH CONTINENTS (High-Density Vector Landmass Point Cloud)
    const landPositions: number[] = [];
    const landColors: number[] = [];
    const colorPrimaryBlue = new THREE.Color(0x0256d0);
    const colorElectricBlue = new THREE.Color(0x3b82f6);

    EARTH_LAND_POINTS.forEach(([lat, lon], idx) => {
      const pos = latLonToVector3(lat, lon, GLOBE_RADIUS * 1.002);
      landPositions.push(pos.x, pos.y, pos.z);
      const c = idx % 3 === 0 ? colorElectricBlue : colorPrimaryBlue;
      landColors.push(c.r, c.g, c.b);
    });

    const landGeo = new THREE.BufferGeometry();
    landGeo.setAttribute('position', new THREE.Float32BufferAttribute(landPositions, 3));
    landGeo.setAttribute('color', new THREE.Float32BufferAttribute(landColors, 3));

    const landMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.82,
    });
    const landMesh = new THREE.Points(landGeo, landMat);
    globeGroup.add(landMesh);

    // 2. Faint Ethereal Ocean Coordinate Grid (subtle depth reference)
    const oceanPositions: number[] = [];
    const oceanCount = 350;
    for (let i = 0; i < oceanCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / oceanCount);
      const theta = Math.PI * (1 + 5 ** 0.5) * i;
      oceanPositions.push(
        GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta),
        GLOBE_RADIUS * Math.cos(phi),
        GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta)
      );
    }
    const oceanGeo = new THREE.BufferGeometry();
    oceanGeo.setAttribute('position', new THREE.Float32BufferAttribute(oceanPositions, 3));
    const oceanMat = new THREE.PointsMaterial({
      color: 0x0256d0,
      size: 0.020,
      transparent: true,
      opacity: 0.10,
    });
    globeGroup.add(new THREE.Points(oceanGeo, oceanMat));

    // 3. VERTICAL 3D HOLOGRAPHIC LASER BEACONS (Rising from Major World Tech Hubs)
    const beaconsGroup = new THREE.Group();
    const beaconRings: { mesh: THREE.Mesh; hubId: string; index: number; isHQ: boolean }[] = [];
    const pinMats: THREE.MeshBasicMaterial[] = [];
    const pillarMats: THREE.LineBasicMaterial[] = [];
    const tipMats: THREE.MeshBasicMaterial[] = [];
    const ringMats: THREE.MeshBasicMaterial[] = [];
    const hubMap = new Map<string, THREE.Vector3>();
    const beaconTipMap = new Map<string, THREE.Vector3>();

    HUBS.forEach((hub, hubIdx) => {
      const isHQ = hub.id === 'dhaka';
      const surfacePos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS);
      hubMap.set(hub.id, surfacePos);

      // Height of 3D beacon pillar (Dhaka has the flagship beacon)
      const beaconHeight = isHQ ? 0.32 : 0.20;
      const tipPos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS + beaconHeight);
      beaconTipMap.set(hub.id, tipPos);

      // Vertical 3D Laser Pillar Line - Soft Opacity & Blueish
      const pillarGeo = new THREE.BufferGeometry().setFromPoints([surfacePos, tipPos]);
      const pillarMat = new THREE.LineBasicMaterial({
        color: isHQ ? 0x3b82f6 : 0x60a5fa,
        transparent: true,
        opacity: isHQ ? 0.35 : 0.20,
        blending: THREE.AdditiveBlending,
      });
      pillarMats.push(pillarMat);
      beaconsGroup.add(new THREE.Line(pillarGeo, pillarMat));

      // Surface Marker Pin Core
      const pinGeo = new THREE.SphereGeometry(isHQ ? 0.042 : 0.030, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: isHQ ? 0x3b82f6 : 0x0256d0,
      });
      pinMats.push(pinMat);
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(surfacePos);
      beaconsGroup.add(pin);

      // Tip of the Beacon (Blueish, Not Harsh White)
      const tipGeo = new THREE.SphereGeometry(isHQ ? 0.034 : 0.024, 12, 12);
      const tipMat = new THREE.MeshBasicMaterial({
        color: isHQ ? 0x60a5fa : 0x3b82f6,
      });
      tipMats.push(tipMat);
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.copy(tipPos);
      beaconsGroup.add(tip);

      // Surface Radar Pulse Ring - Soft & Blueish
      const ringGeo = new THREE.RingGeometry(0.016, 0.038, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isHQ ? 0x3b82f6 : 0x0256d0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      ringMats.push(ringMat);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(surfacePos);
      ringMesh.lookAt(surfacePos.clone().multiplyScalar(2));
      beaconsGroup.add(ringMesh);

      beaconRings.push({
        mesh: ringMesh,
        hubId: hub.id,
        index: hubIdx,
        isHQ,
      });

      // Secondary concentric beacon ring for Gaenr HQ (Dhaka)
      if (isHQ) {
        const hqRingGeo = new THREE.RingGeometry(0.040, 0.062, 24);
        const hqRingMat = new THREE.MeshBasicMaterial({
          color: 0x3b82f6,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.45,
        });
        ringMats.push(hqRingMat);
        const hqRingMesh = new THREE.Mesh(hqRingGeo, hqRingMat);
        hqRingMesh.position.copy(surfacePos);
        hqRingMesh.lookAt(surfacePos.clone().multiplyScalar(2));
        beaconsGroup.add(hqRingMesh);

        beaconRings.push({
          mesh: hqRingMesh,
          hubId: 'dhaka',
          index: hubIdx + 0.5,
          isHQ: true,
        });
      }
    });
    globeGroup.add(beaconsGroup);

    // 4. MOVABLE, DYNAMIC FIBER-OPTIC 3D ARCS (Continuous Motion, Less Opacity & Blueish)
    const arcsGroup = new THREE.Group();

    interface DynamicArc {
      route: TimedRoute;
      posArray: Float32Array;
      posAttr: THREE.BufferAttribute;
      colorArray: Float32Array;
      colorAttr: THREE.BufferAttribute;
      pulseMesh: THREE.Mesh;
      pulseMat: THREE.MeshBasicMaterial;
      segments: number;
      baseLift: number;
      lerpRadii: Float32Array;
      sinAltitudes: Float32Array;
      unitPoints: THREE.Vector3[];
      beamLength: number;
    }

    const activeArcs: DynamicArc[] = [];
    const baseArcMats: THREE.LineBasicMaterial[] = [];
    const streamMats: THREE.LineBasicMaterial[] = [];
    const pulseMats: { mat: THREE.MeshBasicMaterial; isEven: boolean }[] = [];

    TIMED_ROUTES.forEach((route, idx) => {
      const fromPos = beaconTipMap.get(route.from) || hubMap.get(route.from);
      const toPos = beaconTipMap.get(route.to) || hubMap.get(route.to);
      if (!fromPos || !toPos) return;

      const norm1 = fromPos.clone().normalize();
      const norm2 = toPos.clone().normalize();
      const angle = norm1.angleTo(norm2);

      let axis = new THREE.Vector3().crossVectors(norm1, norm2);
      if (axis.lengthSq() < 1e-6) {
        axis.set(0, 1, 0);
      } else {
        axis.normalize();
      }

      const startR = fromPos.length();
      const endR = toPos.length();
      const baseLift = Math.min(Math.max(angle * 0.18, 0.10), 0.28) * GLOBE_RADIUS;

      const segments = 48;
      const posArray = new Float32Array((segments + 1) * 3);
      const colorArray = new Float32Array((segments + 1) * 3);
      const lerpRadii = new Float32Array(segments + 1);
      const sinAltitudes = new Float32Array(segments + 1);
      const unitPoints: THREE.Vector3[] = [];

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        lerpRadii[i] = THREE.MathUtils.lerp(startR, endR, t);
        sinAltitudes[i] = Math.sin(t * Math.PI);
        const unitPt = norm1.clone().applyAxisAngle(axis, angle * t).normalize();
        unitPoints.push(unitPt);

        const r = lerpRadii[i] + sinAltitudes[i] * baseLift;
        posArray[i * 3 + 0] = unitPt.x * r;
        posArray[i * 3 + 1] = unitPt.y * r;
        posArray[i * 3 + 2] = unitPt.z * r;
      }

      const posAttr = new THREE.BufferAttribute(posArray, 3);
      const colorAttr = new THREE.BufferAttribute(colorArray, 3);

      // Shared geometry buffer for zero-overhead dynamic updates
      const baseGeo = new THREE.BufferGeometry();
      baseGeo.setAttribute('position', posAttr);

      // Base Track Line - Whisper-soft opacity (0.012) with additive blending
      const baseMat = new THREE.LineBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.012,
        blending: THREE.AdditiveBlending,
      });
      baseArcMats.push(baseMat);
      arcsGroup.add(new THREE.Line(baseGeo, baseMat));

      // Dynamic Animated Stream Line - Soft, Translucent & Glowing (0.20 opacity)
      const streamGeo = new THREE.BufferGeometry();
      streamGeo.setAttribute('position', posAttr);
      streamGeo.setAttribute('color', colorAttr);

      const streamMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.20,
        blending: THREE.AdditiveBlending,
      });
      streamMats.push(streamMat);
      arcsGroup.add(new THREE.Line(streamGeo, streamMat));

      // Smooth Glowing Photon Bead (Moving Data Packet)
      const pulseGeo = new THREE.SphereGeometry(0.018, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x0256d0 : 0x2563eb,
        transparent: true,
        opacity: 0.40,
        blending: THREE.AdditiveBlending,
      });
      pulseMats.push({ mat: pulseMat, isEven: idx % 2 === 0 });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      arcsGroup.add(pulseMesh);

      activeArcs.push({
        route,
        posArray,
        posAttr,
        colorArray,
        colorAttr,
        pulseMesh,
        pulseMat,
        segments,
        baseLift,
        lerpRadii,
        sinAltitudes,
        unitPoints,
        beamLength: 0.24,
      });
    });
    globeGroup.add(arcsGroup);

    // Subtle orbital ring framing the 3D planet (Faint Blueish)
    const orbitRingGeo = new THREE.RingGeometry(GLOBE_RADIUS * 1.2, GLOBE_RADIUS * 1.215, 64);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.03,
      blending: THREE.AdditiveBlending,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.2;
    orbitRing.rotation.y = 0.2;
    globeGroup.add(orbitRing);

    // Assemble Themeable Collection & Apply Current Theme
    const themeObjs: ThemeableObjects = {
      ambientLight,
      blueLight,
      secondaryBlueLight,
      coreMat,
      haloMat,
      latLineMats,
      lonLineMats,
      landMat,
      oceanMat,
      pinMats,
      pillarMats,
      tipMats,
      ringMats,
      baseArcMats,
      streamMats,
      pulseMats,
      orbitRingMat,
    };
    themeObjectsRef.current = themeObjs;
    applyThemeToObjects(themeObjs, isDark);

    // 5. INTERACTIVE 3D FLEXIBLE ROTATION & TOUCH GESTURES
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const startDrag = (clientX: number, clientY: number) => {
      isDragging = true;
      prevPointerX = clientX;
      prevPointerY = clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const moveDrag = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const normX = (clientX - rect.left) / rect.width - 0.5;
      const normY = (clientY - rect.top) / rect.height - 0.5;
      targetTiltX = normY * 0.35;
      targetTiltY = normX * 0.45;

      if (isDragging) {
        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;

        // Agile, flexible touch sensitivity for effortless rotation
        const sensitivity = 0.0085;
        velocityX = deltaX * sensitivity;
        velocityY = deltaY * sensitivity;

        globeGroup.rotation.y += velocityX;
        globeGroup.rotation.x = Math.max(-1.15, Math.min(1.15, globeGroup.rotation.x + velocityY));

        prevPointerX = clientX;
        prevPointerY = clientY;
      }
    };

    const endDrag = () => {
      isDragging = false;
    };

    // Pointer Events (Desktop Mouse & Pen)
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      startDrag(e.clientX, e.clientY);
      try {
        container.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      moveDrag(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      endDrag();
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerCancel = () => {
      endDrag();
    };

    // Dedicated Native Touch Events for mobile touch rotation
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        moveDrag(t.clientX, t.clientY);
      }
      if (e.cancelable) {
        e.preventDefault(); // Prevent mobile scroll conflict while interacting with globe
      }
    };

    const onTouchEnd = () => {
      endDrag();
    };

    renderer.domElement.style.touchAction = 'none';
    container.style.touchAction = 'none';

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now() * 0.001;
      const isDarkNow = isDarkRef.current;

      // Inertial damping & ambient rotation with smooth momentum flick
      if (!isDragging) {
        velocityX *= 0.94;
        velocityY *= 0.94;
        globeGroup.rotation.y += 0.0014 + velocityX;
        globeGroup.rotation.x = Math.max(-1.15, Math.min(1.15, globeGroup.rotation.x + velocityY));
      }

      // Arrival flare tracker for destination nodes
      const hubFlares = new Map<string, number>();

      // Signature Blueish Stream Colors
      const headR = isDarkNow ? 0.231 : 0.145;
      const headG = isDarkNow ? 0.510 : 0.388;
      const headB = isDarkNow ? 0.965 : 0.922;

      const tailR = isDarkNow ? 0.114 : 0.008;
      const tailG = isDarkNow ? 0.306 : 0.337;
      const tailB = isDarkNow ? 0.847 : 0.816;

      // CONTINUOUS, FLUID MOVING CONNECTIONS (Harmonic 3D Breathing & Moving Beams - Less Opacity)
      activeArcs.forEach((arc, arcIdx) => {
        // Continuous looping progress [0, 1] for every route
        const progress = ((now / arc.route.duration + arc.route.phaseOffset) % 1.0);

        // 1. DYNAMIC 3D MOVABLE ARC UNDULATION (Conduits flex & sway smoothly in 3D space)
        const dynamicLift = arc.baseLift * (1.0 + 0.15 * Math.sin(now * 1.8 + arcIdx * 0.7));

        for (let j = 0; j <= arc.segments; j++) {
          const r = arc.lerpRadii[j] + arc.sinAltitudes[j] * dynamicLift;
          const u = arc.unitPoints[j];
          arc.posArray[j * 3 + 0] = u.x * r;
          arc.posArray[j * 3 + 1] = u.y * r;
          arc.posArray[j * 3 + 2] = u.z * r;
        }
        arc.posAttr.needsUpdate = true;

        // 2. MOVING PHOTON BEAD (Soft, translucent blueish data packet)
        const sampleIdx = Math.min(Math.floor(progress * arc.segments), arc.segments - 1);
        const subT = progress * arc.segments - sampleIdx;
        const rA = arc.lerpRadii[sampleIdx] + arc.sinAltitudes[sampleIdx] * dynamicLift;
        const rB = arc.lerpRadii[sampleIdx + 1] + arc.sinAltitudes[sampleIdx + 1] * dynamicLift;
        const ptA = arc.unitPoints[sampleIdx].clone().multiplyScalar(rA);
        const ptB = arc.unitPoints[sampleIdx + 1].clone().multiplyScalar(rB);
        const beadPos = ptA.lerp(ptB, subT);

        arc.pulseMesh.position.copy(beadPos);
        const envelope = Math.sin(progress * Math.PI);
        const pScale = 0.55 + envelope * 0.30;
        arc.pulseMesh.scale.set(pScale, pScale, pScale);
        arc.pulseMat.opacity = envelope * (isDarkNow ? 0.35 : 0.24);

        // Arrival flare on destination beacon as beam nears target
        if (progress >= 0.82) {
          const flareIntensity = Math.sin(((progress - 0.82) / 0.18) * Math.PI);
          const prevFlare = hubFlares.get(arc.route.to) || 0;
          hubFlares.set(arc.route.to, Math.max(prevFlare, flareIntensity));
        }

        // 3. CONTINUOUS FLOWING COMET STREAM (Ultra-soft Opacity & Signature Blueish Hue)
        const L = arc.beamLength;

        for (let j = 0; j <= arc.segments; j++) {
          const s = j / arc.segments;
          const d = progress - s;

          if (d >= 0 && d <= L) {
            const t = d / L;
            const fade = Math.pow(1 - t, 1.8) * envelope * 0.65;
            arc.colorArray[j * 3 + 0] = (headR * (1 - t) + tailR * t) * fade;
            arc.colorArray[j * 3 + 1] = (headG * (1 - t) + tailG * t) * fade;
            arc.colorArray[j * 3 + 2] = (headB * (1 - t) + tailB * t) * fade;
          } else {
            arc.colorArray[j * 3 + 0] = 0;
            arc.colorArray[j * 3 + 1] = 0;
            arc.colorArray[j * 3 + 2] = 0;
          }
        }
        arc.colorAttr.needsUpdate = true;
      });

      // Smooth ripple wave expansion on hub rings with destination arrival flares
      beaconRings.forEach((pr) => {
        const phase = ((now * 0.55 + pr.index * 0.14) % 1.0);
        const flare = hubFlares.get(pr.hubId) || 0;
        const s = 1.0 + phase * 1.4 + flare * 0.4;
        pr.mesh.scale.set(s, s, 1);
        const mat = pr.mesh.material as THREE.MeshBasicMaterial;
        const baseOpacity = Math.sin(phase * Math.PI) * (pr.isHQ ? 0.35 : 0.25);
        mat.opacity = Math.min(0.70, baseOpacity + flare * 0.25);
      });

      // Subtle breathing float oscillation
      globeGroup.position.y = Math.sin(now * 0.8) * 0.02;

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
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      themeObjectsRef.current = null;
    };
  }, []);

  return (
    <div
      className="relative w-full aspect-square max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] mx-auto flex items-center justify-center bg-transparent select-none touch-none cursor-grab active:cursor-grabbing"
      title="Touch or drag to rotate the 3D globe"
    >
      <div ref={mountRef} className="w-full h-full bg-transparent flex items-center justify-center touch-none select-none" />
      <HeroGlobeMessages />
    </div>
  );
};
