import * as React from "react"
import { SVGProps } from "react"
const HelpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke="#98A2B3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.333}
        d="M6.06 6a2 2 0 0 1 3.886.667c0 1.333-2 2-2 2M8 11.333h.006M14.666 8A6.667 6.667 0 1 1 1.333 8a6.667 6.667 0 0 1 13.333 0Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default HelpIcon;
