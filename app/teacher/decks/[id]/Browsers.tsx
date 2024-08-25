'use client'

import _ from 'lodash'
import Cards from './Cards'
import { useState } from 'react'
import { Subdecks } from './page'

export default function Browser({ subdecks }: { subdecks: Subdecks }) {
  /*
   * Subdeck with the lowest order is selected by default.
   */
  const [selectedSubdeck, setSelectedSubdeck] = useState(subdecks[_.min(Object.keys(subdecks).map(Number)) as number])

  /*
   * Extract subdeck list as a separate component would introduce tight coupling regarding the state management of selectedSubdeck.
   */
  return (
    <div className="grid grid-cols-[1fr_2fr_4fr] grid-rows-[1fr_10fr] gap-4">
      <div className="basis-80 border-r-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {Object.keys(subdecks).map((subdeckOrder) => {
            return (
              <p
                key={subdeckOrder}
                onClick={() => setSelectedSubdeck(subdecks[subdeckOrder])}
                className={`hover:bg-blue-100 ${selectedSubdeck[0].lessonOrder === parseInt(subdeckOrder) ? 'bg-blue-300' : ''} cursor-pointer p-2 rounded`}
              >{`${subdecks[subdeckOrder][0].lessonTitle}`}</p>
            )
          })}
        </div>
        <button className="w-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Sub-deck
        </button>
      </div>
      <Cards />
      <div>Preview/Edit Toggle</div>
    </div>
  )
}
