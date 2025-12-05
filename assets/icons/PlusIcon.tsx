import React from 'react';

interface PlusIcon {
  size?: number; 
  color?: string; 
  className?:string
}

const PlusIcon: React.FC<PlusIcon> = ({ size = 24, color = 'currentColor' ,className}) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path d="M12 5V19M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    
  </svg>


    
  );
};

export default PlusIcon;
