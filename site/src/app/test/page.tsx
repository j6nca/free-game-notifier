'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

function Search() {
  const searchParams = useSearchParams()
  const game = searchParams.get('game')
  const urlPrefix = "0; URL=com.epicgames.launcher://store"
  var content = game == null ? urlPrefix : urlPrefix + "/p/" + game
  redirect("com.epicgames.launcher://store")
}

export default function Page() {
  return <Suspense>
      <Search/>
    </Suspense>
}
