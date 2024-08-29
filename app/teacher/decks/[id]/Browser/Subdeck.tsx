import Menu from './Menu'
import { deleteSubdeck, editSubdeckTitle } from '@/app/actions'

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
  return (
    <div
      className={`m-1 ${isSelected ? 'bg-orange-200' : 'hover:bg-orange-100'} rounded flex justify-between items-center`}
    >
      <p onClick={() => setSelectedSubdeckOrder(subdeckOrder)} className={`flex-1 cursor-pointer p-2 rounded`}>
        {subdeckTitle}
      </p>
      <Menu onSelect={onSelect} />
    </div>
  )

  function onSelect(action: 'edit' | 'delete') {
    console.log('onSelect: ', action)
    switch (action) {
      case 'edit':
        editSubdeckTitle(courseId, subdeckOrder)
      case 'delete':
        deleteSubdeck(courseId, subdeckOrder)
    }
  }
}
