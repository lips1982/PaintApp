import { useEffect, useRef, useLayoutEffect } from 'react';
import { Tool, CanvasSize } from '../types';

interface CanvasOptions {
  color: string;
  brushSize: number;
  tool: Tool;
  canvasSize: CanvasSize;
  zoom: number;
}

export const useCanvas = (options: CanvasOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // A reference to the context is needed for resizes, so we get it once here.
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;
    contextRef.current = context;

    // This function preserves the existing drawing when resizing the canvas.
    const preserveAndResize = (newWidth: number, newHeight: number) => {
        if (!contextRef.current) return;
        const context = contextRef.current;
        
        // If the canvas is new or has no size, just set size and fill.
        if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = newWidth;
            canvas.height = newHeight;
            context.fillStyle = 'white';
            context.fillRect(0, 0, newWidth, newHeight);
            return;
        }

        // Store the current content, resize, and restore it.
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = newWidth;
        canvas.height = newHeight;
        context.fillStyle = 'white';
        context.fillRect(0, 0, newWidth, newHeight);
        context.putImageData(imageData, 0, 0);
    };

    if (options.canvasSize === 'FIT_SCREEN') {
      const parent = canvas.parentElement;
      if (!parent) return;

      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          // Only resize if the container has a valid, non-zero size.
          if (width > 0 && height > 0) {
            preserveAndResize(width, height);
          }
        }
      });

      resizeObserver.observe(parent);
      // Set initial size based on the parent container.
      const { clientWidth, clientHeight } = parent;
      if (clientWidth > 0 && clientHeight > 0) {
          preserveAndResize(clientWidth, clientHeight);
      }


      return () => {
        resizeObserver.disconnect();
      };
    } else {
      // For fixed sizes, just apply the dimensions.
      preserveAndResize(options.canvasSize.width, options.canvasSize.height);
    }
  }, [options.canvasSize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Ensure we always use the latest context.
    const context = contextRef.current;
    if (!context) return;

    const getCoordinates = (event: MouseEvent | TouchEvent): { x: number; y: number } => {
        const rect = canvas.getBoundingClientRect();
        const touch = event instanceof TouchEvent ? event.touches[0] : null;
        const clientX = touch ? touch.clientX : (event as MouseEvent).clientX;
        const clientY = touch ? touch.clientY : (event as MouseEvent).clientY;
        // Adjust coordinates based on the current zoom level.
        return {
            x: (clientX - rect.left) / options.zoom,
            y: (clientY - rect.top) / options.zoom,
        };
    };

    const startDrawing = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const { x, y } = getCoordinates(event);
      context.beginPath();
      context.moveTo(x, y);
      isDrawing.current = true;
    };

    const draw = (event: MouseEvent | TouchEvent) => {
      if (!isDrawing.current) return;
      event.preventDefault();
      const { x, y } = getCoordinates(event);
      
      // Eraser draws with white, otherwise use the selected color.
      context.strokeStyle = options.tool === Tool.ERASER ? '#FFFFFF' : options.color;
      context.lineWidth = options.brushSize;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      
      context.lineTo(x, y);
      context.stroke();
    };

    const stopDrawing = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      if (!isDrawing.current) return;
      context.closePath();
      isDrawing.current = false;
    };

    // Add event listeners for both mouse and touch events.
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });
    canvas.addEventListener('touchcancel', stopDrawing, { passive: false });

    return () => {
      // Cleanup: remove all event listeners.
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
      canvas.removeEventListener('touchcancel', stopDrawing);
    };
  }, [options.color, options.brushSize, options.tool, options.zoom]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    // Fill the canvas with white to clear it.
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;

    // Create a temporary canvas to ensure the background is not transparent.
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (!tempCtx) return;

    // 1. Fill the temporary canvas with a white background.
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // 2. Draw the user's canvas content on top of the white background.
    tempCtx.drawImage(canvas, 0, 0);

    // 3. Get the data URL from the temporary canvas, which now has a solid background.
    const dataUrl = tempCanvas.toDataURL('image/png');
    
    // 4. Trigger the download.
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'drawing.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { canvasRef, clearCanvas, downloadCanvas };
};
