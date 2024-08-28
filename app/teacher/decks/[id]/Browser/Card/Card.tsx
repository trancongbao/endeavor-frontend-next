'use client'
import { Row } from '../../page'
import Toggle from '../Toggle'
import { useState } from 'react'
import Preview from './Preview'
import Edit from './Edit'

export default function Card({ selectedCardRows }: { selectedCardRows: Row[] }) {
  console.log('selectedCardRows: ', selectedCardRows)
  const [isEdit, setIsEdit] = useState(false)
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
      {isEdit ? <Edit selectedCardRows={selectedCardRows} /> : <Preview selectedCardRows={selectedCardRows} />}
    </div>
  )
}
