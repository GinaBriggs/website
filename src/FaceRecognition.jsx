import React, { useState } from 'react';
import { FileCode, Eye, Terminal, Cpu, Layers } from 'lucide-react';

const FaceRecognition = () => {
  const [activeTab, setActiveTab] = useState('code');

  // Your Python code string
  const pythonCode = `
from faceRecognition import faceRecognizer
import cv2
import os
import time

DATASET_PATH = "dataset" 
facesDetected = []

def startSystem():
    print("\n--- Group 2 Facial Recognition System ---")
    # Updated Menu
    print("1: Register New Face (Snapshot)")
    print("2: LIVE Webcam Recognition (New!)") 
    print("3: Test Static Images")
    print("4: Exit")
    
    try:
        userType = int(input("Selection: "))
    except ValueError:
        print("Invalid input.")
        startSystem()
        return

    if userType == 1:
        dataCollection()
        startSystem()
    elif userType == 2:
        realTimeRecognition() 
        startSystem()
    elif userType == 3:
        testing()
        startSystem()
    elif userType == 4:
        exit()
    else:
        print("Invalid Input!\n")
        startSystem()

def dataCollection():
    imageCap = cv2.VideoCapture(0)
    # Use a robust path for the XML file
    faceDetection = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    label = input("Enter Username: ").strip()
    if not label:
        print("Invalid Username!")
        return

    # FIXED: Use the global DATASET_PATH
    if not os.path.exists(DATASET_PATH):
        os.makedirs(DATASET_PATH)

    # Use os.path.join for Windows/Mac compatibility
    imagePath = os.path.join(DATASET_PATH, f"{label}.jpg")

    print(f"Collecting image for {label}. Please look into the camera.")
    time.sleep(2) # Short pause to get ready

    ret, frame = imageCap.read()
    if not ret:
        print("Error: Could not capture image.")
        return

    # Detect faces
    faces = faceDetection.detectMultiScale(frame, 1.3, 5)

    if len(faces) == 0:
        print("No face detected. Try again with better lighting.")
        imageCap.release()
        cv2.destroyAllWindows()
        return    
    else:
        for x, y, w, h in faces:
            # Draw rectangle (optional visual)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 0), 3)
            cv2.imshow('Captured Face', frame)
            
            # Save the file to the DATASET folder
            cv2.imwrite(imagePath, frame[y:y + h, x:x + w]) 
            print(f"Success! Image saved to: {imagePath}")
            
            facesDetected.append(imagePath)
            
            print("Press any key to close the camera window...")
            cv2.waitKey(0)
            imageCap.release()
            cv2.destroyAllWindows()
            
            faceVerification()
            return

def realTimeRecognition():
    print("\n--- Starting Live Recognition (Press 'q' to exit) ---")
    
    # 1. Load the database ONCE before the camera starts
    faceRec = faceRecognizer()
    dataset_path = "dataset" # Make sure this folder exists and has images!
    
    if not os.path.exists(dataset_path):
        print(f"Error: '{dataset_path}' folder not found. Please register a face first.")
        return

    faceRec.load_encoding_images(dataset_path)

    # 2. Start the Webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not access the camera.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # 3. Use the function already written in faceRecognition.py
        # It returns the locations (coordinates) and names of found faces
        face_locations, face_names = faceRec.detect_known_faces(frame)

        # 4. Draw boxes and names on the video
        for (y1, x2, y2, x1), name in zip(face_locations, face_names):
            # Draw the box
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 0), 2)
            
            # Draw the name tag
            cv2.rectangle(frame, (x1, y2 - 35), (x2, y2), (0, 200, 0), cv2.FILLED)
            cv2.putText(frame, name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)

        cv2.imshow('Live Face Recognition', frame)

        # Press 'q' on the keyboard to exit the loop
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    
def faceVerification():
    print("\n--- Verifying ---")
    faceRec = faceRecognizer() 
    
  
    faceRec.load_encoding_images(DATASET_PATH)

    # Check the faces we just detected
    for image_path in facesDetected:
        print(f"Checking image: {image_path}")
        faceRec.compare_faces(image_path)

def testing():
    print("\n--- Testing Mode ---")
    faceRec = faceRecognizer() 
    faceRec.load_encoding_images(DATASET_PATH)

    folder_path = "testImages"
    if not os.path.exists(folder_path):
        print(f"Folder '{folder_path}' not found. Please create it and add photos.")
        return

    # List all files
    files_only = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]

    if not files_only:
        print("No images found in testImages folder.")

    for file_name in files_only:
        full_path = os.path.join(folder_path, file_name)
        print(f"Testing: {file_name}")
        faceRec.compare_faces(full_path)

if __name__ == "__main__":
    startSystem()
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