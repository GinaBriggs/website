import React, { useState } from 'react';
import { FileCode, Eye, Terminal, Cpu, Layers } from 'lucide-react';

const FaceRecognition = () => {
  const [activeTab, setActiveTab] = useState('code');

  // Your Python code string
  const pythonCode = `
import face_recognition
import cv2
import os
import glob
import numpy as np

class FaceRecognizer:
    def __init__(self):
        self.known_face_encodings = []
        self.known_names = []
        self.frame_resizing = 0.25

    def detect_known_faces(self, frame):
        # 1. Resize for speed (0.25x)
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        # 2. Find Faces & Encodings
        face_locs = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locs)

        names = []
        for encoding in face_encodings:
            # 3. Compare with known faces (Euclidean Distance)
            matches = face_recognition.compare_faces(self.known_face_encodings, encoding)
            face_distances = face_recognition.face_distance(self.known_face_encodings, encoding)
            
            best_match = np.argmin(face_distances)
            name = "Unknown"
            if matches[best_match]:
                name = self.known_names[best_match]
            
            names.append(name)
        
        return face_locs, names
`;

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-gray-300 font-mono text-sm">
      
      {/* TOOLBAR */}
      <div className="flex items-center bg-[#252526] border-b border-[#333] px-4 py-2 select-none">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="ml-4 flex space-x-1">
          <button 
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded flex items-center gap-2 transition-colors ${activeTab === 'code' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e]'}`}
          >
            <FileCode size={14} className="text-blue-400" /> main.py
          </button>
          <button 
            onClick={() => setActiveTab('demo')}
            className={`px-3 py-1 rounded flex items-center gap-2 transition-colors ${activeTab === 'demo' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e]'}`}
          >
            <Eye size={14} className="text-green-400" /> Architecture
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 overflow-auto custom-scrollbar relative">
        
        {/* TAB 1: CODE VIEW */}
        {activeTab === 'code' && (
          <div className="p-4 leading-relaxed">
            <pre className="font-mono text-xs md:text-sm">
              <code>
                {pythonCode.split('\n').map((line, i) => (
                  <div key={i} className="table-row">
                    <span className="table-cell text-gray-600 select-none pr-4 text-right w-8">{i + 1}</span>
                    <span className="table-cell whitespace-pre-wrap">
                      {/* Simple Syntax Highlighting Simulation */}
                      {line.includes('def ') || line.includes('class ') ? <span className="text-purple-400">{line}</span> :
                       line.includes('import ') ? <span className="text-pink-400">{line}</span> :
                       line.includes('#') ? <span className="text-green-600">{line}</span> :
                       line.includes('self') ? <span className="text-blue-400">{line}</span> :
                       <span className="text-gray-300">{line}</span>}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}

        {/* TAB 2: ARCHITECTURE & EXPLANATION */}
        {activeTab === 'demo' && (
          <div className="p-8 max-w-3xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-3">
                <Cpu className="text-blue-500" /> Computer Vision Pipeline
              </h2>
              <p className="text-gray-400">How this Python script recognizes faces</p>
            </div>

            {/* Steps */}
            <div className="grid gap-6">
              
              {/* Step 1 */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                  <Layers size={16} /> 1. Face Detection (HOG)
                </h3>
                <p className="text-gray-400 text-sm">
                  We use a <strong>Histogram of Oriented Gradients (HOG)</strong> method to find face locations. 
                  Unlike deep learning detectors, this runs efficiently on CPU by looking for gradients of light/dark pixels that form face shapes.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border-l-4 border-blue-500">
                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                  <Terminal size={16} /> 2. 128-D Encoding
                </h3>
                <p className="text-gray-400 text-sm">
                  Once a face is found, we pass it through a ResNet deep neural network. 
                  This converts the face pixels into a list of <strong>128 numbers (an embedding)</strong>. 
                  Faces of the same person will have very similar numbers.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#2d2d2d] p-4 rounded-lg border-l-4 border-green-500">
                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                  <Eye size={16} /> 3. Classification (Euclidean Distance)
                </h3>
                <p className="text-gray-400 text-sm">
                  We compare the 128 numbers of the live webcam face against our known database. 
                  We calculate the geometric distance. If the distance is &lt; 0.6, it's a match!
                </p>
              </div>

            </div>

            {/* Note on Python */}
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded text-sm text-blue-200">
              <strong>Note:</strong> This project is built in <strong>Python</strong> using the <code>face_recognition</code> and <code>OpenCV</code> libraries. 
              Because browsers run JavaScript, this live demo shows the <em>source code</em> and <em>logic</em> rather than executing the Python backend directly.
            </div>

          </div>
        )}
      </div>

      {/* FOOTER STATUS BAR */}
      <div className="bg-[#007acc] text-white px-3 py-1 text-xs flex justify-between items-center">
        <div className="flex gap-4">
          <span>main.py</span>
          <span>Python 3.9</span>
        </div>
        <div className="flex gap-4">
          <span>Ln 42, Col 15</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default FaceRecognition;