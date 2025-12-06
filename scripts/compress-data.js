const fs = require("fs");
const pako = require("pako");
const path = require("path");

// List of JSON files to compress
const jsonFiles = [
  {
    input: "youtube_py.json",
    output: "public/data/youtube.json.gz",
  },
  {
    input: "data_by_NOC.json",
    output: "public/data/olympicsByCountries.json.gz",
  },
  {
    input: "data_by_Sport.json",
    output: "public/data/olympicsBySports.json.gz",
  },
];

// Create public/data directory if it doesn't exist
const dataDir = path.join(__dirname, "..", "public", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

jsonFiles.forEach(({ input, output }) => {
  const inputPath = path.join(__dirname, "..", input);
  const outputPath = path.join(__dirname, "..", output);

  try {
    console.log(`Processing ${input}...`);

    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.warn(`Warning: ${input} not found. Skipping...`);
      return;
    }

    // Read the original JSON file
    const jsonData = fs.readFileSync(inputPath, "utf8");

    // Compress using gzip
    const compressed = pako.gzip(jsonData);

    // Write compressed file
    fs.writeFileSync(outputPath, compressed);

    const originalSize = jsonData.length;
    const compressedSize = compressed.length;
    const compressionRatio = (
      (1 - compressedSize / originalSize) *
      100
    ).toFixed(2);

    console.log(`✓ ${input} compressed successfully:`);
    console.log(
      `  Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(
      `  Compressed size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(`  Compression ratio: ${compressionRatio}%`);
    console.log(`  Output: ${output}`);
    console.log("");
  } catch (error) {
    console.error(`Error processing ${input}:`, error.message);
  }
});

console.log("Compression complete!");
