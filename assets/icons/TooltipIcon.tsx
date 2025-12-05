import * as React from "react"
import { SVGProps } from "react"

const TooltipIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={9}
    fill="none"
    {...props}
  >
    <path
      fill="#101828"
      d="M2.429 8.515c-.891 0-1.337-1.077-.707-1.707L7.792.737a1 1 0 0 1 1.415 0l6.071 6.07c.63.63.184 1.708-.707 1.708H2.43Z"
    />
  </svg>
)
export default TooltipIcon;
