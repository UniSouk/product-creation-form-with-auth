import React from 'react';

interface ChevronDownIcon {
  size?: number; 
  color?: string; 
  className?:string
}

const ChevronDownIcon: React.FC<ChevronDownIcon> = ({ size = 16, color = 'currentColor' ,className}) => {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    className={className}
  >
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>


    {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M4 6L8 10L12 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg> */}
  </svg>
    
  );
};  

export default ChevronDownIcon;
