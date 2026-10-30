/**
 * Web Worker for Procedurally Pre-sampling the 5 Morph Targets:
 * Shape 0: Customer Care Headset (Hero)
 * Shape 1: Customer Care Headset (Products / Finale)
 * Shape 2: Customer Care Headset (Inbound Support)
 * Shape 3: Phone Handset (Outbound Support)
 * Shape 4: Chat Speech Bubble (Chat Support)
 */

self.onmessage = function (e) {
  const { maxCount = 20000 } = e.data || {};
  const buffers = generateParticleBuffers(maxCount);
  
  // Post back transferable ArrayBuffers
  self.postMessage(
    buffers,
    [
      buffers.positionA.buffer,
      buffers.positionB.buffer,
      buffers.positionC.buffer,
      buffers.positionD.buffer,
      buffers.positionE.buffer,
      buffers.aSeed.buffer,
      buffers.aSize.buffer,
    ]
  );
};

/**
 * Procedural Customer Care Headset point sampler
 * - Headband: ~200-deg half-torus arc (radius ~1.0, tube ~0.07), slightly flattened
 * - Ear cups: two flattened cylinders/capsules (radius ~0.38, depth ~0.22) at arc ends with cushion ring (torus radius ~0.30, tube ~0.08) and small hinge connectors
 * - Microphone boom: thin curved tube (quadratic bezier, tube ~0.035, length ~0.9) from lower left cup toward front, ending in small capsule (radius ~0.07, length ~0.16)
 */
function sampleHeadsetPoint() {
  const choice = Math.random();

  // 1. Headband: ~200-degree half-torus arc (radius ~1.0, tube ~0.07), slightly flattened (28% of points)
  if (choice < 0.28) {
    const minAngle = -10 * (Math.PI / 180);
    const maxAngle = 190 * (Math.PI / 180);
    const theta = minAngle + Math.random() * (maxAngle - minAngle);

    const phi = Math.random() * Math.PI * 2;
    const rTube = 0.07 * Math.sqrt(Math.random());

    const R = 1.05;
    const x = (R + rTube * Math.cos(phi)) * Math.cos(theta);
    const y = (R + rTube * Math.cos(phi)) * Math.sin(theta) - 0.22;
    const z = rTube * Math.sin(phi) * 0.85; // slightly flattened in Z
    return [x, y, z];
  }

  // 2. Ear Cups: two flattened cylinders/capsules (radius ~0.38, depth ~0.22) at arc ends (54% of points)
  if (choice < 0.82) {
    const isLeft = Math.random() < 0.5;
    const sideSign = isLeft ? -1 : 1;
    const cupCenterX = sideSign * 1.02;
    const cupCenterY = -0.38;
    const cupCenterZ = 0.0;

    const subChoice = Math.random();

    if (subChoice < 0.12) {
      // Hinge connector connecting arc ends to cups
      const tHinge = Math.random();
      const hY = -0.18 - tHinge * 0.14;
      const phiH = Math.random() * Math.PI * 2;
      const rH = 0.045 * Math.sqrt(Math.random());
      const hX = cupCenterX + rH * Math.cos(phiH);
      const hZ = rH * Math.sin(phiH);
      return [hX, hY, hZ];
    } else if (subChoice < 0.55) {
      // Outer cup cylinder / casing: radius ~0.38, depth ~0.22
      const angle = Math.random() * Math.PI * 2;
      const rad = 0.38 * Math.sqrt(Math.random());
      const depth = (Math.random() - 0.5) * 0.22;
      const x = cupCenterX + depth;
      const y = cupCenterY + rad * Math.sin(angle);
      const z = cupCenterZ + rad * Math.cos(angle);
      return [x, y, z];
    } else {
      // Cushion ring: torus (radius ~0.30, tube ~0.08) on inner face
      const angle = Math.random() * Math.PI * 2;
      const phiC = Math.random() * Math.PI * 2;
      const rRing = 0.30;
      const tRing = 0.08 * Math.sqrt(Math.random());

      const innerOffset = sideSign * -0.06;
      const x = cupCenterX + innerOffset + tRing * Math.cos(phiC);
      const y = cupCenterY + (rRing + tRing * Math.sin(phiC)) * Math.sin(angle);
      const z = cupCenterZ + (rRing + tRing * Math.sin(phiC)) * Math.cos(angle);
      return [x, y, z];
    }
  }

  // 3. Microphone boom: thin curved tube (quadratic bezier) ending in small capsule (18% of points)
  {
    const sub = Math.random();
    if (sub < 0.65) {
      // Curved boom tube
      const u = Math.random();
      const p0 = [-1.02, -0.48, 0.05];
      const p1 = [-0.68, -0.65, 0.45];
      const p2 = [-0.22, -0.52, 0.78];

      const invU = 1.0 - u;
      const bx = invU * invU * p0[0] + 2 * invU * u * p1[0] + u * u * p2[0];
      const by = invU * invU * p0[1] + 2 * invU * u * p1[1] + u * u * p2[1];
      const bz = invU * invU * p0[2] + 2 * invU * u * p1[2] + u * u * p2[2];

      const phiB = Math.random() * Math.PI * 2;
      const rB = 0.035 * Math.sqrt(Math.random());
      return [bx + rB * Math.cos(phiB), by + rB * Math.sin(phiB), bz + (Math.random() - 0.5) * 0.03];
    } else {
      // Microphone tip capsule: radius ~0.07, length ~0.16 at (-0.22, -0.52, 0.78)
      const tipCenter = [-0.22, -0.52, 0.78];
      const tipAngle = Math.random() * Math.PI * 2;
      const tipRad = 0.07 * Math.sqrt(Math.random());
      const tipLen = (Math.random() - 0.5) * 0.16;

      const dirX = 0.75;
      const dirY = 0.15;
      const dirZ = 0.64;

      const x = tipCenter[0] + dirX * tipLen + tipRad * Math.cos(tipAngle) * 0.6;
      const y = tipCenter[1] + dirY * tipLen + tipRad * Math.sin(tipAngle);
      const z = tipCenter[2] + dirZ * tipLen + tipRad * Math.cos(tipAngle) * 0.8;
      return [x, y, z];
    }
  }
}

export function generateParticleBuffers(count) {
  const positionA = new Float32Array(count * 3);
  const positionB = new Float32Array(count * 3);
  const positionC = new Float32Array(count * 3);
  const positionD = new Float32Array(count * 3);
  const positionE = new Float32Array(count * 3);
  const aSeed = new Float32Array(count);
  const aSize = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const seed = Math.random();
    aSeed[i] = seed;
    aSize[i] = Math.random() * 0.7 + 0.65;

    // -------------------------------------------------------------
    // SHAPE 0, 1, 2: Customer Care Headset
    // -------------------------------------------------------------
    const [hx, hy, hz] = sampleHeadsetPoint();
    positionA[i3] = hx;
    positionA[i3 + 1] = hy;
    positionA[i3 + 2] = hz;

    positionB[i3] = hx;
    positionB[i3 + 1] = hy;
    positionB[i3 + 2] = hz;

    positionC[i3] = hx;
    positionC[i3 + 1] = hy;
    positionC[i3 + 2] = hz;

    // -------------------------------------------------------------
    // SHAPE 3: Phone Handset
    // -------------------------------------------------------------
    const part3 = Math.random();
    if (part3 < 0.45) {
      // Ergonomic connecting bridge
      const yBridge = (Math.random() * 2.0 - 1.0) * 1.05;
      const xBridge = Math.cos(yBridge * 1.2) * 0.3 - 0.15;
      const phiBridge = Math.random() * Math.PI * 2;
      const rBridge = 0.22 + (Math.random() - 0.5) * 0.06;
      positionD[i3] = xBridge + rBridge * Math.cos(phiBridge);
      positionD[i3 + 1] = yBridge;
      positionD[i3 + 2] = rBridge * Math.sin(phiBridge);
    } else if (part3 < 0.725) {
      // Top earpiece bell
      const uSphere = Math.random() * Math.PI * 2;
      const vSphere = Math.random() * Math.PI;
      const rSphere = 0.52 + (Math.random() - 0.5) * 0.08;
      positionD[i3] = rSphere * Math.sin(vSphere) * Math.cos(uSphere) + 0.1;
      positionD[i3 + 1] = rSphere * Math.cos(vSphere) * 0.75 + 1.25;
      positionD[i3 + 2] = rSphere * Math.sin(vSphere) * Math.sin(uSphere) + 0.25;
    } else {
      // Bottom mouthpiece bell
      const uSphere = Math.random() * Math.PI * 2;
      const vSphere = Math.random() * Math.PI;
      const rSphere = 0.52 + (Math.random() - 0.5) * 0.08;
      positionD[i3] = rSphere * Math.sin(vSphere) * Math.cos(uSphere) + 0.1;
      positionD[i3 + 1] = rSphere * Math.cos(vSphere) * 0.75 - 1.25;
      positionD[i3 + 2] = rSphere * Math.sin(vSphere) * Math.sin(uSphere) + 0.25;
    }

    // -------------------------------------------------------------
    // SHAPE 4: Chat Speech Bubble
    // -------------------------------------------------------------
    const part4 = Math.random();
    if (part4 < 0.84) {
      // Main rounded squircle bubble body
      const angle4 = Math.random() * Math.PI * 2;
      const rSquircle = Math.pow(Math.abs(Math.cos(angle4)), 4) + Math.pow(Math.abs(Math.sin(angle4)), 4);
      const rad4 = Math.pow(rSquircle, -0.25);
      const radScale = Math.sqrt(Math.random());
      const w4 = 1.7 * Math.cos(angle4) * rad4 * radScale;
      const h4 = 1.15 * Math.sin(angle4) * rad4 * radScale;
      const z4 = (Math.random() - 0.5) * 0.45;
      positionE[i3] = w4;
      positionE[i3 + 1] = h4 + 0.15;
      positionE[i3 + 2] = z4;
    } else {
      // Speech pointer tail (pointing down-left)
      const tTail = Math.random();
      const xTail = -0.7 - tTail * 0.65;
      const yTail = -0.85 - tTail * 0.65;
      const zTail = (Math.random() - 0.5) * 0.25;
      positionE[i3] = xTail;
      positionE[i3 + 1] = yTail;
      positionE[i3 + 2] = zTail;
    }
  }

  return {
    positionA,
    positionB,
    positionC,
    positionD,
    positionE,
    aSeed,
    aSize,
  };
}
