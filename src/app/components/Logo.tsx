import Image from 'next/image'
import React from 'react'
// import {icons} from "../assets/index"
import Link from 'next/link'

export default function Logo({ scrolled = false }: { scrolled?: boolean }) {
  return (
    <Link href="/" className={scrolled ? "w-[50px] h-[50px] lg:self-start transition-all duration-300" : "w-[100px] h-[100px] lg:self-start transition-all duration-300"}>
      <Image src={"https://res.cloudinary.com/dx1gryhqc/image/upload/v1758662209/Logo_ox1c8z.png"} alt='' width={scrolled ? 50 : 100} height={scrolled ? 50 : 100} className={scrolled ? "w-[50px] h-[50px] object-contain invert" : "w-[100px] h-[100px] object-contain invert"} />
    </Link>
  )
}
