/* ==========================================================================
   IRON DISTRICT - THREE.JS 3D INTERACTIVE WORLD GLOBE SCENE (#C8FF00 + #F5F5F0)
   ========================================================================== */

export function initThreeScene() {
  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  try {
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;
    const isMobile = window.innerWidth < 768;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = isMobile ? 32 : 28;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.domElement.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;';
    container.appendChild(renderer.domElement);

    // Particle Texture Generator (White Core to Lime Halo)
    function createParticleTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.3, 'rgba(200, 255, 0, 0.95)');
      gradient.addColorStop(0.65, 'rgba(160, 220, 0, 0.35)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(canvas);
    }

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 9.8;

    function latLonToVector3(lat, lon, radius) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }

    // 1. Dark Core Sphere
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 0.98, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x0A0A0A,
      transparent: true,
      opacity: 0.92
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreSphere);

    // 2. Latitude & Longitude Wireframe Grid Rings
    const gridMat = new THREE.LineBasicMaterial({
      color: 0xC8FF00,
      transparent: true,
      opacity: 0.12
    });

    for (let lat = -60; lat <= 60; lat += 20) {
      const rad = GLOBE_RADIUS * Math.cos(lat * (Math.PI / 180));
      const y = GLOBE_RADIUS * Math.sin(lat * (Math.PI / 180));
      const ringGeo = new THREE.BufferGeometry();
      const ringPts = [];
      for (let i = 0; i <= (isMobile ? 32 : 64); i++) {
        const theta = (i / (isMobile ? 32 : 64)) * Math.PI * 2;
        ringPts.push(new THREE.Vector3(Math.cos(theta) * rad, y, Math.sin(theta) * rad));
      }
      ringGeo.setFromPoints(ringPts);
      const ring = new THREE.Line(ringGeo, gridMat);
      globeGroup.add(ring);
    }

    for (let lon = 0; lon < 180; lon += 30) {
      const ringGeo = new THREE.BufferGeometry();
      const ringPts = [];
      for (let i = 0; i <= (isMobile ? 32 : 64); i++) {
        const theta = (i / (isMobile ? 32 : 64)) * Math.PI * 2;
        const x = Math.sin(theta) * GLOBE_RADIUS;
        const y = Math.cos(theta) * GLOBE_RADIUS;
        ringPts.push(new THREE.Vector3(x * Math.cos(lon * (Math.PI / 180)), y, x * Math.sin(lon * (Math.PI / 180))));
      }
      ringGeo.setFromPoints(ringPts);
      const ring = new THREE.Line(ringGeo, gridMat);
      globeGroup.add(ring);
    }

    // 3. Globe Point Cloud & Continent Clusters (Optimized for Mobile)
    const totalParticles = isMobile ? 1800 : 3400;
    const positions = new Float32Array(totalParticles * 3);
    const colors = new Float32Array(totalParticles * 3);

    const colorAccent = new THREE.Color(0xC8FF00); // Lime Accent
    const colorSubtle = new THREE.Color(0x94B800); // Subdued Lime
    const colorWhite = new THREE.Color(0xF5F5F0);  // Off-white

    const continents = [
      [10, 65, 40, 140],   // Asia
      [-35, 37, -15, 52],  // Africa
      [36, 68, -10, 45],   // Europe
      [15, 68, -130, -60], // North America
      [-55, 12, -80, -35], // South America
      [-40, -10, 115, 155] // Australia
    ];

    let pIdx = 0;
    for (let i = 0; i < totalParticles; i++) {
      let lat, lon;
      if (Math.random() < 0.72) {
        const cont = continents[Math.floor(Math.random() * continents.length)];
        lat = cont[0] + Math.random() * (cont[1] - cont[0]);
        lon = cont[2] + Math.random() * (cont[3] - cont[2]);
      } else {
        lat = (Math.random() - 0.5) * 160;
        lon = (Math.random() - 0.5) * 360;
      }

      const v = latLonToVector3(lat, lon, GLOBE_RADIUS + (Math.random() - 0.5) * 0.2);
      positions[pIdx] = v.x;
      positions[pIdx + 1] = v.y;
      positions[pIdx + 2] = v.z;

      const randColor = Math.random();
      const ptColor = randColor > 0.4 ? colorAccent.clone().lerp(colorSubtle, Math.random()) : colorWhite;
      colors[pIdx] = ptColor.r;
      colors[pIdx + 1] = ptColor.g;
      colors[pIdx + 2] = ptColor.b;

      pIdx += 3;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.8 : 0.7,
      vertexColors: true,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const globeParticles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(globeParticles);

    // 4. Global Hub Beacons & 3D Connection Arcs
    const cities = [
      { name: 'Peshawar (HQ)', lat: 34.0151, lon: 71.5249, isHQ: true },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
      { name: 'London', lat: 51.5074, lon: -0.1278 },
      { name: 'New York', lat: 40.7128, lon: -74.0060 },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
    ];

    const hqPos = latLonToVector3(cities[0].lat, cities[0].lon, GLOBE_RADIUS);

    cities.forEach((c) => {
      const pos = latLonToVector3(c.lat, c.lon, GLOBE_RADIUS);
      const beaconGeo = new THREE.SphereGeometry(c.isHQ ? 0.35 : 0.22, 16, 16);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: c.isHQ ? 0xC8FF00 : 0xF5F5F0,
        transparent: true,
        opacity: 0.95
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.copy(pos);
      globeGroup.add(beaconMesh);
    });

    for (let i = 1; i < cities.length; i++) {
      const destPos = latLonToVector3(cities[i].lat, cities[i].lon, GLOBE_RADIUS);
      const mid = new THREE.Vector3().addVectors(hqPos, destPos).multiplyScalar(0.5);
      const dist = hqPos.distanceTo(destPos);
      mid.normalize().multiplyScalar(GLOBE_RADIUS + dist * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(hqPos, mid, destPos);
      const points = curve.getPoints(isMobile ? 24 : 40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xC8FF00,
        transparent: true,
        opacity: 0.4
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      globeGroup.add(arcLine);
    }

    // 5. Atmospheric Outer Halo Ring
    const haloCount = isMobile ? 180 : 350;
    const haloPos = new Float32Array(haloCount * 3);
    for (let i = 0; i < haloCount; i++) {
      const theta = (i / haloCount) * Math.PI * 2;
      const r = GLOBE_RADIUS * 1.25 + (Math.random() - 0.5) * 1.2;
      haloPos[i * 3] = Math.cos(theta) * r;
      haloPos[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      haloPos[i * 3 + 2] = Math.sin(theta) * r;
    }
    const haloGeo = new THREE.BufferGeometry();
    haloGeo.setAttribute('position', new THREE.BufferAttribute(haloPos, 3));
    const haloMat = new THREE.PointsMaterial({
      size: 0.65,
      color: 0xC8FF00,
      map: createParticleTexture(),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const haloPoints = new THREE.Points(haloGeo, haloMat);
    haloPoints.rotation.x = 0.35;
    globeGroup.add(haloPoints);

    // Mouse & Smooth Rotation Interaction (Reduced on Mobile)
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    if (!isMobile) {
      window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 1.5;
        targetY = (e.clientY / window.innerHeight - 0.5) * 1.2;
      });
    }

    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      globeGroup.rotation.y = elapsedTime * 0.15 + currentX * 0.6;
      globeGroup.rotation.x = 0.25 + currentY * 0.4;

      haloPoints.rotation.z = elapsedTime * 0.05;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    });
  } catch (e) {
    console.warn('Three.js Globe Init Notice:', e);
  }
}
