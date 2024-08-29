import { useRef, useState } from 'react'
import Menu from './Menu'
import { deleteSubdeck, editSubdeckTitle } from '@/app/actions'
import { Input } from '@/components/ui/input'

interface SubdeckProps {
  courseId: number
  subdeckOrder: number
  subdeckTitle: string
  isSelected: boolean
  setSelectedSubdeckOrder: (order: number) => void
}

export default function Subdeck({
  courseId,
  subdeckOrder,
  subdeckTitle,
  isSelected, //TODO: style in parent component
  setSelectedSubdeckOrder,
}: SubdeckProps) {
  const [isEditingSubdeckTitle, setIsEditingSubdeckTitle] = useState(false)
  const editSubdeckTitileInputRef = useRef<HTMLInputElement>(null)
  const [newSubdeckTitle, setNewSubdeckTitle] = useState(subdeckTitle);

  return (
    <div>
      {!isEditingSubdeckTitle ? (
        <div
          className={`m-1 ${isSelected ? 'bg-orange-200' : 'hover:bg-orange-100'} rounded flex justify-between items-center`}
        >
          <p onClick={() => setSelectedSubdeckOrder(subdeckOrder)} className="flex-1 cursor-pointer p-2 rounded">
            {subdeckTitle}
          </p>
          <Menu onSelect={onSelect} />
        </div>
      ) : (
        <div>
          <form action={editSubdeckTitle} onSubmit={() => setIsEditingSubdeckTitle(false)}>
            <Input type="hidden" name="courseId" value={courseId} />
            <Input type="hidden" name="order" value={subdeckOrder} />
            <Input
              name="title"
              ref={editSubdeckTitileInputRef}
              placeholder="Edit the subdeck title and press Return."
              value={newSubdeckTitle}
              onChange={(e) => setNewSubdeckTitle(e.target.value)}
            />
          </form>
        </div>
      )}
    </div>
  )

  function onSelect(action: 'edit' | 'delete') {
    console.log('onSelect: ', action)
    switch (action) {
      case 'edit':
        setIsEditingSubdeckTitle(true)
      case 'delete':
        deleteSubdeck(courseId, subdeckOrder)
    }
  }
}
