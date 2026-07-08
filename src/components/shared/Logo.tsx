/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function Logo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-9 w-9',
    lg: 'h-14 w-14',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-3xl font-bold',
  };

  const subSizes = {
    sm: 'text-[6px] tracking-[0.1em]',
    md: 'text-[8px] tracking-[0.2em]',
    lg: 'text-[10px] tracking-[0.25em]',
  };

  return (
    <div className={`flex items-center gap-2.5 ${className} select-none`}>
      {/* Icon logo representation */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]}`}>
        {/* Stylized T human / checkmark icon */}
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          {/* Head circle of stylized human */}
          <circle cx="50" cy="22" r="10" fill="var(--color-primary)" />
          {/* Arm curve representing checkmark / top of T */}
          <path
            d="M20,38 C40,38 42,32 50,38 C58,32 60,38 80,38"
            stroke="var(--color-secondary)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Stem of T representing torso / check arrow */}
          <path
            d="M50,38 L50,85"
            stroke="var(--color-primary)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Arc checkmark */}
          <path
            d="M32,60 L48,76 L80,35"
            stroke="var(--color-primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Text logo */}
      <div className="flex flex-col justify-center leading-none">
        <div className={textSizes[size]}>
          <span className="text-text-primary-theme font-extrabold tracking-tight">Techno</span>
          <span className="text-primary-theme font-extrabold tracking-tight">Adviser</span>
        </div>
        {showSubtitle && (
          <div className={`${subSizes[size]} text-text-muted-theme font-medium font-mono uppercase mt-0.5`}>
            Technologies Pvt. Ltd.
          </div>
        )}
      </div>
    </div>
  );
}
