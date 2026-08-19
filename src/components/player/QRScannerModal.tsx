import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../common/Modal';
import { QRService } from '../../services/qrService';
import type { QRValidationResult } from '../../services/qrService';
import { Camera, CameraOff, AlertCircle, RefreshCw } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'join' | 'checkpoint';
  currentHuntId?: string;
  currentCheckpointId?: string;
  targetQRText?: string;
  onScanSuccess: (result: QRValidationResult | string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  mode = 'checkpoint',
  currentHuntId,
  currentCheckpointId,
  targetQRText,
  onScanSuccess,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [simulatedInput, setSimulatedInput] = useState('');

  // Start camera stream when modal opens
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen) {
      setErrorMessage(null);

      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera permission denied or unavailable:', err);
          setHasCameraPermission(false);
          setErrorMessage('Camera access is required to scan QR codes.');
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  const handleProcessScannedText = (scannedText: string) => {
    setErrorMessage(null);
    const validation = QRService.parseAndValidateQR(scannedText, {
      mode,
      currentHuntId,
      currentCheckpointId: currentCheckpointId || targetQRText,
    });

    if (!validation.valid) {
      setErrorMessage(validation.error || 'Wrong QR code. Keep searching!');
    } else {
      onScanSuccess(mode === 'join' ? validation.joinCode || scannedText : validation);
      onClose();
    }
  };

  const handleRetryCamera = () => {
    setHasCameraPermission(null);
    setErrorMessage(null);
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: 'environment' } })
      .then((s) => {
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      })
      .catch(() => {
        setHasCameraPermission(false);
        setErrorMessage('Camera access is required to scan QR codes.');
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'join' ? '📷 SCAN HUNT JOIN QR' : '📷 SCAN CHECKPOINT QR'}>
      <div className="space-y-6">
        
        {/* CAMERA PERMISSION DENIED ERROR */}
        {hasCameraPermission === false && (
          <div className="p-4 rounded-2xl bg-rose-950 border-4 border-rose-500 text-center space-y-3">
            <CameraOff className="w-10 h-10 mx-auto text-rose-400" />
            <h4 className="text-sm font-arcade text-white">CAMERA ACCESS REQUIRED</h4>
            <p className="text-xs font-pixel text-rose-200">
              Camera access is required to scan QR codes. Please allow camera permissions in your browser settings.
            </p>
            <button
              onClick={handleRetryCamera}
              className="btn-penny-yellow py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 mx-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Camera Access
            </button>
          </div>
        )}

        {/* ACTIVE CAMERA VIEWFINDER */}
        {hasCameraPermission === true && (
          <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-black border-4 border-cyan-400 shadow-2xl flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Viewfinder Overlay Frame */}
            <div className="absolute w-44 h-44 border-4 border-cyan-400 rounded-2xl pointer-events-none shadow-[0_0_20px_rgba(0,191,255,0.8)] animate-pulse" />
            <div className="absolute bottom-2 left-2 right-2 text-center bg-black/70 py-1 text-[10px] font-arcade text-cyan-300 rounded">
              Position QR code inside frame
            </div>
          </div>
        )}

        {/* VALIDATION ERROR MESSAGE */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-950 border-2 border-rose-500 text-rose-200 text-xs font-pixel flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* OPTICAL PASS TOKEN SIMULATOR (DESKTOP / DEMO SCANNER) */}
        <div className="p-4 rounded-2xl bg-slate-900 border-2 border-purple-900 space-y-3">
          <span className="text-[10px] font-arcade text-purple-300 uppercase block">
            Optical QR Pass Token Test Input
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={mode === 'join' ? 'ONHUNT-JOIN-GUMBALL' : 'ONHUNT-CP-hunt_pirate_01-cp_p_02'}
              value={simulatedInput}
              onChange={(e) => setSimulatedInput(e.target.value)}
              className="flex-1 gumball-input rounded-xl px-3 py-2 text-xs font-arcade uppercase text-cyan-300"
            />
            <button
              onClick={() => handleProcessScannedText(simulatedInput || targetQRText || '')}
              className="btn-gumball-cyan text-xs py-2 px-3 rounded-xl flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" /> Scan Code
            </button>
          </div>
          {targetQRText && (
            <button
              onClick={() => {
                const payload = QRService.generateCheckpointQRPayload(currentHuntId || 'hunt_pirate_01', targetQRText);
                handleProcessScannedText(payload);
              }}
              className="text-[10px] font-pixel text-yellow-300 underline underline-offset-2"
            >
              Click to simulate scanning target QR token
            </button>
          )}
        </div>

      </div>
    </Modal>
  );
};
