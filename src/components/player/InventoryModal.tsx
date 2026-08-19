import React from 'react';
import type { InventoryItem } from '../../types/hunt';
import { Modal } from '../common/Modal';
import { Package } from 'lucide-react';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, items }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎒 QUEST INVENTORY BACKPACK">
      <div className="space-y-4">
        <p className="text-xs font-pixel text-slate-300">
          Collected artifacts & quest items unlocked during your adventure:
        </p>

        {items.length === 0 ? (
          <div className="text-center py-10 bg-slate-950 rounded-2xl border-2 border-slate-800 text-slate-400 text-xs font-pixel space-y-2">
            <Package className="w-10 h-10 mx-auto text-purple-400 opacity-50" />
            <p>Your backpack is empty! Solve checkpoint challenges to discover ancient relics.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-950 border-4 border-amber-400 flex items-start gap-3 shadow-[4px_4px_0px_#000]"
              >
                <div className="text-3xl p-2 rounded-xl bg-slate-900 border-2 border-amber-300">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-arcade text-white">{item.name}</h4>
                  <p className="text-xs font-pixel text-slate-300 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
