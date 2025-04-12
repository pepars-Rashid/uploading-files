import FkVscode from '@/components/fkVscode'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <div className='p-5'>
      <div className='w-full h-full flex justify-center items-center mb-14'>
        <video controls>
          <source src="https://files.edgestore.dev/0jvce83pji4k8o75/publicFiles/_public/ae2340f2-8154-4d65-99ce-f75702b4d15f.mp4" type="video/mp4"/>
        </video>
      </div>
        <div className='flex gap-4 justify-center items-center border-2 py-3 rounded-md'>
        <Link className='text-white text-xl border-2 p-2 rounded-md' href={'/testing-images-store'}>Images</Link>
        <Link className='text-white text-xl border-2 p-2 rounded-md' href={'/testing-videos'}>testing-videos</Link>
        </div>
      
    </div>
  )
}
