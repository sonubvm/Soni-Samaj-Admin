'use client';

import { useState } from 'react';
import ImageLightbox from '@/components/ImageLightbox';

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || '?'
  );
}

export interface ClickablePhotoProps {
  photo?: string;
  name: string;
  imageClassName: string;
  /** When no photo: show initials placeholder, render nothing, or use custom node */
  fallback?: 'initials' | 'none';
  initialsClassName?: string;
}

export default function ClickablePhoto({
  photo,
  name,
  imageClassName,
  fallback = 'none',
  initialsClassName,
}: ClickablePhotoProps) {
  const [open, setOpen] = useState(false);

  if (!photo) {
    if (fallback === 'initials' && initialsClassName) {
      return (
        <div className={initialsClassName} aria-hidden>
          {initialsFromName(name)}
        </div>
      );
    }
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
        aria-label={`View photo of ${name}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt={name}
          className={`${imageClassName} cursor-zoom-in hover:opacity-90 transition-opacity`}
        />
      </button>
      <ImageLightbox open={open} onClose={() => setOpen(false)} src={photo} alt={name} />
    </>
  );
}
