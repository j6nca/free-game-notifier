'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

function Search() {
  const searchParams = useSearchParams()
  const game = searchParams.get('game')
  const urlPrefix = "com.epicgames.launcher://store"
  var content = game == null ? urlPrefix : urlPrefix + "/p/" + game
 
  redirect(content)
}

export default function Page() {
  return <Suspense>
    <Search/>
  </Suspense>
}
