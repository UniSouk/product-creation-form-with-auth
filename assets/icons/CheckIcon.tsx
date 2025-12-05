import * as React from "react"
import { SVGProps } from "react"
const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="#262C34"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="m16.667 5-9.166 9.167L3.334 10"
    />
  </svg>
)
export default CheckIcon;
