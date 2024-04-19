'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Search() {
  const searchParams = useSearchParams()
  const game = searchParams.get('game')
  const urlPrefix = "0; URL=com.epicgames.launcher://store"
  var content = game == null ? urlPrefix : urlPrefix + "/p/" + game
 
  return <meta http-equiv="refresh" content={content}/>
}

export default function Page() {
  return <head className='redirect'>
    <Suspense>
      <Search/>
    </Suspense>
  </head>
}
