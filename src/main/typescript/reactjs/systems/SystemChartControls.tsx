import { useSelector } from "react-redux";
import { pixiAppSelector } from "./systemsSlice";

export const SystemChartControls = () => {
  const app = useSelector(pixiAppSelector);

  return <div className="flex justify-center">
    <button type="button" onClick={() => app.zoomIn()}
            className="w-16 border-l border-t border-b text-base font-medium rounded-l-md text-black bg-white hover:bg-gray-100 px-4 py-2">
      +
    </button>
    <button type="button" onClick={() => app.zoomOut()}
            className="w-16 border-t border-b border-r text-base font-medium rounded-r-md text-black bg-white hover:bg-gray-100 px-4 py-2">
      -
    </button>
  </div>
}
