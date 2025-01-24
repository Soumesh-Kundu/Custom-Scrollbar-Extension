import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Switch } from "./components/ui/switch";
import { Slider } from "./components/ui/slider";
import { debounce } from "lodash";

function App() {
  const [isApplyChanges, setIsApplyChanges] = useState<boolean>(false);
  const [scrollWidth, setScrollWidth] = useState<number>(50);
  // const [data, setData] = useState<any[]>(null);
  const debouncedSetScrollWidth = useCallback(
    debounce((newScrollWidth) => {
      chrome.storage.sync.set({ scrollWidth: newScrollWidth });
    }, 500), // 300ms debounce delay
    []
  );
  
  useEffect(() => {
    chrome.storage.sync.get(["isApplyChanges",'scrollWidth'], (result) => {
      setIsApplyChanges(result.isApplyChanges);
      setScrollWidth(result.scrollWidth);
    });
  }, []);
  


  useEffect(() => {
    chrome.storage.sync.set({ isApplyChanges });
  }, [isApplyChanges]);
  
  useEffect(() => {
    debouncedSetScrollWidth(scrollWidth);
  }, [scrollWidth]);
  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-64 h-48 gap-5 p-6 border-2">
        <div className="flex items-center w-full gap-2">
          <Switch
            checked={isApplyChanges}
            onCheckedChange={setIsApplyChanges}
          />{" "}
          Apply Changes
        </div>
        <div className="flex items-center w-full gap-2">
          Scrollbar Width{" "}
          <Slider
            value={[scrollWidth]}
            max={100}
            min={0}
            onValueChange={(i) => {
              setScrollWidth(i[0]);
            }}
          />
        </div>
        {/* {JSON.stringify(scrollWidth)} */}
      </div>
    </>
  );
}

export default App;
