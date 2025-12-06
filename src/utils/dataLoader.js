import pako from "pako";

// Cache for loaded data to avoid reloading
const dataCache = {};

/**
 * Load and decompress data from a compressed JSON file
 * @param {string} topic - The topic to load data for
 * @returns {Promise<Object>} - The decompressed JSON data
 */
export const loadCompressedData = async (topic) => {
  // Return cached data if available
  if (dataCache[topic]) {
    return dataCache[topic];
  }

  // Map topic names to file paths
  const fileMap = {
    youtube: "/data/youtube.json.gz",
    olympicsByCountries: "/data/olympicsByCountries.json.gz",
    olympicsBySports: "/data/olympicsBySports.json.gz",
  };

  const filePath = fileMap[topic];
  if (!filePath) {
    throw new Error(`Unknown topic: ${topic}`);
  }

  try {
    // Fetch the compressed file
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    // Decompress the data
    const decompressed = pako.ungzip(new Uint8Array(arrayBuffer), {
      to: "string",
    });

    // Parse JSON and cache it
    const data = JSON.parse(decompressed);
    dataCache[topic] = data;

    return data;
  } catch (error) {
    console.error(`Error loading compressed data for ${topic}:`, error);
    throw error;
  }
};

/**
 * Filter data based on parameters - replicates the backend filtering logic
 * @param {Array} data - The raw data array
 * @param {Object} filters - The filter parameters
 * @param {string} filters.topic - The topic name
 * @param {string|number} filters.noOfTopTerms - Number of top terms to keep
 * @param {Array<string>} filters.fields - Fields to include
 * @returns {Array} - The filtered data
 */
export const filterData = (data, filters) => {
  const { noOfTopTerms, fields } = filters;

  // Create a deep copy of the data to avoid mutating the original
  const filteredData = JSON.parse(JSON.stringify(data));

  // Apply the same filtering logic as the backend
  filteredData.forEach((item) => {
    if (item.words && typeof item.words === "object") {
      Object.keys(item.words).forEach((topic) => {
        if (fields.includes(topic)) {
          // Keep only the top N terms by splicing the array
          if (item.words[topic] && Array.isArray(item.words[topic])) {
            item.words[topic].splice(parseInt(noOfTopTerms));
          }
        } else {
          // Delete topics not in the selected fields
          delete item.words[topic];
        }
      });
    }
  });

  return filteredData;
};

/**
 * Load and filter data in one step - main function to replace backend API
 * @param {Object} params - The request parameters
 * @param {string} params.topic - The topic to load
 * @param {string|number} params.noOfTopTerms - Number of top terms
 * @param {Array<string>} params.fields - Fields to include
 * @returns {Promise<Array>} - The filtered data
 */
export const getTopTerms = async (params) => {
  try {
    // Load the raw data for the topic
    const rawData = await loadCompressedData(params.topic);

    // Filter the data using the same logic as the backend
    const filteredData = filterData(rawData, params);

    return filteredData;
  } catch (error) {
    console.error("Error in getTopTerms:", error);
    throw error;
  }
};
