import FkVscode from '@/components/fkVscode'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <video controls>
        <source src="https://files.edgestore.dev/0jvce83pji4k8o75/publicFiles/_public/ae2340f2-8154-4d65-99ce-f75702b4d15f.mp4" type="video/mp4"/>
      </video>
      <Link href={'/testing'}></Link>
      <Link href={'/testing'}></Link>
    </div>
  )
}
