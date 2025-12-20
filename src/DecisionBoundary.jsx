import React, { useEffect, useRef, useState } from 'react';
import { HelpCircle, RefreshCw, Play, Pause, Trash2 } from 'lucide-react';

// --- 1. THE BRAIN (Vanilla JS Neural Network) ---
// This runs entirely in the browser. No Python, no servers.
class TinyNN {
  constructor() {
    this.w1 = Array(6).fill(0).map(() => [Math.random()-0.5, Math.random()-0.5]);
    this.b1 = Array(6).fill(0).map(() => Math.random()-0.5);
    this.w2 = Array(6).fill(0).map(() => Math.random()-0.5);
    this.b2 = Math.random()-0.5;
    this.lr = 0.1; 
  }

  sigmoid(x) { return 1 / (1 + Math.exp(-x)); }
  tanh(x) { return Math.tanh(x); }
  dtanh(y) { return 1 - y * y; } 

  forward(inputs) {
    this.hidden = [];
    for(let i=0; i<6; i++) {
      let sum = this.b1[i] + inputs[0]*this.w1[i][0] + inputs[1]*this.w1[i][1];
      this.hidden[i] = this.tanh(sum);
    }
    let sum = this.b2;
    for(let i=0; i<6; i++) {
      sum += this.hidden[i] * this.w2[i];
    }
    return this.sigmoid(sum);
  }

  train(inputs, target) {
    let prediction = this.forward(inputs);
    let error = target - prediction;
    let d_output = error * prediction * (1 - prediction); 

    for(let i=0; i<6; i++) {
      let change = d_output * this.hidden[i] * this.lr;
      this.w2[i] += change;
      let d_hidden = d_output * this.w2[i] * this.dtanh(this.hidden[i]);
      this.w1[i][0] += d_hidden * inputs[0] * this.lr;
      this.w1[i][1] += d_hidden * inputs[1] * this.lr;
      this.b1[i] += d_hidden * this.lr;
    }
    this.b2 += d_output * this.lr;
  }
  
  reset() {
     this.w1 = Array(6).fill(0).map(() => [Math.random()-0.5, Math.random()-0.5]);
     this.b1 = Array(6).fill(0).map(() => Math.random()-0.5);
     this.w2 = Array(6).fill(0).map(() => Math.random()-0.5);
     this.b2 = Math.random()-0.5;
  }
}

// --- 2. THE REACT COMPONENT ---
const DecisionBoundary = () => {
  const canvasRef = useRef(null);
  const [nn] = useState(new TinyNN()); 
  const [points, setPoints] = useState([]);
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [showModal, setShowModal] = useState(false); // Helper Modal State

  // Add points
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; 
    const y = (e.clientY - rect.top) / rect.height; 
    const label = e.button === 2 ? 1 : 0; // Right click = Blue (1), Left = Red (0)
    setPoints(prev => [...prev, { x, y, label }]);
  };

  const handleReset = () => {
    setPoints([]);
    setEpoch(0);
    nn.reset();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    let animationId;

    const loop = () => {
      // Train (10 steps per frame for speed)
      if (isTraining && points.length > 0) {
        for(let i=0; i<20; i++) {
           const p = points[Math.floor(Math.random() * points.length)];
           nn.train([p.x, p.y], p.label);
        }
        setEpoch(e => e + 1);
      }

      // Draw Background (The Decision Boundary)
      const resolution = 40; // Lower resolution = faster performance
      const cellW = width / resolution;
      const cellH = height / resolution;

      for(let i=0; i<resolution; i++) {
        for(let j=0; j<resolution; j++) {
          const x = i / resolution;
          const y = j / resolution;
          const pred = nn.forward([x, y]);
          
          // Color Interpolation
          const r = Math.floor(255 * (1 - pred)); // Red
          const b = Math.floor(255 * pred);       // Blue
          ctx.fillStyle = `rgba(${r}, 0, ${b}, 0.25)`; 
          ctx.fillRect(i * cellW, j * cellH, cellW+1, cellH+1);
        }
      }

      // Draw User Points
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, 6, 0, Math.PI * 2);
        ctx.fillStyle = p.label === 0 ? '#ff0055' : '#00aaff';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
      });

      animationId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationId);
  }, [points, isTraining, nn]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-white font-sans select-none relative">
      
      {/* --- HEADER --- */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
            Interactive Classifier
            <button 
               onClick={() => setShowModal(true)}
               className="text-gray-400 hover:text-white transition-colors"
            >
              <HelpCircle size={18} />
            </button>
          </h2>
          <p className="text-xs text-gray-400">
            Left Click: <span className="text-red-500 font-bold">Red Class</span> • 
            Right Click: <span className="text-blue-400 font-bold">Blue Class</span>
          </p>
        </div>
        <div className="text-right">
           <div className="text-xs text-gray-500 uppercase">Training Age</div>
           <div className="font-mono text-xl">{epoch} epochs</div>
        </div>
      </div>

      {/* --- CANVAS AREA --- */}
      <div className="flex-1 relative cursor-crosshair overflow-hidden">
        <canvas 
          ref={canvasRef}
          width={800} // Internal resolution
          height={600}
          onMouseDown={handleCanvasClick}
          onContextMenu={(e) => e.preventDefault()} 
          className="w-full h-full object-cover block"
        />
        
        {/* Empty State Overlay */}
        {points.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/80 px-6 py-4 rounded-lg text-center backdrop-blur-sm border border-gray-700">
              <p className="text-gray-300 font-medium">The AI brain is empty.</p>
              <p className="text-sm text-gray-500 mt-1">Click anywhere to add Red or Blue dots.</p>
            </div>
          </div>
        )}
      </div>

      {/* --- CONTROLS FOOTER --- */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-center gap-4 shrink-0">
        <button 
          onClick={() => setIsTraining(!isTraining)}
          className={`flex items-center gap-2 px-6 py-2 rounded font-bold transition-all shadow-lg ${
            isTraining 
              ? 'bg-yellow-500 hover:bg-yellow-400 text-black' 
              : 'bg-green-600 hover:bg-green-500 text-white'
          }`}
        >
          {isTraining ? <Pause size={18} /> : <Play size={18} />}
          {isTraining ? 'Pause Training' : 'Start Training'}
        </button>

        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded border border-gray-600 hover:bg-gray-700 text-gray-300 transition-all"
        >
          <Trash2 size={18} />
          Reset
        </button>
      </div>

      {/* --- EDUCATIONAL MODAL --- */}
      {showModal && (
        <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-gray-800 max-w-lg w-full rounded-xl border border-gray-700 shadow-2xl overflow-hidden flex flex-col max-h-[90%]">
            
            <div className="p-6 border-b border-gray-700 bg-gray-900">
              <h2 className="text-xl font-bold text-cyan-400">Teaching a Robot to "See"</h2>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 text-gray-300 leading-relaxed custom-scrollbar">
              
              {/* 1. The Analogy */}
              <div>
                <p className="mb-2">
                  Imagine this AI is a student trying to color-code a map. 
                  It needs to figure out which parts belong to the <span className="text-red-400 font-bold">Red Team</span> and which belong to the <span className="text-blue-400 font-bold">Blue Team</span>.
                </p>
              </div>

              {/* 2. The "What is an Epoch" Card */}
              <div className="bg-gray-700/30 p-4 rounded-lg border-l-4 border-cyan-500">
                <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                  📚 What is an "Epoch"?
                </h3>
                <p className="text-sm mb-3">
                  In simple terms, an epoch is one complete study session.
                </p>
                <ul className="space-y-2 text-sm bg-gray-900/50 p-3 rounded">
                  <li>
                    <strong>The Analogy:</strong> Imagine reading a textbook before a test. Reading the whole book <em>once</em> is 1 Epoch.
                  </li>
                  <li>
                    <strong>The Training:</strong> To learn well, you need to read the book multiple times. That's why the Epoch counter goes up!
                  </li>
                  <li>
                    <strong>Overfitting:</strong> Be careful—if you read the book 10,000 times, you might just memorize the sentences instead of understanding the concepts.
                  </li>
                </ul>
              </div>

              {/* 3. Instructions */}
              <div className="space-y-3">
                <h3 className="font-bold text-white">How to use this:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
                  <li><strong>Click anywhere</strong> to place a Red dot.</li>
                  <li><strong>Right-click</strong> (or hold shift+click) to place a Blue dot.</li>
                  <li><strong>Hit "Start Training"</strong> to start the study session.</li>
                </ul>
              </div>

              {/* 4. Visuals */}
              <div>
                <h3 className="font-bold text-white mb-1">What am I seeing?</h3>
                <p className="text-sm text-gray-400">
                  The background color is the AI's "Decision Boundary." 
                  Purple areas mean the AI is confused. Sharp lines between Red and Blue mean the AI is confident!
                </p>
              </div>

            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-900 text-right">
              <button 
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold transition-colors shadow-lg"
              >
                Got it, let's train!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DecisionBoundary;