import React, { useState } from 'react'

interface ToggleSwitchProps {
  isChecked: boolean
  onChange: (checked: boolean) => void
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange }) => {
  const [checked, setChecked] = useState(isChecked)

  return (
    <div className="w-52 h-10 bg-gray-100 border border-gray-300 rounded-md grid grid-cols-2 items-center">
      <button
        className={`h-5/6 ml-1 ${checked ? 'text-gray-500' : 'bg-orange-400 text-white'}`}
        onClick={() => setChecked(false)}
      >
        Preview
      </button>
      <button
        className={`h-5/6 mr-1 ${checked ? 'bg-orange-400 text-white' : 'text-gray-500'}`}
        onClick={() => setChecked(true)}
      >
        Edit
      </button>
    </div>
  )
}

export default ToggleSwitch
