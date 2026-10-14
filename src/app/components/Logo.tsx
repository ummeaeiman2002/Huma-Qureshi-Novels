"use client";

import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { useSiteSettings } from '@/app/context/SiteSettingsContext'

export default function Logo({
  scrolled = false,
  invert = true,
}: {
  scrolled?: boolean;
  invert?: boolean;
}) {
  const { logo } = useSiteSettings();
  const size = scrolled ? 52 : 64;
  return (
    <Link
      href="/"
      aria-label="Huma Qureshi Novels — Home"
      className="shrink-0 inline-flex items-center transition-all duration-300"
    >
      <Image
        src={logo}
        alt="Huma Qureshi Novels"
        width={size}
        height={size}
        priority
        className={`object-contain transition-all duration-300 ${invert ? 'invert' : ''}`}
        style={{ width: size, height: size }}
      />
    </Link>
  )
}
