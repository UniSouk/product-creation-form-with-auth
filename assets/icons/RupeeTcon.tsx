import * as React from "react"
import { SVGProps } from "react"

const RupeeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke="#667085"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.667}
        d="M7.084 8.333h5.833M7.084 5.417h5.833M11.667 15l-4.583-3.75h1.25c3.704 0 3.704-5.833 0-5.833m10 4.583a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default RupeeIcon;
