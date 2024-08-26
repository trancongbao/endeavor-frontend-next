import React, { useState } from 'react'

interface ToggleSwitchProps {
  isChecked: boolean
  onChange: (checked: boolean) => void
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange }) => {
  const [checked, setChecked] = useState(isChecked)

  const handleToggle = () => {
    setChecked(!checked)
    onChange(!checked)
  }

  return (
    <div className="w-52 h-10 bg-gray-100 border border-gray-300 rounded-md grid grid-cols-2 items-center">
      <button className={`text-center ${checked ? 'bg-none text-gray-400' : 'text-white'}`}>Preview</button>
      <button className={` text-gray-400 text-center  ${checked ? 'bg-orange-300 text-white' : 'text-white'}`}>
        Edit
      </button>
    </div>
  )
}

export default ToggleSwitch
