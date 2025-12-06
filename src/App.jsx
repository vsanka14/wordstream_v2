import React, { useState, useMemo, useRef } from "react";
import { ControlPanel, WordStream, BarChart, Details } from "components/core";
import { Loader, Error, Tooltip } from "components/common";
import { IconMenu, IconInfo } from "icons";
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
  const closeDetailView = () => {
    setDisplayBarChart(false);
    setClearBrush(true);
  };

  // Callback to handle subgraph data and set initial details
  const handleSubGraphData = (data) => {
    setSubGraphData(data);
    if (data && data.length > 0) {
      setDetailsData(data[0]);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row relative">
      {/* Sidebar Toggle Button - positioned absolutely at top-left of viewport */}
      <div className="fixed top-2 left-2 z-40 w-12 h-12">
        <button
          className="w-full h-full text-gray-300 hover:text-white rounded-lg focus:outline-none transition-all duration-200 ease-in-out flex items-center justify-center"
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
          "bg-gray-900 shadow-lg overflow-hidden border-r border-gray-800",
          "w-3/4 md:w-1/4 lg:w-1/5"
        )}
        style={{
          transform: sidebarCollapsed
            ? "translate3d(-100%, 0, 0)"
            : "translate3d(0, 0, 0)",
          WebkitTransform: sidebarCollapsed
            ? "translate3d(-100%, 0, 0)"
            : "translate3d(0, 0, 0)",
          transition: "transform 400ms cubic-bezier(0.4, 0.0, 0.2, 1)",
          WebkitTransition:
            "-webkit-transform 400ms cubic-bezier(0.4, 0.0, 0.2, 1)",
          willChange: "transform",
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
          transition: "opacity 400ms cubic-bezier(0.4, 0.0, 0.2, 1)",
          willChange: "opacity",
        }}
        onClick={() => setSidebarCollapsed(true)}
      />

      {/* Main Content */}
      <div
        className="relative text-white flex-1 min-h-screen w-full"
        style={{
          marginLeft: !sidebarCollapsed ? "20%" : "3.5rem",
          transition: "margin-left 400ms cubic-bezier(0.4, 0.0, 0.2, 1)",
          willChange: "margin-left",
        }}
      >
        {loading || wordStreamProcessing ? (
          <>
            <div className="absolute inset-0 h-full w-full bg-black opacity-50" />
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
                  className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded ${
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
                  className="w-full relative"
                  style={{
                    height: displayBarChart ? "65%" : "100%",
                    transition: "height 400ms cubic-bezier(0.4, 0.0, 0.2, 1)",
                    willChange: displayBarChart ? "height" : "auto",
                  }}
                >
                  <WordStream
                    displayBarChart={displayBarChart}
                    setSubGraphData={handleSubGraphData}
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
                <div
                  className="w-full flex flex-col md:flex-row border-t-2 border-gray-700 bg-gray-900 bg-opacity-95 rounded-lg mr-12 overflow-hidden"
                  style={{
                    height: displayBarChart ? "35%" : "0%",
                    minHeight: displayBarChart ? "180px" : "0",
                    opacity: displayBarChart ? 1 : 0,
                    marginLeft: sidebarCollapsed ? "0" : "3rem",
                    transition:
                      "height 400ms cubic-bezier(0.4, 0.0, 0.2, 1), opacity 400ms cubic-bezier(0.4, 0.0, 0.2, 1), min-height 400ms cubic-bezier(0.4, 0.0, 0.2, 1), margin-left 400ms cubic-bezier(0.4, 0.0, 0.2, 1)",
                    willChange: displayBarChart ? "height, opacity" : "auto",
                    pointerEvents: displayBarChart ? "auto" : "none",
                  }}
                >
                  <div className="w-full md:w-1/2 h-full p-2">
                    {subGraphData && (
                      <BarChart
                        data={subGraphData}
                        wordsData={wordsData}
                        brushRange={brushRange}
                        setDetailsData={setDetailsData}
                        detailsData={detailsData}
                        onClose={closeDetailView}
                      />
                    )}
                  </div>
                  <div className="w-full md:w-1/2 h-full p-2">
                    {detailsData && <Details data={detailsData} />}
                  </div>
                </div>
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
