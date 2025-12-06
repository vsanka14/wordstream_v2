// Test file to verify data loading functionality
// Run this in browser console or as a separate test

import { loadCompressedData, getTopTerms } from "./src/utils/dataLoader.js";

// Test loading compressed data
async function testDataLoading() {
  try {
    console.log("Testing data loading...");

    // Test basic data loading
    const rawData = await loadCompressedData("youtube");
    console.log("Raw data loaded:", rawData.length, "items");
    console.log("First item structure:", Object.keys(rawData[0]));

    // Test filtering functionality
    const filteredData = await getTopTerms({
      topic: "youtube",
      noOfTopTerms: "5",
      fields: ["views", "likes"],
    });

    console.log("Filtered data loaded:", filteredData.length, "items");
    console.log("First filtered item:", filteredData[0]);

    return {
      success: true,
      rawCount: rawData.length,
      filteredCount: filteredData.length,
    };
  } catch (error) {
    console.error("Error testing data loading:", error);
    return { success: false, error: error.message };
  }
}

// Export for manual testing
window.testDataLoading = testDataLoading;
