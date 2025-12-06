import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { ControlPanel, WordStream, BarChart, Details } from "components/core";
import {
  IconContainer,
  Button,
  Loader,
  Error,
  Tooltip,
} from "components/common";
import { IconX, IconMenu, IconInfo } from "icons";
import cx from "classnames";

export default function App() {
  const [rawData, setRawData] = useState(null);
  const [subGraphData, setSubGraphData] = useState(null);
  const [displayBarChart, setDisplayBarChart] = useState(false);
  const [wordsData, setWordsData] = useState(null);
  const [wordStreamProcessing, setwordStreamProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [brushRange, setBrushRange] = useState(null);
  const [clearBrush, setClearBrush] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTriggerRef = useRef(null);
  const dimensions = useMemo(() => [1200, 800], []);

  // Close detail view handler
  const closeDetailView = useCallback(() => {
    setDisplayBarChart(false);
    setClearBrush(true);
  }, []);

  // Escape key handler for closing detail view
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && displayBarChart) {
        closeDetailView();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [displayBarChart, closeDetailView]);

  useEffect(() => {
    if (!subGraphData) return;
    setDetailsData(subGraphData[0]);
  }, [subGraphData, setDetailsData]);

  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row relative">
      {/* Sidebar Toggle Button - positioned absolutely at top-left of viewport */}
      <div className="fixed top-2 left-2 z-40 w-12 h-12">
        <button
          className="w-full h-full hover:bg-gray-600 hover:bg-opacity-30 text-white rounded-lg focus:outline-none transition-all duration-200 ease-in-out flex items-center justify-center"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <div className="w-6 h-6">
            <IconMenu />
          </div>
        </button>
      </div>

      {/* Sidebar - always rendered, uses transform for smooth animation */}
      <div
        className={cx(
          "fixed z-20",
          "h-screen",
          "bg-gray-800 shadow-lg overflow-hidden",
          "w-3/4 md:w-1/4 lg:w-1/5"
        )}
        style={{
          transform: sidebarCollapsed
            ? "translate3d(-100%, 0, 0)"
            : "translate3d(0, 0, 0)",
          WebkitTransform: sidebarCollapsed
            ? "translate3d(-100%, 0, 0)"
            : "translate3d(0, 0, 0)",
          transition: "transform 300ms ease",
          WebkitTransition: "-webkit-transform 300ms ease",
        }}
      >
        <div className="h-full overflow-y-auto">
          <ControlPanel
            setRawData={setRawData}
            setWordsData={setWordsData}
            setwordStreamProcessing={setwordStreamProcessing}
            setLoading={setLoading}
            setError={setError}
            dimensions={dimensions}
          />
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open - uses opacity transition */}
      <div
        className="md:hidden fixed inset-0 bg-black z-10"
        style={{
          opacity: sidebarCollapsed ? 0 : 0.5,
          pointerEvents: sidebarCollapsed ? "none" : "auto",
          transition: "opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
          willChange: "opacity",
        }}
        onClick={() => setSidebarCollapsed(true)}
      />

      {/* Main Content */}
      <div
        className="relative text-white flex-1 min-h-screen w-full"
        style={{
          marginLeft: !sidebarCollapsed ? "20%" : "3.5rem",
          transition: "margin-left 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {loading || wordStreamProcessing ? (
          <>
            <div className="absolute inset-0 h-full w-full bg-gray-600 opacity-25" />
            <Loader />
          </>
        ) : null}
        <div className="w-full min-h-screen flex flex-col">
          {/* Title and Info Section */}
          <div className="flex justify-center items-center py-4 px-4 flex-shrink-0 relative z-50">
            <div className="flex items-center space-x-3">
              <h1 className="text-xl md:text-3xl font-bold text-white tracking-wider">
                wordstream
              </h1>
              <div className="relative">
                <button
                  ref={tooltipTriggerRef}
                  className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded ${
                    showTooltip
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setShowTooltip(!showTooltip)}
                  aria-label="Show app information"
                  aria-expanded={showTooltip}
                  aria-describedby={
                    showTooltip ? "tooltip-description" : undefined
                  }
                >
                  <IconInfo />
                </button>

                <Tooltip
                  isOpen={showTooltip}
                  onClose={() => setShowTooltip(false)}
                  triggerRef={tooltipTriggerRef}
                >
                  <div className="text-sm text-gray-300 leading-relaxed">
                    <p className="mb-3">
                      Analyze word frequency and trends over time using
                      interactive visualizations.
                    </p>
                    <p>
                      You can load data via the sidebar and select timeframes in
                      the graph for detailed views.
                    </p>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div
            className="flex-1 flex flex-col justify-center items-center"
            style={{ minHeight: "calc(100vh - 100px)" }}
          >
            {error ? (
              <Error />
            ) : wordsData ? (
              <div
                className="w-full flex flex-col justify-center items-center"
                style={{ height: "calc(100vh - 100px)" }}
              >
                <div
                  className="w-full"
                  style={{
                    height: `${displayBarChart ? "50%" : "100%"}`,
                  }}
                >
                  <WordStream
                    displayBarChart={displayBarChart}
                    setSubGraphData={setSubGraphData}
                    setDisplayBarChart={setDisplayBarChart}
                    rawData={rawData}
                    wordsData={wordsData}
                    dimensions={dimensions}
                    setBrushRange={setBrushRange}
                    brushRange={brushRange}
                    clearBrush={clearBrush}
                    setClearBrush={setClearBrush}
                  />
                </div>
                {displayBarChart ? (
                  <div
                    className="flex flex-col md:flex-row relative border-t-2 border-gray-600 bg-gray-800 bg-opacity-50 rounded-lg mr-8"
                    style={{
                      height: "45%",
                      minHeight: "250px",
                    }}
                  >
                    {/* Close button - positioned at top right of detail section */}
                    <button
                      onClick={closeDetailView}
                      className="absolute top-3 right-3 z-50 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label="Close detail view (Esc)"
                      title="Close (Esc)"
                    >
                      <div className="w-4 h-4">
                        <IconX />
                      </div>
                    </button>
                    {subGraphData && (
                      <div className="w-full md:w-1/2 h-full p-2">
                        <BarChart
                          data={subGraphData}
                          wordsData={wordsData}
                          brushRange={brushRange}
                          setDetailsData={setDetailsData}
                          detailsData={detailsData}
                        />
                      </div>
                    )}
                    {detailsData && (
                      <div className="w-full md:w-1/2 h-full p-2">
                        <Details data={detailsData} />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="text-lg mb-2">No data loaded</div>
                  <div className="text-sm">
                    Use the sidebar to load your data
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
