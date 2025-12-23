import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'; 

const TrainingSim = () => {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("Initializing Weights...");
  const [epoch, setEpoch] = useState(0);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    // --- 1. SETUP ---
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- 2. PARAMS & GUI ---
    const params = {
      learningRate: 0.3,
      noise: 0.5,
      autoTrain: true,
      progress: 0,
      reset: () => { params.progress = 0; }
    };

    const gui = new GUI({ width: 300 });
    const folder = gui.addFolder('Hyperparameters (The Controls)');
    folder.add(params, 'learningRate', 0.01, 2.0).name('Learning Speed');
    folder.add(params, 'noise', 0, 2.0).name('Distractions (Noise)');
    
    // We keep a reference to this controller so we can update the slider visually
    const progressController = folder.add(params, 'progress', 0, 1).name('Epoch (Timeline)').listen();
    
    folder.add(params, 'autoTrain').name('Auto-Study Mode');
    folder.add(params, 'reset').name('Restart Class');
    folder.open();

    gui.domElement.style.position = 'absolute';
    gui.domElement.style.top = '10px';
    gui.domElement.style.right = '10px';

    // --- 3. TEXTURE ---
    const getCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    };

    // --- 4. DATA ---
    const particleCount = 3000;
    const startPositions = new Float32Array(particleCount * 3);
    const endPositions = new Float32Array(particleCount * 3);
    const currentPositions = new Float32Array(particleCount * 3);

    const centers = [
      new THREE.Vector3(10, 5, 0),
      new THREE.Vector3(-10, 5, 0),
      new THREE.Vector3(0, -10, 0),
      new THREE.Vector3(0, 0, 10) 
    ];

    for (let i = 0; i < particleCount; i++) {
      startPositions[i * 3] = (Math.random() - 0.5) * 60;
      startPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      startPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      const center = centers[Math.floor(Math.random() * centers.length)];
      endPositions[i * 3] = center.x + (Math.random() - 0.5) * 8;
      endPositions[i * 3 + 1] = center.y + (Math.random() - 0.5) * 8;
      endPositions[i * 3 + 2] = center.z + (Math.random() - 0.5) * 8;

      currentPositions[i * 3] = startPositions[i * 3];
      currentPositions[i * 3 + 1] = startPositions[i * 3 + 1];
      currentPositions[i * 3 + 2] = startPositions[i * 3 + 2];
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xff0000,
      size: 0.5,
      map: getCircleTexture(),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // --- 5. ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let animationFrameId;
    const colorStart = new THREE.Color(0xff0055); 
    const colorEnd = new THREE.Color(0x00ffff);   

    const animate = () => {
      const dt = clock.getDelta();

      if (params.autoTrain) {
        if (params.progress < 1) {
          params.progress += dt * params.learningRate;
        } else if (params.progress > 1.5) {
          params.progress = 0;
        } else {
          params.progress += dt * 0.5; 
        }
      }

      const t = Math.min(Math.max(params.progress, 0), 1);
      const ease = 1 - Math.pow(1 - t, 3); 

      if (t < 0.1) setStatus("Phase 1: Confusion (Random Noise)");
      else if (t < 0.8) setStatus("Phase 2: Learning (finding patterns...)");
      else setStatus("Phase 3: Understanding (Convergence)");
      
      setEpoch(Math.floor(t * 100));

      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;

        const targetX = startPositions[ix] + (endPositions[ix] - startPositions[ix]) * ease;
        const targetY = startPositions[iy] + (endPositions[iy] - startPositions[iy]) * ease;
        const targetZ = startPositions[iz] + (endPositions[iz] - startPositions[iz]) * ease;

        const currentNoise = (1 - t) * params.noise; 
        
        positions[ix] = targetX + (Math.random() - 0.5) * currentNoise;
        positions[iy] = targetY + (Math.random() - 0.5) * currentNoise;
        positions[iz] = targetZ + (Math.random() - 0.5) * currentNoise;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      material.color.copy(colorStart).lerp(colorEnd, ease);
      particles.rotation.y = clock.getElapsedTime() * 0.05;

      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      currentMount.removeChild(renderer.domElement);
      gui.destroy();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#050505', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      
      {/* 3D CANVAS */}
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

      {/* OVERLAY UI - Changed position slightly to fit inside a window better */}
      <div style={{
        position: 'absolute',
        bottom: '20px', // Moved up slightly
        left: '20px',   // Moved in slightly
        color: 'white',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 5
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>
          TRAINING DYNAMICS
        </h1>
        <div style={{ marginTop: '20px', fontSize: '1.2rem', color: '#00ffff' }}>
          {status}
        </div>
        <div style={{ fontSize: '1rem', opacity: 0.6 }}>
          EPOCH: {epoch} / 100
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{
            marginTop: '20px',
            pointerEvents: 'auto',
            background: 'rgba(0, 255, 255, 0.1)',
            border: '1px solid #00ffff',
            color: '#00ffff',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = 'rgba(0, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(0, 255, 255, 0.1)'}
        >
          Wait, what is this?
        </button>
      </div>

      {/* STORY MODAL */}
      {showModal && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10,
          padding: '20px'
        }}>
          <div style={{
            background: '#111',
            borderRadius: '10px',
            maxWidth: '600px',
            width: '100%',
            color: '#eee',
            border: '1px solid #333',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #333' }}>
               <h2 style={{ margin: 0, color: '#00ffff' }}>A Visual Story of Learning</h2>
            </div>

            {/* Scrollable Content */}
            <div style={{ 
              padding: '20px', 
              overflowY: 'auto', 
              lineHeight: '1.6', 
              flex: 1,       
              minHeight: 0   
            }}>
              
              <p style={{ fontSize: '1.1rem', marginTop: 0 }}>
                Imagine you are trying to teach a child to sort Lego bricks by color.
              </p>

              <h3 style={{ color: '#ff0055', marginTop: '5px' }}>1. The Chaos (Epoch 0)</h3>
              <p>
                At the very beginning, the child (the AI) knows nothing. They just throw the Legos everywhere. 
                That is what you see when the simulation starts: <strong>Red Chaos</strong>. In AI, we call this "Random Initialization."
              </p>

              <h3 style={{ color: '#00aaff', marginTop: '5px' }}>2. The Lesson (The Process)</h3>
              <p>
                As time passes, you (the teacher) tell them "No, red goes here, blue goes there." 
                The AI slowly moves the pieces into piles. This movement is called <strong>Gradient Descent</strong>.
                Eventually, the pieces form neat, separate piles. This is <strong>Convergence</strong>.
              </p>

              <h3 style={{ color: '#00ffff', marginTop: '5px' }}>3. Your Turn: Try the Controls</h3>
              <ul style={{ background: '#222', padding: '5px 10px', borderRadius: '8px' }}>
                <li style={{ marginBottom: '5px' }}>
                  <strong>Learning Speed:</strong> This is how fast the child moves the bricks. 
                  <br/><em>Try dragging it to 2.0 (Max).</em> The bricks will fly around wildly! If you learn too fast, you make mistakes.
                </li>
                <li style={{ marginBottom: '5px' }}>
                  <strong>Distractions (Noise):</strong> This is how shaky their hands are. 
                  <br/><em>Try dragging it up.</em> A little shaking is actually good because it stops them from getting stuck in the wrong spot!
                </li>
                <li>
                  <strong>Auto-Study Mode:</strong> This loops the lesson over and over.
                  <br/><em>Uncheck it</em> to pause the lesson and drag the "Epoch" slider yourself to scrub through time like a video!
                </li>
              </ul>

              <h3 style={{ marginTop: '0px' }}>Why does this matter?</h3>
              <p>
                This isn't just a pretty animation. This is exactly how <strong>Gemini, ChatGPT, and Claude</strong> were built. 
                They started as random noise. Over months of training (trillions of adjustments), they "converged" into the smart assistants you use today.
              </p>

              <button 
                onClick={() => setShowModal(false)}
                style={{
                  background: '#00ffff',
                  color: '#000',
                  border: 'none',
                  padding: '5px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}
              >
                Okay, I'll try the slider!
              </button>

            </div>

      
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingSim;