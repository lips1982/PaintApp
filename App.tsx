import React, { useState } from 'react';
import { Tool, CanvasSize, UserProfile } from './types';
import { useCanvas } from './hooks/useCanvas';
import { Toolbar } from './components/Toolbar';
import { CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const App: React.FC = () => {
  const [tool, setTool] = useState<Tool>(Tool.BRUSH);
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(5);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>('FIT_SCREEN');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [zoom, setZoom] = useState(1);

  const { canvasRef, clearCanvas, downloadCanvas } = useCanvas({
    tool,
    color,
    brushSize,
    canvasSize,
    zoom,
  });

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decoded: { name: string, email: string, picture: string } = jwtDecode(credentialResponse.credential);
      setUser({ name: decoded.name, email: decoded.email, picture: decoded.picture });
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const MAX_ZOOM = 5;
  const MIN_ZOOM = 0.1;
  const ZOOM_STEP = 0.1;

  const handleZoomIn = () => {
      setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  }

  const handleZoomOut = () => {
      setZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  }

  const handleResetZoom = () => {
      setZoom(1);
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-24 p-4 box-border">
      <Toolbar
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
        downloadCanvas={downloadCanvas}
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
        user={user}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleResetZoom}
      />
      <main className="w-full flex-grow flex items-center justify-center overflow-auto">
         <canvas
            ref={canvasRef}
            className="bg-white rounded-lg shadow-2xl cursor-crosshair"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
         />
      </main>
    </div>
  );
};

export default App;