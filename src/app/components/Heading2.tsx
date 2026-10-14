import React from 'react'

export default function Heading2({heading2}:{heading2:string}) {
  return (
    <h3 className='leading-16 text-2xl text-tertiary'>
      {heading2}
    </h3>
  )
}
