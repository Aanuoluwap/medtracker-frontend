import React from 'react';
import { X, PlayCircle } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in-95 duration-200 flex flex-col h-[80vh] md:h-auto">

        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
               <PlayCircle size={20} />
            </div>
            App Tutorial
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full transition-all"
            aria-label="Close tutorial"
          >
            <X size={24} />
          </button>
        </div>

        {/* Video Content */}
        <div className="flex-1 bg-black flex items-center justify-center p-0 md:p-4 overflow-hidden">
             {/* Aspect Ratio Container for Vertical Video (9:16 approx) */}
             <div className="relative w-full h-full md:w-[315px] md:h-[560px] max-h-full aspect-[9/16] shadow-lg md:rounded-xl overflow-hidden bg-gray-900">
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Hzk1KJs8Q_Y"
                    title="Medtracker Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                ></iframe>
             </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-white text-center text-sm text-gray-500">
            Learn how to use Medtracker's features in 60 seconds.
        </div>
      </div>
    </div>
  );
};
