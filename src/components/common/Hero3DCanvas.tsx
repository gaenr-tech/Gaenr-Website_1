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
  cyanLight: THREE.DirectionalLight;
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
  // Ambient Light
  objs.ambientLight.color.setHex(isDark ? 0xdbeafe : 0xffffff);
  objs.ambientLight.intensity = isDark ? 3.4 : 2.2;

  // Blue Directional Light
  objs.blueLight.color.setHex(isDark ? 0x38bdf8 : 0x0256d0);
  objs.blueLight.intensity = isDark ? 4.5 : 3.4;

  // Cyan Directional Light
  objs.cyanLight.color.setHex(isDark ? 0x00ffff : 0x38bdf8);
  objs.cyanLight.intensity = isDark ? 3.5 : 2.2;

  // Core Globe Sphere - rich 3D sphere volume, specular gloss & natural hemisphere occlusion
  objs.coreMat.color.setHex(isDark ? 0x0369a1 : 0x0256d0);
  objs.coreMat.emissive.setHex(isDark ? 0x0284c7 : 0x023680);
  objs.coreMat.specular.setHex(isDark ? 0x38bdf8 : 0x60a5fa);
  objs.coreMat.shininess = isDark ? 65 : 45;
  objs.coreMat.opacity = isDark ? 0.35 : 0.22;
  objs.coreMat.needsUpdate = true;

  // Atmospheric Corona Halo (Planetary Fresnel Rim)
  objs.haloMat.color.setHex(isDark ? 0x38bdf8 : 0x0256d0);
  objs.haloMat.opacity = isDark ? 0.38 : 0.16;
  objs.haloMat.needsUpdate = true;

  // Latitude Rings
  objs.latLineMats.forEach(({ mat, isEquator }) => {
    mat.color.setHex(isDark ? 0x38bdf8 : 0x0256d0);
    mat.opacity = isDark ? (isEquator ? 0.65 : 0.30) : (isEquator ? 0.30 : 0.12);
    mat.needsUpdate = true;
  });

  // Longitude Rings
  objs.lonLineMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x38bdf8 : 0x0256d0);
    mat.opacity = isDark ? 0.28 : 0.12;
    mat.needsUpdate = true;
  });

  // Continental Matrix Particles (Actual Earth Landmasses)
  objs.landMat.size = isDark ? 0.046 : 0.036;
  objs.landMat.opacity = isDark ? 0.98 : 0.85;
  objs.landMat.needsUpdate = true;

  // Ocean Grid Dots
  objs.oceanMat.color.setHex(isDark ? 0x38bdf8 : 0x0256d0);
  objs.oceanMat.opacity = isDark ? 0.30 : 0.18;
  objs.oceanMat.needsUpdate = true;

  // City Hub Pins & Beacons
  objs.pinMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x38bdf8 : 0x0256d0);
    mat.needsUpdate = true;
  });

  objs.pillarMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x00ffff : 0x38bdf8);
    mat.needsUpdate = true;
  });

  objs.tipMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0xffffff : 0x38bdf8);
    mat.needsUpdate = true;
  });

  // City Hub Pulse Waves
  objs.ringMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x00ffff : 0x38bdf8);
    mat.needsUpdate = true;
  });

  // Persistent Faint Base Arcs (Underlying Global Constellation Grid)
  objs.baseArcMats.forEach((mat) => {
    mat.color.setHex(isDark ? 0x38bdf8 : 0x0256d0);
    mat.opacity = isDark ? 0.25 : 0.16;
    mat.needsUpdate = true;
  });

  // Dynamic Stream Arc Materials
  objs.streamMats.forEach((mat) => {
    mat.opacity = isDark ? 0.95 : 0.85;
    mat.needsUpdate = true;
  });

  // Traveling Light Pulses (Beads)
  objs.pulseMats.forEach(({ mat, isEven }) => {
    mat.color.setHex(isDark ? (isEven ? 0xffffff : 0x00ffff) : (isEven ? 0x0256d0 : 0x0084ff));
    mat.needsUpdate = true;
  });

  // Orbital Ring
  objs.orbitRingMat.color.setHex(isDark ? 0x38bdf8 : 0x0256d0);
  objs.orbitRingMat.opacity = isDark ? 0.38 : 0.16;
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

  // Pacific Ocean Bridge (Balances Pacific hemisphere)
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
 * Harmonious, scheduled global network transmission sequence.
 * Structured into 4 orchestrated waves spanning the entire planet in an 8.0-second master cycle.
 * Data packets flow continuously across continents like a synchronized global relay.
 */
interface TimedRoute {
  id: string;
  from: string;
  to: string;
  startTime: number; // Seconds within the 8.0s master cycle
  duration: number;  // Transit duration in seconds
}

const CYCLE_DURATION = 8.0;

const TIMED_ROUTES: TimedRoute[] = [
  // Wave 1: South Asia & Asia-Pacific Relay (t = 0.0s - 2.4s)
  { id: 'r1', from: 'dhaka', to: 'singapore', startTime: 0.0, duration: 1.5 },
  { id: 'r2', from: 'dhaka', to: 'dubai', startTime: 0.2, duration: 1.6 },
  { id: 'r3', from: 'singapore', to: 'tokyo', startTime: 0.8, duration: 1.5 },
  { id: 'r4', from: 'singapore', to: 'sydney', startTime: 1.0, duration: 1.7 },
  { id: 'r5', from: 'tokyo', to: 'seoul', startTime: 1.4, duration: 1.1 },

  // Wave 2: Trans-Pacific Highway & Americas Spine (t = 2.0s - 4.4s)
  { id: 'r6', from: 'tokyo', to: 'honolulu', startTime: 2.0, duration: 1.8 },
  { id: 'r7', from: 'sydney', to: 'honolulu', startTime: 2.2, duration: 1.8 },
  { id: 'r8', from: 'honolulu', to: 'sf', startTime: 2.8, duration: 1.7 },
  { id: 'r9', from: 'sf', to: 'vancouver', startTime: 3.5, duration: 1.2 },
  { id: 'r10', from: 'sf', to: 'ny', startTime: 3.7, duration: 1.7 },
  { id: 'r11', from: 'sf', to: 'santiago', startTime: 3.9, duration: 2.0 },
  { id: 'r12', from: 'ny', to: 'saopaulo', startTime: 4.2, duration: 1.9 },

  // Wave 3: Trans-Atlantic & Euro-African Relay (t = 4.4s - 6.4s)
  { id: 'r13', from: 'ny', to: 'london', startTime: 4.6, duration: 1.8 },
  { id: 'r14', from: 'ny', to: 'reykjavik', startTime: 4.8, duration: 1.5 },
  { id: 'r15', from: 'reykjavik', to: 'london', startTime: 5.4, duration: 1.2 },
  { id: 'r16', from: 'saopaulo', to: 'capetown', startTime: 5.1, duration: 2.0 },
  { id: 'r17', from: 'london', to: 'zurich', startTime: 5.5, duration: 1.2 },
  { id: 'r18', from: 'saopaulo', to: 'santiago', startTime: 5.3, duration: 1.4 },

  // Wave 4: Eurasian Crossroads & Convergence Back to Gaenr HQ (t = 5.9s - 8.0s)
  { id: 'r19', from: 'zurich', to: 'dubai', startTime: 5.9, duration: 1.7 },
  { id: 'r20', from: 'dubai', to: 'nairobi', startTime: 6.1, duration: 1.5 },
  { id: 'r21', from: 'nairobi', to: 'capetown', startTime: 6.5, duration: 1.6 },
  { id: 'r22', from: 'capetown', to: 'mumbai', startTime: 6.4, duration: 1.9 },
  { id: 'r23', from: 'dubai', to: 'mumbai', startTime: 6.6, duration: 1.4 },
  { id: 'r24', from: 'mumbai', to: 'dhaka', startTime: 6.9, duration: 1.4 },
  { id: 'r25', from: 'seoul', to: 'dhaka', startTime: 6.7, duration: 1.5 },
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
 * Calculates an exact point along a spherical great-circle arc with harmonic parabolic elevation.
 * This guarantees mathematically pure curvature with zero kink, zero dip, and graceful cresting.
 */
function getGreatCirclePoint(
  norm1: THREE.Vector3,
  axis: THREE.Vector3,
  angle: number,
  radius: number,
  maxLift: number,
  t: number
): THREE.Vector3 {
  const pt = norm1.clone().applyAxisAngle(axis, angle * t);
  const altitude = Math.sin(t * Math.PI) * maxLift;
  return pt.multiplyScalar(radius + altitude);
}

/**
 * Determines current progress [0, 1] of a route within the looping master cycle.
 * Returns -1 if the route is currently inactive/dormant.
 * Wraps seamlessly across the cycle boundary without discontinuity.
 */
function getRouteProgress(t: number, start: number, duration: number, cycle: number): number {
  const normTime = t % cycle;
  let elapsed = normTime - start;
  if (elapsed < 0) elapsed += cycle;
  if (elapsed <= duration) {
    return elapsed / duration;
  }
  return -1;
}

/**
 * Revolutionary 3D Connected Cyber-Planet.
 * - Accurate Real-World Earth Continents generated from high-density geographic coordinates.
 * - Vertical 3D Laser Beacons projecting into space from major innovation hubs.
 * - Fiber-Optic Great-Circle Arcs with synchronized comet particle transmissions.
 * - Interactive Mouse Gyro Tilt & Touch Drag-to-Spin for an Awwwards-caliber experience.
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

    // Lighting: Angled Key & Rim directional lights creating rich 3D planetary shading
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const blueLight = new THREE.DirectionalLight(0x0256d0, 3.4);
    blueLight.position.set(4, 3, 4);
    scene.add(blueLight);

    const cyanLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    cyanLight.position.set(-4, -1, 3);
    scene.add(cyanLight);

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
      specular: 0x60a5fa,
      shininess: 45,
      transparent: true,
      opacity: 0.22,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Atmospheric Corona Halo (Planetary Fresnel Rim Glow)
    const haloGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.03, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x0256d0,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.16,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(haloMesh);

    // Latitude & Longitude Coordinate Lines
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
        color: 0x0256d0,
        transparent: true,
        opacity: lat === 0 ? 0.35 : 0.15,
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
        color: 0x0256d0,
        transparent: true,
        opacity: 0.14,
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
    const colorBlue = new THREE.Color(0x0256d0);
    const colorCyan = new THREE.Color(0x38bdf8);

    EARTH_LAND_POINTS.forEach(([lat, lon], idx) => {
      const pos = latLonToVector3(lat, lon, GLOBE_RADIUS * 1.002);
      landPositions.push(pos.x, pos.y, pos.z);
      const c = idx % 3 === 0 ? colorCyan : colorBlue;
      landColors.push(c.r, c.g, c.b);
    });

    const landGeo = new THREE.BufferGeometry();
    landGeo.setAttribute('position', new THREE.Float32BufferAttribute(landPositions, 3));
    landGeo.setAttribute('color', new THREE.Float32BufferAttribute(landColors, 3));

    const landMat = new THREE.PointsMaterial({
      size: 0.036,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
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
      size: 0.022,
      transparent: true,
      opacity: 0.18,
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

      // Height of 3D beacon pillar (Dhaka has the tallest flagship beacon)
      const beaconHeight = isHQ ? 0.32 : 0.20;
      const tipPos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS + beaconHeight);
      beaconTipMap.set(hub.id, tipPos);

      // Vertical 3D Laser Pillar Line
      const pillarGeo = new THREE.BufferGeometry().setFromPoints([surfacePos, tipPos]);
      const pillarMat = new THREE.LineBasicMaterial({
        color: isHQ ? 0x00ffff : 0x38bdf8,
        transparent: true,
        opacity: isHQ ? 0.95 : 0.75,
      });
      pillarMats.push(pillarMat);
      beaconsGroup.add(new THREE.Line(pillarGeo, pillarMat));

      // Surface Marker Pin Core
      const pinGeo = new THREE.SphereGeometry(isHQ ? 0.046 : 0.034, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: isHQ ? 0x00ffff : 0x0256d0,
      });
      pinMats.push(pinMat);
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(surfacePos);
      beaconsGroup.add(pin);

      // Glowing Star at the Tip of the Beacon
      const tipGeo = new THREE.SphereGeometry(isHQ ? 0.038 : 0.026, 12, 12);
      const tipMat = new THREE.MeshBasicMaterial({
        color: isHQ ? 0xffffff : 0x38bdf8,
      });
      tipMats.push(tipMat);
      const tip = new THREE.Mesh(tipGeo, tipMat);
      tip.position.copy(tipPos);
      beaconsGroup.add(tip);

      // Surface Radar Pulse Ring
      const ringGeo = new THREE.RingGeometry(0.016, 0.040, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: isHQ ? 0x00ffff : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
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

      // Special secondary concentric beacon ring for Gaenr HQ (Dhaka)
      if (isHQ) {
        const hqRingGeo = new THREE.RingGeometry(0.044, 0.068, 24);
        const hqRingMat = new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
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

    // 4. FIBER-OPTIC 3D ARCS CONNECTING THE WORLD (Launching between Beacons)
    const arcsGroup = new THREE.Group();

    interface ActiveStreamArc {
      route: TimedRoute;
      curvePoints: THREE.Vector3[];
      colorAttr: THREE.BufferAttribute;
      colorArray: Float32Array;
      pulseMesh: THREE.Mesh;
      segments: number;
      beamLength: number;
      isActive: boolean;
    }

    const activeArcs: ActiveStreamArc[] = [];
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
      const maxLift = Math.min(Math.max(angle * 0.18, 0.10), 0.28) * GLOBE_RADIUS;

      const segments = 48;
      const curvePoints: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const currentR = THREE.MathUtils.lerp(startR, endR, t);
        const pt = norm1.clone().applyAxisAngle(axis, angle * t);
        const altitude = Math.sin(t * Math.PI) * maxLift;
        pt.multiplyScalar(currentR + altitude);
        curvePoints.push(pt);
      }

      // Base Track Line (Faint subtle structural path)
      const baseGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const baseMat = new THREE.LineBasicMaterial({
        color: 0x0256d0,
        transparent: true,
        opacity: 0.16,
      });
      baseArcMats.push(baseMat);
      arcsGroup.add(new THREE.Line(baseGeo, baseMat));

      // Dynamic Animated Comet Stream Line
      const streamGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const colorArray = new Float32Array((segments + 1) * 3);
      const colorAttr = new THREE.BufferAttribute(colorArray, 3);
      streamGeo.setAttribute('color', colorAttr);

      const streamMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
      });
      streamMats.push(streamMat);
      arcsGroup.add(new THREE.Line(streamGeo, streamMat));

      // Glowing Photon Bead (Data Packet)
      const pulseGeo = new THREE.SphereGeometry(0.036, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x0256d0 : 0x0084ff,
      });
      pulseMats.push({ mat: pulseMat, isEven: idx % 2 === 0 });
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      pulseMesh.visible = false;
      arcsGroup.add(pulseMesh);

      activeArcs.push({
        route,
        curvePoints,
        colorAttr,
        colorArray,
        pulseMesh,
        segments,
        beamLength: 0.32,
        isActive: false,
      });
    });
    globeGroup.add(arcsGroup);

    // Subtle orbital ring framing the 3D planet
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

    // Assemble Themeable Collection & Apply Current Theme
    const themeObjs: ThemeableObjects = {
      ambientLight,
      blueLight,
      cyanLight,
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

    // 5. INTERACTIVE 3D GYRO TILT & TOUCH / DRAG-TO-SPIN
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let mouseVelocityX = 0;
    let mouseVelocityY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      container.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      targetTiltX = normY * 0.45;
      targetTiltY = normX * 0.65;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        mouseVelocityX = deltaX * 0.005;
        mouseVelocityY = deltaY * 0.005;
        globeGroup.rotation.y += mouseVelocityX;
        globeGroup.rotation.x += mouseVelocityY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {}
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now() * 0.001;
      const isDarkNow = isDarkRef.current;

      // Inertial damping & ambient rotation
      if (!isDragging) {
        mouseVelocityX *= 0.94;
        mouseVelocityY *= 0.94;
        globeGroup.rotation.y += 0.0016 + mouseVelocityX;
        globeGroup.rotation.x += mouseVelocityY;

        // Smooth gyro tilt following cursor position
        tiltX = THREE.MathUtils.lerp(tiltX, targetTiltX, 0.05);
        tiltY = THREE.MathUtils.lerp(tiltY, targetTiltY, 0.05);
        globeGroup.rotation.x = THREE.MathUtils.lerp(globeGroup.rotation.x, 0.22 + tiltX, 0.03);
      }

      // Arrival flare tracker for destination nodes
      const hubFlares = new Map<string, number>();

      // Update Scheduled Active Streams
      activeArcs.forEach((arc) => {
        const progress = getRouteProgress(now, arc.route.startTime, arc.route.duration, CYCLE_DURATION);

        if (progress < 0) {
          if (arc.isActive) {
            arc.colorArray.fill(0);
            arc.colorAttr.needsUpdate = true;
            arc.pulseMesh.visible = false;
            arc.isActive = false;
          }
          return;
        }

        arc.isActive = true;
        arc.pulseMesh.visible = true;

        // Position photon bead at head of transmission
        const sampleIdx = Math.min(
          Math.floor(progress * arc.segments),
          arc.segments - 1
        );
        const subT = progress * arc.segments - sampleIdx;
        const ptA = arc.curvePoints[sampleIdx];
        const ptB = arc.curvePoints[sampleIdx + 1] || ptA;
        const headPt = ptA.clone().lerp(ptB, subT);

        arc.pulseMesh.position.copy(headPt);
        const pScale = 0.9 + Math.sin(progress * Math.PI) * 0.35;
        arc.pulseMesh.scale.set(pScale, pScale, pScale);

        // Arrival flare on destination beacon as beam nears target
        if (progress >= 0.86) {
          const flareIntensity = Math.sin(((progress - 0.86) / 0.14) * Math.PI);
          const prevFlare = hubFlares.get(arc.route.to) || 0;
          hubFlares.set(arc.route.to, Math.max(prevFlare, flareIntensity));
        }

        // Calculate vertex colors along the comet beam using exact signature palette
        const L = arc.beamLength;
        const headR = isDarkNow ? 1.0 : 0.22;
        const headG = isDarkNow ? 1.0 : 0.74;
        const headB = isDarkNow ? 1.0 : 0.97;

        const tailR = isDarkNow ? 0.0 : 0.008;
        const tailG = isDarkNow ? 0.45 : 0.337;
        const tailB = isDarkNow ? 0.85 : 0.816;

        for (let j = 0; j <= arc.segments; j++) {
          const s = j / arc.segments;
          const d = progress - s;

          if (d >= 0 && d <= L) {
            const t = d / L;
            const fade = Math.pow(1 - t, 1.6);
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

      // Smooth, tranquil ripple wave expansion on hub rings with destination arrival flares
      beaconRings.forEach((pr) => {
        const phase = ((now * 0.55 + pr.index * 0.14) % 1.0);
        const flare = hubFlares.get(pr.hubId) || 0;
        const s = 1.0 + phase * 1.5 + flare * 0.5;
        pr.mesh.scale.set(s, s, 1);
        const mat = pr.mesh.material as THREE.MeshBasicMaterial;
        const baseOpacity = Math.sin(phase * Math.PI) * (pr.isHQ ? 0.95 : 0.75);
        mat.opacity = Math.min(1.0, baseOpacity + flare * 0.4);
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
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      themeObjectsRef.current = null;
    };
  }, []);

  return (
    <div
      className="relative w-full aspect-square max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] mx-auto flex items-center justify-center bg-transparent select-none cursor-grab active:cursor-grabbing"
      title="Drag to rotate the 3D globe"
    >
      <div ref={mountRef} className="w-full h-full bg-transparent flex items-center justify-center touch-none" />
      <HeroGlobeMessages />
    </div>
  );
};
