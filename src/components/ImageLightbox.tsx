'use client';

import { X } from 'lucide-react';

export interface ImageLightboxProps {
  open: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export default function ImageLightbox({ open, onClose, src, alt }: ImageLightboxProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close"
        tabIndex={-1}
      />
      <div className="relative flex flex-col items-center max-w-4xl w-full max-h-[90vh]">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-white hover:bg-white/10 rounded-lg z-10"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="relative max-h-[85vh] max-w-full w-auto h-auto rounded-xl object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}
