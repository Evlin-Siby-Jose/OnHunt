import React, { useState, useEffect } from 'react';
import type { Hunt, Checkpoint } from '../../types/hunt';
import { Modal } from '../common/Modal';
import { QRService } from '../../services/qrService';
import { Printer } from 'lucide-react';

interface PrintableQRSheetProps {
  isOpen: boolean;
  onClose: () => void;
  hunt?: Hunt;
  checkpoints?: Checkpoint[];
  huntTitle?: string;
}

export const PrintableQRSheet: React.FC<PrintableQRSheetProps> = ({
  isOpen,
  onClose,
  hunt,
  checkpoints: rawCheckpoints,
  huntTitle: rawTitle,
}) => {
  const [qrImages, setQrImages] = useState<Record<string, string>>({});

  const checkpointsList = hunt ? hunt.checkpoints : rawCheckpoints || [];
  const title = hunt ? hunt.title : rawTitle || 'Quest Pass Sheet';

  useEffect(() => {
    if (isOpen && checkpointsList.length > 0) {
      const loadQrs = async () => {
        const imgs: Record<string, string> = {};
        for (const cp of checkpointsList) {
          if (cp.clueType === 'qr_code') {
            const data = cp.qrCodeData || cp.correctAnswer;
            imgs[cp.id] = await QRService.generateDataURL(data);
          }
        }
        setQrImages(imgs);
      };
      loadQrs();
    }
  }, [isOpen, checkpointsList]);

  const handlePrint = () => {
    window.print();
  };

  const qrCheckpoints = checkpointsList.filter((cp) => cp.clueType === 'qr_code');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Printable QR Passes – ${title}`} maxWidth="max-w-4xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <p className="text-xs font-pixel text-slate-300">
            Print these optical QR passes and place them physically at checkpoint locations.
          </p>

          <button
            onClick={handlePrint}
            className="pixel-btn-purple py-2 px-4 rounded-xl text-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Sheet
          </button>
        </div>

        {qrCheckpoints.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs font-pixel">
            No QR-type checkpoints found in this hunt. Add a "QR Code" checkpoint to print badges!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2">
            {qrCheckpoints.map((cp) => (
              <div
                key={cp.id}
                className="p-4 rounded-xl bg-slate-950 border-2 border-purple-500 text-center space-y-3 print:border-black print:text-black print:bg-white"
              >
                <div className="border-b border-slate-800 pb-2 print:border-black">
                  <span className="text-[10px] font-arcade text-purple-300 print:text-black block uppercase">
                    Checkpoint #{cp.order} Token
                  </span>
                  <h4 className="text-sm font-bold font-pixel text-white print:text-black">{cp.title}</h4>
                </div>

                {qrImages[cp.id] ? (
                  <img
                    src={qrImages[cp.id]}
                    alt={`QR Code for ${cp.title}`}
                    className="w-40 h-40 mx-auto bg-white p-2 rounded-lg border border-slate-700 print:border-black"
                  />
                ) : (
                  <div className="w-40 h-40 mx-auto bg-slate-900 flex items-center justify-center text-xs text-slate-500">
                    Generating...
                  </div>
                )}

                <p className="text-[10px] font-arcade text-amber-400 print:text-black">
                  SCAN TO COMPLETE CHECKPOINT
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
