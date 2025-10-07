import React from 'react';
import { Tool, CanvasSize, UserProfile } from '../types';
import { IconButton } from './IconButton';
import { BrushIcon, EraserIcon, TrashIcon, DownloadIcon, ZoomInIcon, ZoomOutIcon } from './icons';
import { ColorPicker } from './ColorPicker';
import { BrushSizeSlider } from './BrushSizeSlider';
import { CanvasSizeSelector } from './CanvasSizeSelector';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { UserProfile as UserProfileComponent } from './UserProfile';


interface ToolbarProps {
  tool: Tool;
  setTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  clearCanvas: () => void;
  downloadCanvas: () => void;
  canvasSize: CanvasSize;
  setCanvasSize: (size: CanvasSize) => void;
  user: UserProfile | null;
  onLoginSuccess: (credentialResponse: CredentialResponse) => void;
  onLogout: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  clearCanvas,
  downloadCanvas,
  canvasSize,
  setCanvasSize,
  user,
  onLoginSuccess,
  onLogout,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-gray-900 shadow-lg p-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg">
              <IconButton 
                label="Brush" 
                onClick={() => setTool(Tool.BRUSH)} 
                isActive={tool === Tool.BRUSH}
              >
                <BrushIcon className="w-6 h-6" />
              </IconButton>
              <IconButton 
                label="Eraser" 
                onClick={() => setTool(Tool.ERASER)} 
                isActive={tool === Tool.ERASER}
              >
                <EraserIcon className="w-6 h-6" />
              </IconButton>
            </div>
             <div className="h-10 w-px bg-gray-700 hidden sm:block" />
             <CanvasSizeSelector canvasSize={canvasSize} setCanvasSize={setCanvasSize} />
        </div>
        
        <div className="h-10 w-px bg-gray-700 hidden md:block" />

        <div className="flex-grow flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          <ColorPicker selectedColor={color} onColorChange={setColor} />
          <BrushSizeSlider brushSize={brushSize} onSizeChange={setBrushSize} />
          <div className="h-10 w-px bg-gray-700 hidden sm:block" />
          <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg text-white">
              <IconButton label="Zoom Out" onClick={onZoomOut}>
                <ZoomOutIcon className="w-6 h-6" />
              </IconButton>
              <button
                onClick={onZoomReset}
                title="Reset Zoom"
                className="w-16 text-center text-sm font-semibold rounded-md py-2.5 cursor-pointer hover:bg-gray-700 transition-colors"
              >
                {`${Math.round(zoom * 100)}%`}
              </button>
              <IconButton label="Zoom In" onClick={onZoomIn}>
                <ZoomInIcon className="w-6 h-6" />
              </IconButton>
          </div>
        </div>
        
        <div className="h-10 w-px bg-gray-700 hidden lg:block" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg">
            <IconButton label="Clear Canvas" onClick={clearCanvas}>
              <TrashIcon className="w-6 h-6" />
            </IconButton>
            <IconButton label="Download" onClick={downloadCanvas}>
              <DownloadIcon className="w-6 h-6" />
            </IconButton>
          </div>
          <div className="h-10 w-px bg-gray-700" />
           {user ? (
            <UserProfileComponent user={user} onLogout={onLogout} />
          ) : (
            <GoogleLogin
              onSuccess={onLoginSuccess}
              onError={() => {
                console.log('Login Failed');
              }}
              theme="outline"
              size="medium"
              shape="circle"
            />
          )}
        </div>
      </div>
    </header>
  );
};