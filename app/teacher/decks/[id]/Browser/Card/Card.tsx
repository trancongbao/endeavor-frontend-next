'use client'
import { Row } from '../../page'
import Toggle from '../Toggle'
import { useState } from 'react'
import Preview from './Preview'
import Edit from './Edit'

export default function Card({ card }: { card: Row[] }) {
  const [isEdit, setIsEdit] = useState(false)
  console.log('card: ', card)
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="self-end">
        <Toggle
          isChecked={isEdit}
          onChange={() => {
            setIsEdit(!isEdit)
          }}
        />
      </div>
      {isEdit ? <Edit card={card} /> : <Preview card={card} />}
    </div>
  )
}
