import * as React from "react"
import { SVGProps } from "react"

const DotGridIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={20}
    fill="none"
    {...props}
  >
    <g
      stroke="#344054"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
    >
      <path d="M10.667 5a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667ZM10.667 10.833a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666ZM10.667 16.667a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667ZM16.5 5a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667ZM16.5 10.833a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666ZM16.5 16.667a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667ZM4.833 5a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667ZM4.833 10.833a.833.833 0 1 0 0-1.666.833.833 0 0 0 0 1.666ZM4.833 16.667a.833.833 0 1 0 0-1.667.833.833 0 0 0 0 1.667Z" />
    </g>
  </svg>
)
export default DotGridIcon;
