import * as THREE from 'three';
import { generateParticleBuffers } from './particleWorker';

// In-memory cache for fast hot-reload and route switching
let memoryCachedBuffers = null;
let memoryCachedMaxCount = 0;

/**
 * Creates or retrieves the morph target BufferGeometry for the particle system.
 * Tries Web Worker first with transferable ArrayBuffers; falls back synchronously.
 */
export async function getParticleGeometry(maxCount = 60000) {
  if (memoryCachedBuffers && memoryCachedMaxCount >= maxCount) {
    return createBufferGeometryFromBuffers(memoryCachedBuffers, maxCount);
  }

  // Attempt Web Worker sampling
  try {
    if (typeof window !== 'undefined' && window.Worker) {
      const workerBuffers = await new Promise((resolve, reject) => {
        const worker = new Worker(
          new URL('./particleWorker.js', import.meta.url),
          { type: 'module' }
        );
        const timeout = setTimeout(() => {
          worker.terminate();
          reject(new Error('Worker sampling timeout'));
        }, 1500);

        worker.onmessage = (e) => {
          clearTimeout(timeout);
          worker.terminate();
          resolve(e.data);
        };
        worker.onerror = (err) => {
          clearTimeout(timeout);
          worker.terminate();
          reject(err);
        };
        worker.postMessage({ maxCount });
      });

      if (workerBuffers && workerBuffers.positionA) {
        memoryCachedBuffers = workerBuffers;
        memoryCachedMaxCount = maxCount;
        return createBufferGeometryFromBuffers(workerBuffers, maxCount);
      }
    }
  } catch (err) {
    console.warn('[ParticleGeometry] Worker sampling fallback to synchronous generation:', err.message);
  }

  // Synchronous generation fallback
  const directBuffers = generateParticleBuffers(maxCount);
  memoryCachedBuffers = directBuffers;
  memoryCachedMaxCount = maxCount;
  return createBufferGeometryFromBuffers(directBuffers, maxCount);
}

function createBufferGeometryFromBuffers(buffers, count) {
  const geometry = new THREE.BufferGeometry();

  // Primary position buffer initialized to Shape 0 (positionA)
  geometry.setAttribute('position', new THREE.BufferAttribute(buffers.positionA, 3));
  
  // Morph targets (Shapes 0 to 4)
  geometry.setAttribute('positionA', new THREE.BufferAttribute(buffers.positionA, 3));
  geometry.setAttribute('positionB', new THREE.BufferAttribute(buffers.positionB, 3));
  geometry.setAttribute('positionC', new THREE.BufferAttribute(buffers.positionC, 3));
  geometry.setAttribute('positionD', new THREE.BufferAttribute(buffers.positionD, 3));
  geometry.setAttribute('positionE', new THREE.BufferAttribute(buffers.positionE, 3));

  // Per-particle seed and size
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(buffers.aSeed, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(buffers.aSize, 1));

  // Set draw range to initial count
  geometry.setDrawRange(0, count);

  return geometry;
}
