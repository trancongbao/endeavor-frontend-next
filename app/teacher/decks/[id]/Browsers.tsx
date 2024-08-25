'use client'

import _ from 'lodash'
import Subdecks from './Subdecks'
import Cards from './Cards'
import { useState } from 'react'

export default function Browser({ subdecks }) {
  const { currentSubdeck, setCurrentSubdeck } = useState(0)

  return (
    <div className="grid grid-cols-[1fr_2fr_4fr] grid-rows-[1fr_10fr] gap-4">
      <Subdecks subdecks={subdecks} currentSubdeck={currentSubdeck} setCurrentSubdeck={setCurrentSubdeck}/>
      <Cards />
      <div>Preview/Edit Toggle</div>
    </div>
  )
}
