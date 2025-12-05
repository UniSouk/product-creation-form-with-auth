import InfoIcon from "@/assets/icons/InfoIcon";

export type VerificationError = {
  id?: string;
  platform: string;
  category: "CATALOG" | "SYNC";
  productId: string;
  variantId: string;
  code?: string;
  message: string;
  attributes: string[];
  severity: "WARNING" | "ERROR";
};

const severityColor: Record<VerificationError["severity"], string> = {
  ERROR: "-bg-Error-600 text-white",
  WARNING: "bg-yellow-200 text-yellow-800",
};

const ProductErrorReport = ({
  errorProductData,
}: {
  errorProductData: VerificationError[];
}) => {
  console.log("errorProductData: ", errorProductData);
  return (
    <div className="w-full rounded-xl border -border-Error-100 -bg-Error-25 p-6">
      <div className="flex items-start gap-3">
        <div className="p-2 -bg-Error-25 rounded-full">
          <div className="relative flex items-center justify-center flex-shrink-0">
            <div className="absolute rounded-full border-[2.4px] border-[#f1a098] w-7 h-7"></div>
            <div className="absolute rounded-full border-[2.2px] border-[#fadedb] w-10 h-10"></div>
            <InfoIcon className="text-[#D92D20] w-5 h-5" />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Issues with adding products
          </h2>

          <p className="text-sm text-gray-700 mt-1">
            These issues were found for each platform. Please resolve them to
            continue:
          </p>

          {/* Scrollable container */}
          <div className="mt-4 space-y-4 max-h-64 overflow-y-auto">
            {errorProductData.map((item, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 text-base">
                  {item.platform}{" "}
                  <span
                    className={`${severityColor[item.severity]} px-2 py-1 rounded-xl text-[10px] ml-2`}
                  >
                    {item.severity}
                  </span>
                </h3>

                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-800 text-sm">
                  <li>{item.message}</li>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductErrorReport;
