import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import DotsGridIcon from "@/assets/icons/DotGridIcon";
import InputCheckbox from "./InputCheckbox";
import { useEffect, useRef } from "react";
import tippy from "tippy.js";

function DraggedImage({
  id,
  image,
  // fileType,
  backImageId,
  imageSelectHandle,
  checked,
}: {
  backImageId: number;
  id: number;
  image: string;
  fileType: "IMAGE" | "VIDEO";
  imageSelectHandle: (position: string) => void;
  checked: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };  

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (tooltipRef.current) {
      tippy(tooltipRef.current, {
        theme: "unsktooltip",
        content: "Drag & Switch Positions",
        arrow: true,
        placement: "bottom",
      });
    }
  }, []);

  return (
    <div className="relative">
      <div
        className="w-full h-[158px] touch-none actionBtn"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
      >
        <div className="top-2 left-2 absolute z-10">
          <InputCheckbox
            onChange={imageSelectHandle}
            value={id.toString()}
            checked={checked}
          />
        </div>
        <img
          src={image}
          className="w-full h-full object-cover rounded-lg"
          alt="image"
        />
        <div
          ref={tooltipRef}
          className="shadow-[0_1px_2px_0px_rgba(16,24,40,0.05)] absolute top-2 right-2 bg-[#fff] border border-[#D0D5DD] rounded-lg p-2 h-9 actionMenu hidden inputSecondSymbol"
        >
          <DotsGridIcon />
        </div>
        <div className="flex justify-center">
          {id === backImageId && (
            <button className="absolute py-[3px] bottom-[13px] px-2 rounded-md text-xs font-medium w-fit border -border-Brand-300 -bg-Brand-50 shadow-shadow-xs -text-Brand-700">
              Back View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DraggedImage;
