import * as React from "react"
import { SVGProps } from "react"

const ChevronRIghtIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="#667085"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="m7.5 15 5-5-5-5"
    />
  </svg>
)
export default ChevronRIghtIcon;
