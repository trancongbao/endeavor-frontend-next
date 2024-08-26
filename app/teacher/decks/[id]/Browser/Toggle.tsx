import React, { useState } from "react";

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isChecked, onChange }) => {
  const [checked, setChecked] = useState(isChecked);

  const handleToggle = () => {
    setChecked(!checked);
    onChange(!checked);
  };

  return (
    <label
      className="relative cursor-pointer w-52 h-12 bg-gray-100 border border-gray-300 rounded-md"
      onClick={handleToggle}
    >
      <input type="checkbox" className="hidden" checked={checked} readOnly />
      <a
        className={`block absolute top-[3px] bottom-[3px] bg-orange-400 rounded-md transition-all ease-out duration-200 ${
          checked ? "left-[calc(50%-3px)] right-[3px]" : "left-[3px] right-[calc(50%-3px)]"
        }`}
      ></a>
      <span className="absolute left-0 w-[calc(100%-6px)] text-left whitespace-nowrap mx-[3px]">
        <span
          className={`absolute top-[-1px] left-0 text-white text-center leading-9 transition-all ease-out duration-200 w-[50%] ${
            checked ? "text-gray-400" : "text-white"
          }`}
        >
          Preview
        </span>
        <span
          className={`absolute top-[-1px] right-0 text-gray-400 text-center leading-9 transition-all ease-out duration-200 w-[50%] ${
            checked ? "text-white" : "text-white"
          }`}
        >
          Edit
        </span>
      </span>
    </label>
  );
};

export default ToggleSwitch;
