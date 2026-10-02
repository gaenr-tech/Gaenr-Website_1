import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

interface Pathway3DCanvasProps {
  className?: string;
}

// Exact authentic SVG symbol from user's Drive file (1rXkREFrRJLV6k_kerKR8dJ3uMr5Yq8sm)
// Two authentic closed 3D arrow wings that touch at the center (458, 143) and (457, 147)
const LEFT_ARROW_PATH =
  'M0 0 C3.93 1.31 5.32 3.8 7.69 7 C48.31 60.26 110.47 92.94 176.25 102.31 C202.63 105.3 229.98 104.7 256 99 C262.59 92.41 258.43 61.81 258.56 53 C258.61 50.37 258.65 47.75 258.69 45.12 C258.8 38.75 258.9 32.38 259 26 C262.12 27.23 265.01 28.48 267.88 30.22 C268.62 30.67 269.36 31.12 270.12 31.58 C270.93 32.07 271.73 32.56 272.56 33.06 C273.43 33.59 274.3 34.11 275.19 34.65 C280.27 37.73 285.34 40.82 290.42 43.91 C292.11 44.94 293.81 45.97 295.51 47 C296.68 47.71 297.85 48.43 299.02 49.14 C308.64 54.99 318.31 60.76 328 66.5 C338.12 72.49 348.21 78.52 358.25 84.62 C359.11 85.15 359.11 85.15 359.98 85.68 C364.56 88.46 369.13 91.25 373.71 94.04 C377.72 96.49 381.73 98.93 385.75 101.38 C386.32 101.72 386.89 102.07 387.48 102.43 C398.39 109.06 409.37 115.58 420.36 122.08 C426.62 125.78 432.85 129.5 439.03 133.31 C440.1 133.97 441.17 134.63 442.27 135.31 C444.24 136.53 446.22 137.75 448.19 138.99 C449.05 139.52 449.91 140.06 450.8 140.61 C451.54 141.07 452.29 141.54 453.06 142.02 C455.08 143.23 455.08 143.23 458 143 L457 147 C447.75 152.08 438.83 157.6 429.95 163.3 C422.62 167.99 415.23 172.58 407.81 177.12 C400.31 181.73 392.81 186.35 385.38 191.06 C369.88 200.88 354.32 210.59 338.69 220.19 C330.46 225.24 322.27 230.33 314.12 235.5 C304.78 241.41 295.4 247.27 286.02 253.11 C283.01 255 279.99 256.88 276.98 258.77 C275.09 259.95 273.2 261.13 271.31 262.31 C270.45 262.86 269.58 263.4 268.69 263.96 C267.88 264.47 267.07 264.97 266.24 265.49 C265.54 265.93 264.84 266.37 264.11 266.82 C261.81 268.11 259.46 269.04 257 270 C257 269.18 257 268.36 257.01 267.51 C257.03 259.79 257.04 252.06 257.05 244.34 C257.06 240.37 257.06 236.4 257.08 232.42 C257.09 228.59 257.09 224.76 257.09 220.93 C257.1 219.47 257.1 218 257.11 216.54 C257.11 214.49 257.11 212.45 257.11 210.4 C257.12 209.23 257.12 208.07 257.12 206.87 C257.13 203.93 257.13 203.93 256 201 C249.8 199.24 243.43 198.42 237.07 197.45 C194.53 190.89 152.96 177.04 117 153 C116.28 152.52 115.55 152.03 114.81 151.54 C105.01 144.93 95.85 137.82 87 130 C85.82 128.98 85.82 128.98 84.61 127.95 C72.13 117.03 60.05 105.2 50 92 C49.01 90.75 48.02 89.5 47.04 88.26 C29.67 66.2 16.25 42.65 5 17 C4.42 15.7 3.84 14.4 3.26 13.11 C-0.27 5.03 -0.27 5.03 0 0 Z';

const RIGHT_ARROW_PATH =
  'M458 143 C459.92 142.03 461.8 140.97 463.65 139.88 C464.22 139.55 464.78 139.22 465.36 138.88 C467.22 137.78 469.08 136.67 470.94 135.56 C472.24 134.79 473.55 134.02 474.85 133.25 C486.14 126.56 497.36 119.75 508.57 112.92 C514.03 109.59 519.51 106.28 525 103 C531.6 99.05 538.17 95.08 544.73 91.08 C556.12 84.15 567.53 77.29 579 70.5 C589.12 64.51 599.21 58.48 609.25 52.38 C610.37 51.69 611.49 51.01 612.65 50.31 C618.06 47.02 623.46 43.72 628.85 40.41 C631.44 38.82 634.03 37.23 636.63 35.65 C637.86 34.89 639.1 34.13 640.34 33.37 C642.04 32.31 643.76 31.27 645.47 30.22 C646.93 29.32 646.93 29.32 648.42 28.4 C651 27 651 27 655 26 C655.33 49.76 655.66 73.52 656 98 C660.03 99.34 663 100.28 667.05 100.82 C668.46 101 668.46 101 669.89 101.19 C670.88 101.31 671.86 101.44 672.88 101.56 C673.9 101.69 674.92 101.82 675.97 101.95 C684.31 102.98 692.6 103.71 701 104 C702.16 104.04 703.31 104.08 704.5 104.12 C740.26 104.75 776.33 96.25 809 82 C809.8 81.65 810.6 81.3 811.43 80.94 C846.09 65.63 878.24 41.32 901.89 11.62 C905.11 7.62 908.43 3.69 912 0 C912.33 0 912.66 0 913 0 C913.33 5.02 912.3 8.37 910.29 12.95 C910.01 13.61 909.72 14.26 909.43 14.93 C908.51 17.04 907.57 19.15 906.62 21.25 C906.3 21.97 905.98 22.69 905.65 23.43 C890.63 57.2 869.35 86.45 844.25 113.44 C843.65 114.09 843.05 114.74 842.43 115.41 C838.19 119.91 833.7 123.99 829 128 C827.52 129.3 827.52 129.3 826.01 130.63 C812.68 142.15 798.42 152.45 783 161 C782.18 161.46 781.36 161.91 780.51 162.39 C753.39 177.36 724.63 187.92 694.31 194.31 C693.22 194.54 692.13 194.77 691.01 195.01 C679.71 197.27 668.51 198.5 657 200 C657 223.1 657 246.2 657 270 C653.14 269.04 650.93 267.9 647.59 265.82 C646.53 265.17 645.47 264.51 644.37 263.83 C643.23 263.12 642.08 262.4 640.94 261.69 C639.75 260.95 638.57 260.22 637.38 259.48 C629.98 254.89 622.62 250.25 615.27 245.58 C608.55 241.32 601.78 237.16 595 233 C586.67 227.89 578.36 222.73 570.11 217.5 C555.37 208.16 540.56 198.94 525.69 189.81 C517.47 184.77 509.28 179.68 501.13 174.52 C486.49 165.23 471.79 156.04 457 147 L458 143 Z';

/**
 * High-performance 3D Pathway Symbol component.
 * Converts authentic vector symbol into two independent, beveled 3D arrow meshes:
 * - Two separate 3D arrows start distinctly disconnected (displaced to the sides)
 * - They glide inward while progressively revealing from outer tips
 * - Right before connecting, they become 100% FULLY VISIBLE as two solid, separate 3D arrows
 * - Then they visibly travel the final gap and CONNECT / WELD together at center!
 * - Holds at 100% full, then instantly cuts to invisible in one snap (NO fade)
 * - Loops seamlessly
 */
export const Pathway3DCanvas: React.FC<Pathway3DCanvasProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 480;
    let height = container.clientHeight || 280;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 1, 2000);
    camera.position.set(0, 0, 480);

    // 3. Renderer with transparent background and antialiasing
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.filter =
      'drop-shadow(0 16px 24px rgba(2, 86, 208, 0.22)) drop-shadow(0 4px 10px rgba(0, 30, 80, 0.12))';
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);

    // 4. Two Independent Solid Extruded 3D Arrow Meshes
    const loader = new SVGLoader();
    const leftSvgData = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 913 270"><path d="${LEFT_ARROW_PATH}" /></svg>`);
    const rightSvgData = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 913 270"><path d="${RIGHT_ARROW_PATH}" /></svg>`);

    const group = new THREE.Group();
    const symbolGroup = new THREE.Group();
    const leftGroup = new THREE.Group();
    const rightGroup = new THREE.Group();

    symbolGroup.add(leftGroup);
    symbolGroup.add(rightGroup);
    group.add(symbolGroup);

    // Starting clip distance for progressive tip reveal
    const X_CLIP_START = 460;

    // Clipping planes: Left arrow clips from left tip inward; Right arrow clips from right tip inward
    const localPlaneLeft = new THREE.Plane(new THREE.Vector3(-1, 0, 0), -X_CLIP_START);
    const localPlaneRight = new THREE.Plane(new THREE.Vector3(1, 0, 0), -X_CLIP_START);
    const worldPlaneLeft = new THREE.Plane();
    const worldPlaneRight = new THREE.Plane();

    // Authentic brand blue materials
    const frontMaterialLeft = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0256d0'),
      emissive: new THREE.Color('#012563'),
      emissiveIntensity: 0.18,
      metalness: 0.35,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
      side: THREE.DoubleSide,
      clippingPlanes: [worldPlaneLeft],
      clipShadows: true,
    });

    const sideMaterialLeft = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0043a8'),
      metalness: 0.45,
      roughness: 0.35,
      side: THREE.DoubleSide,
      clippingPlanes: [worldPlaneLeft],
      clipShadows: true,
    });

    const frontMaterialRight = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0256d0'),
      emissive: new THREE.Color('#012563'),
      emissiveIntensity: 0.18,
      metalness: 0.35,
      roughness: 0.22,
      clearcoat: 0.85,
      clearcoatRoughness: 0.15,
      reflectivity: 0.9,
      side: THREE.DoubleSide,
      clippingPlanes: [worldPlaneRight],
      clipShadows: true,
    });

    const sideMaterialRight = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#0043a8'),
      metalness: 0.45,
      roughness: 0.35,
      side: THREE.DoubleSide,
      clippingPlanes: [worldPlaneRight],
      clipShadows: true,
    });

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 2,
      depth: 18,
      bevelEnabled: true,
      bevelThickness: 3.5,
      bevelSize: 2.5,
      bevelOffset: 0,
      bevelSegments: 5,
    };

    // Build Left 3D Arrow (Independent Solid Geometry)
    const leftMeshes: THREE.Mesh[] = [];
    leftSvgData.paths.forEach((path) => {
      const shapes = path.toShapes();
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // Center around the shared emblem origin (456.5, 135)
        geometry.translate(-456.5, -135, -9);
        const mesh = new THREE.Mesh(geometry, [frontMaterialLeft, sideMaterialLeft]);
        mesh.scale.set(0.48, -0.48, 0.48);
        leftGroup.add(mesh);
        leftMeshes.push(mesh);
      });
    });

    // Build Right 3D Arrow (Independent Solid Geometry)
    const rightMeshes: THREE.Mesh[] = [];
    rightSvgData.paths.forEach((path) => {
      const shapes = path.toShapes();
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        // Center around the shared emblem origin (456.5, 135)
        geometry.translate(-456.5, -135, -9);
        const mesh = new THREE.Mesh(geometry, [frontMaterialRight, sideMaterialRight]);
        mesh.scale.set(0.48, -0.48, 0.48);
        rightGroup.add(mesh);
        rightMeshes.push(mesh);
      });
    });

    scene.add(group);

    // 5. Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(150, 200, 300);
    scene.add(keyLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    blueRimLight.position.set(-200, -100, 200);
    scene.add(blueRimLight);

    const topFill = new THREE.DirectionalLight(0x93c5fd, 1.3);
    topFill.position.set(0, 300, 100);
    scene.add(topFill);

    // 6. Responsive Framing Function
    let baseScale = 0.48;
    const updateProjectionAndFraming = () => {
      if (!container) return;
      width = container.clientWidth || 360;
      height = container.clientHeight || 220;
      const aspect = width / height;

      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      baseScale = width < 480 ? 0.38 : width < 768 ? 0.42 : 0.48;
      leftMeshes.forEach((m) => m.scale.set(baseScale, -baseScale, baseScale));
      rightMeshes.forEach((m) => m.scale.set(baseScale, -baseScale, baseScale));

      const vFovRad = (camera.fov * Math.PI) / 180;
      const totalWorldWidth = 913 * baseScale + 120;
      const safeCoverage = width < 480 ? 0.85 : width < 768 ? 0.85 : 0.86;
      const requiredVisibleWidth = totalWorldWidth / safeCoverage;
      const requiredVisibleHeight = requiredVisibleWidth / aspect;
      const targetZ = (requiredVisibleHeight / 2) / Math.tan(vFovRad / 2);

      camera.position.z = Math.max(500, targetZ);
    };

    updateProjectionAndFraming();

    const handleResize = () => {
      updateProjectionAndFraming();
    };

    window.addEventListener('resize', handleResize);

    // 7. Dual-Arrow Silky Smooth High-Speed Approach & Connection Animation Loop
    // Cycle:
    // 0.00s - 0.50s: Original calm, smooth progressive drawing from tips (invisible -> 100% visible)
    //                At 0.50s: Both arrows are 100% FULLY VISIBLE with only a tight ~8px gap remaining!
    // 0.50s - 0.57s: Lightning-fast 70ms snap swoop into seamless connection!
    // 0.57s - 0.78s: Crisp tactile impact settle & lock with damped elastic absorption
    // 0.78s - 3.50s: 100% full, solid, authentic static hold (no movement)
    // 3.50s - 3.75s: Instant snap cut to invisible in one single frame (NO fade / NO backward un-drawing)
    let animationFrameId: number;
    const startTime = performance.now();
    const cycleDuration = 3.75;

    const MAX_SEPARATION_X = 40;  // Reduced initial separation so post-reveal distance is tight (~8px)
    const MAX_SEPARATION_Y = 5;   // Natural curved trajectory alignment
    const MAX_ROTATION_Z = 0.012; // Subtle dynamic tilt while gliding inward

    const T_REVEAL = 0.50;        // Original speed: calm progressive drawing until 100% visible
    const T_CONNECT = 0.57;       // Ultra-fast connection (70ms surge after becoming visible!)

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;
      const cycleTime = elapsedTime % cycleDuration;

      if (cycleTime >= 3.50) {
        // Phase 4: Instant cut to invisible in one single snap (no fade animation!)
        group.visible = false;
      } else {
        group.visible = true;

        if (cycleTime < T_CONNECT) {
          // Phase 1: Glides inward smoothly while drawing, then accelerates rapidly into connection
          const u = cycleTime / T_CONNECT;
          // Smooth accelerating kinetic curve: remaining gap at 0.50s is only ~8px, then snaps together in 70ms
          const moveFactor = 1 - Math.pow(u, 1.7);

          const currentSepX = MAX_SEPARATION_X * moveFactor;
          const currentSepY = MAX_SEPARATION_Y * moveFactor;
          const currentRotZ = MAX_ROTATION_Z * moveFactor;

          leftGroup.position.x = -currentSepX;
          leftGroup.position.y = currentSepY;
          leftGroup.rotation.z = -currentRotZ;

          rightGroup.position.x = currentSepX;
          rightGroup.position.y = -currentSepY;
          rightGroup.rotation.z = currentRotZ;

          // Progressive reveal: original speed, finishes at 0.50s
          if (cycleTime < T_REVEAL) {
            const r = cycleTime / T_REVEAL;
            const revealEase = 1 - Math.pow(1 - r, 1.8);
            const clipDist = -X_CLIP_START * (1 - revealEase) + 500 * revealEase;
            localPlaneLeft.constant = clipDist;
            localPlaneRight.constant = clipDist;
          } else {
            // 100% fully visible, solid 3D arrows surging into connection
            localPlaneLeft.constant = 500;
            localPlaneRight.constant = 500;
          }

          symbolGroup.position.set(0, 0, 0);
          symbolGroup.scale.set(1.0, 1.0, 1.0);
        } else if (cycleTime < 0.78) {
          // Phase 2: Connected! Tactile micro-arrival impact with upward lift & spring settle
          localPlaneLeft.constant = 500;
          localPlaneRight.constant = 500;
          leftGroup.position.set(0, 0, 0);
          rightGroup.position.set(0, 0, 0);
          leftGroup.rotation.z = 0;
          rightGroup.rotation.z = 0;

          const settleT = (cycleTime - T_CONNECT) / 0.21;
          // Smooth upward lift effect upon connection
          const upwardLift = Math.sin(settleT * Math.PI) * Math.exp(-settleT * 2.5) * 4.8;
          symbolGroup.position.y = upwardLift;

          const bounce = Math.sin(settleT * Math.PI) * Math.exp(-settleT * 3.2) * 0.024;
          symbolGroup.scale.set(1.0 + bounce, 1.0 + bounce, 1.0 + bounce);
        } else {
          // Phase 3: 100% full, solid, completely authentic static hold
          localPlaneLeft.constant = 500;
          localPlaneRight.constant = 500;
          leftGroup.position.set(0, 0, 0);
          rightGroup.position.set(0, 0, 0);
          leftGroup.rotation.z = 0;
          rightGroup.rotation.z = 0;
          symbolGroup.position.set(0, 0, 0);
          symbolGroup.scale.set(1.0, 1.0, 1.0);
        }

        // Strictly static anchor
        group.position.set(0, 0, 0);
        group.rotation.set(0, 0, 0);

        // Update world clipping planes to follow meshes precisely
        group.updateMatrixWorld(true);
        if (leftMeshes.length > 0 && rightMeshes.length > 0) {
          worldPlaneLeft.copy(localPlaneLeft).applyMatrix4(leftMeshes[0].matrixWorld);
          worldPlaneRight.copy(localPlaneRight).applyMatrix4(rightMeshes[0].matrixWorld);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div className={`relative w-full flex items-center justify-center ${className}`}>
      {/* Soft ambient depth shadow directly beneath the 3D symbol */}
      <div className="absolute w-[62%] sm:w-[50%] h-6 sm:h-7 bottom-2 sm:bottom-3 rounded-full bg-blue-900/18 blur-xl pointer-events-none transform scale-y-75" />
      <div
        ref={mountRef}
        className="relative w-full h-[240px] sm:h-[280px] lg:h-[320px] flex items-center justify-center pointer-events-auto select-none"
        title="Gaenr Pathway"
      />
    </div>
  );
};
