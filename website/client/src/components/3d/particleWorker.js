/**
 * Web Worker for Procedurally Pre-sampling the 5 Morph Targets:
 * Shape 0: Noisy Organic Mass (Hero)
 * Shape 1: Que Infinity / Ligature Loop (Lemniscate Tube)
 * Shape 2: Customer Care Headset
 * Shape 3: Phone Handset
 * Shape 4: Chat Speech Bubble
 */

self.onmessage = function (e) {
  const { maxCount = 60000 } = e.data || {};
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
    // SHAPE 0: Noisy Organic Mass (Hero)
    // -------------------------------------------------------------
    const u0 = Math.random() * Math.PI * 2;
    const v0 = Math.random() * Math.PI * 2;
    const R0 = 2.15 + (Math.random() - 0.5) * 0.25;
    const r0 = 0.85 + (Math.random() - 0.5) * 0.35;
    const bump0 = Math.sin(u0 * 3.0 + v0 * 2.0) * 0.28 + Math.cos(u0 * 4.0 - v0) * 0.18;
    const effR0 = r0 + bump0;
    
    positionA[i3] = (R0 + effR0 * Math.cos(v0)) * Math.cos(u0);
    positionA[i3 + 1] = (R0 + effR0 * Math.cos(v0)) * Math.sin(u0) * 0.65 + Math.sin(u0 * 2.0) * 0.35;
    positionA[i3 + 2] = effR0 * Math.sin(v0) + Math.cos(u0) * 0.4;

    // -------------------------------------------------------------
    // SHAPE 1: Que Infinity / Ligature Loop (Lemniscate Tube)
    // -------------------------------------------------------------
    const t1 = Math.random() * Math.PI * 2;
    const phi1 = Math.random() * Math.PI * 2;
    const sinT1 = Math.sin(t1);
    const cosT1 = Math.cos(t1);
    const denom1 = 1 + sinT1 * sinT1;
    const scale1 = 2.6;
    
    const cx1 = (scale1 * cosT1) / denom1;
    const cz1 = (scale1 * sinT1 * cosT1) / denom1;
    const cy1 = 0.45 * Math.sin(t1 * 2.0);

    const tubeRadius1 = 0.35 + (Math.random() - 0.5) * 0.1;
    positionB[i3] = cx1 + tubeRadius1 * Math.cos(phi1);
    positionB[i3 + 1] = cy1 + tubeRadius1 * Math.sin(phi1);
    positionB[i3 + 2] = cz1 + tubeRadius1 * Math.sin(phi1 + t1) * 0.8;

    // -------------------------------------------------------------
    // SHAPE 2: Customer Support Headset
    // -------------------------------------------------------------
    const part2 = Math.random();
    if (part2 < 0.48) {
      // Arch headband (half-torus)
      const tArch = Math.random() * Math.PI; // 0 to PI
      const phiArch = Math.random() * Math.PI * 2;
      const archR = 1.65;
      const tubeR = 0.14;
      positionC[i3] = (archR + tubeR * Math.cos(phiArch)) * Math.cos(tArch);
      positionC[i3 + 1] = (archR + tubeR * Math.cos(phiArch)) * Math.sin(tArch) - 0.2;
      positionC[i3 + 2] = tubeR * Math.sin(phiArch);
    } else if (part2 < 0.72) {
      // Left earcup cylinder / pad
      const thetaCup = Math.random() * Math.PI * 2;
      const radCup = Math.sqrt(Math.random()) * 0.48;
      const hCup = (Math.random() - 0.5) * 0.35;
      positionC[i3] = -1.65 + hCup;
      positionC[i3 + 1] = -0.2 + radCup * Math.cos(thetaCup);
      positionC[i3 + 2] = radCup * Math.sin(thetaCup);
    } else if (part2 < 0.94) {
      // Right earcup cylinder / pad
      const thetaCup = Math.random() * Math.PI * 2;
      const radCup = Math.sqrt(Math.random()) * 0.48;
      const hCup = (Math.random() - 0.5) * 0.35;
      positionC[i3] = 1.65 + hCup;
      positionC[i3 + 1] = -0.2 + radCup * Math.cos(thetaCup);
      positionC[i3 + 2] = radCup * Math.sin(thetaCup);
    } else {
      // Mic boom arm extending forward towards mouth
      const tBoom = Math.random();
      const boomX = 1.6 - tBoom * 1.1;
      const boomY = -0.2 - tBoom * 0.6;
      const boomZ = tBoom * 1.1;
      const jBoom = (Math.random() - 0.5) * 0.08;
      positionC[i3] = boomX + jBoom;
      positionC[i3 + 1] = boomY + jBoom;
      positionC[i3 + 2] = boomZ + jBoom;
    }

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
