import React, { useState } from 'react';
import type { Hunt } from '../../types/hunt';
import { Modal } from '../common/Modal';
import { CheckCircle2, Copy, Share2, Download, Radio } from 'lucide-react';
import { QRService } from '../../services/qrService';

interface PublishChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  hunt: Hunt;
  onPublishConfirmed: () => void;
}

export const PublishChecklistModal: React.FC<PublishChecklistModalProps> = ({
  isOpen,
  onClose,
  hunt,
  onPublishConfirmed,
}) => {
  const [isPublished, setIsPublished] = useState(hunt.status === 'live');
  const [copiedCode, setCopiedCode] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>('');

  React.useEffect(() => {
    if (isOpen && hunt) {
      QRService.generateDataURL(hunt.joinCode).then((url) => setQrUrl(url));
    }
  }, [isOpen, hunt]);

  const handlePublish = () => {
    setIsPublished(true);
    onPublishConfirmed();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hunt.joinCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Publish Quest Checklist – ${hunt.title}`}>
      <div className="space-y-6">
        {!isPublished ? (
          /* CHECKLIST BEFORE PUBLISHING */
          <div className="space-y-4">
            <p className="text-xs font-pixel text-slate-300">
              Verify all checklist items before launching your hunt to live players:
            </p>

            <div className="space-y-2.5">
              {[
                { label: 'Hunt details & title complete', checked: true },
                { label: `Checkpoints complete (${hunt.checkpoints.length} nodes configured)`, checked: hunt.checkpoints.length > 0 },
                { label: 'Answers & ciphers configured', checked: true },
                { label: 'Teams & squad limits configured', checked: true },
                { label: `Timer configured (${hunt.timeLimitMinutes} minutes)`, checked: true },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border-2 border-slate-800 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-pixel text-slate-200">{item.label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handlePublish}
              className="w-full btn-gumball-cyan py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs"
            >
              <Radio className="w-4 h-4 animate-ping" /> PUBLISH HUNT NOW
            </button>
          </div>
        ) : (
          /* PUBLISHED RESULT CODES & QR SHEET */
          <div className="space-y-6 text-center">
            <div className="p-4 rounded-2xl bg-emerald-950 border-4 border-emerald-400 space-y-2">
              <span className="text-[10px] font-arcade text-emerald-300 uppercase">QUEST LIVE & PUBLISHED</span>
              <h3 className="text-2xl font-arcade text-white tracking-widest gumball-text-yellow">{hunt.joinCode}</h3>
              <p className="text-xs font-pixel text-emerald-200">Share this code or QR pass with your players to join!</p>
            </div>

            {qrUrl && (
              <div className="w-48 h-48 mx-auto p-3 bg-white rounded-2xl border-4 border-slate-900 shadow-xl flex items-center justify-center">
                <img src={qrUrl} alt="QR Join Pass" className="w-full h-full object-contain" />
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <button onClick={handleCopy} className="btn-penny-yellow text-[10px] py-2 px-2 rounded-xl flex items-center justify-center gap-1">
                <Copy className="w-3.5 h-3.5" /> {copiedCode ? 'COPIED!' : 'Copy Code'}
              </button>

              <button onClick={handleCopy} className="btn-gumball-cyan text-[10px] py-2 px-2 rounded-xl flex items-center justify-center gap-1">
                <Share2 className="w-3.5 h-3.5" /> Share Hunt
              </button>

              <a href={qrUrl} download={`onhunt-${hunt.joinCode}.png`} className="btn-anais-pink text-[10px] py-2 px-2 rounded-xl flex items-center justify-center gap-1">
                <Download className="w-3.5 h-3.5" /> Download QR
              </a>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
