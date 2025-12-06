import React, { useState, useMemo, useEffect } from "react";
import { ControlPanel, WordStream, BarChart, Details } from "components/core";
import { IconContainer, Button, Loader, Error } from "components/common";
import { IconX, IconMenu } from "icons";
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
  const dimensions = useMemo(() => [1200, 800], []);

  useEffect(() => {
    if (!subGraphData) return;
    setDetailsData(subGraphData[0]);
  }, [subGraphData, setDetailsData]);

  return (
    <div className="w-screen h-screen flex flex-col md:flex-row relative">
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

      {/* Sidebar */}
      <div
        className={cx(
          "absolute md:relative z-20",
          "md:h-full transition-all duration-300 ease-in-out",
          "bg-gray-800 shadow-lg",
          {
            // Mobile styles
            "w-3/4 h-full": !sidebarCollapsed,
            "w-0 h-0 overflow-hidden": sidebarCollapsed,
            // Desktop styles
            "md:w-1/4 lg:w-1/5": !sidebarCollapsed,
            "md:w-0 md:overflow-hidden": sidebarCollapsed,
          }
        )}
      >
        <ControlPanel
          setRawData={setRawData}
          setWordsData={setWordsData}
          setwordStreamProcessing={setwordStreamProcessing}
          setLoading={setLoading}
          setError={setError}
          dimensions={dimensions}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {!sidebarCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div className="relative text-white transition-all duration-300 ease-in-out flex-1 md:h-full w-full h-full">
        {loading || wordStreamProcessing ? (
          <>
            <div className="absolute inset-0 h-full w-full bg-gray-600 opacity-25" />
            <Loader />
          </>
        ) : null}
        {error ? (
          <Error />
        ) : (
          wordsData && (
            <div className="w-full h-full flex flex-col justify-center items-center">
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
                <div
                  className={cx(
                    "absolute",
                    "inset-x-0 top-0",
                    "w-full",
                    "flex justify-start md:justify-end items-center",
                    "pt-20", // Add padding to avoid overlap with toggle button
                    {
                      visible: displayBarChart,
                      invisible: !displayBarChart,
                    }
                  )}
                >
                  {displayBarChart && (
                    <div className="w-12 h-6">
                      <Button
                        color="red"
                        onClick={() => {
                          setDisplayBarChart(false);
                          setClearBrush(true);
                        }}
                      >
                        <IconContainer>
                          {" "}
                          <IconX> </IconX>{" "}
                        </IconContainer>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {displayBarChart ? (
                <div
                  className="w-full flex flex-col md:flex-row"
                  style={{
                    height: "50%",
                  }}
                >
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
          )
        )}
      </div>
    </div>
  );
}
