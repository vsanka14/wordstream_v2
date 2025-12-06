import React, { useState } from "react";
import {
  Label,
  Paragraph,
  Button,
  Range,
  IconContainer,
  Select,
  MultiSelect,
} from "components/common";
import { useFormFields, useStaticData } from "hooks";
import { IconPlane } from "icons";
import { selectTopics, calcLayers } from "utils";

function ControlPanel({
  setWordsData,
  setwordStreamProcessing,
  setLoading,
  setError,
  dimensions,
  setRawData,
}) {
  const { topics, topicOptions } = selectTopics;
  const [topic, setTopic] = useState(topics[0]);
  const [options, setOptions] = useState(topicOptions["youtube"]);
  // Initialize with first 2 options by default
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const defaultOptions = [...topicOptions["youtube"]];
    defaultOptions.splice(2);
    return defaultOptions;
  });

  const [fields, handleFieldChange] = useFormFields({
    noOfTerms: "45",
    maxFontSize: "16",
    minFontSize: "10",
  });

  // Process data - called directly with the fields at submission time
  const processData = (responseData, formFields) => {
    setwordStreamProcessing(true);
    setRawData(responseData);

    // Defer heavy computation to next frame to allow UI to update first
    requestAnimationFrame(() => {
      const layersData = calcLayers({
        data: responseData,
        screenDimensions: dimensions,
        maxFontSize: parseInt(formFields.maxFontSize),
        minFontSize: parseInt(formFields.minFontSize),
      });
      const allWords = [];
      layersData.data.forEach((row) => {
        layersData.fields.forEach((field) => {
          allWords.push(...row.words[field]);
        });
      });
      layersData["allWords"] = allWords;
      setWordsData(layersData);
      setwordStreamProcessing(false);
    });
  };

  // Hook with callbacks
  const { post } = useStaticData({
    onError: setError,
    onLoadingChange: setLoading,
  });

  // Handle topic change - direct state update
  const handleTopicChange = (newTopic) => {
    setTopic(newTopic);
    const newOptions = topicOptions[newTopic.value];
    setOptions(newOptions);
    const defaultOptions = [...newOptions];
    defaultOptions.splice(2);
    setSelectedOptions(defaultOptions);
  };

  // Handle form submission - trigger data fetch with callback
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const currentFields = { ...fields }; // Capture fields at submission time

    post({
      topic: topic.value,
      noOfTopTerms: fields.noOfTerms,
      fields: selectedOptions.map((item) => item.value),
    })
      .then((responseData) => {
        // Process data with the captured fields
        processData(responseData, currentFields);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
      });
  };

  return (
    <div className="w-full h-screen p-4">
      <form
        className="w-full h-full flex flex-row md:flex-col flex-wrap justify-between md:justify-evenly items-center"
        onSubmit={handleFormSubmit}
      >
        <div className="w-full md:mb-6">
          <Label labelFor="topics" labelValue="Topics" />
          <Select
            value={topic}
            name="topics"
            options={topics}
            onChange={handleTopicChange}
            className="text-xs md:text-base my-2"
          />
        </div>
        <div className="w-full md:mb-6">
          <Label labelFor="options" labelValue="Options" />
          <MultiSelect
            name="options"
            options={options}
            value={selectedOptions}
            onChange={(options) => setSelectedOptions(options)}
            className="text-xs md:text-base my-2"
          />
        </div>
        <div className="w-5/12 md:w-full md:mb-6">
          <div className="flex items-center justify-between my-2">
            <Label labelFor="noOfTerms" labelValue="Terms" />
            <Paragraph className="text-gray-300">
              {" "}
              {fields.noOfTerms}{" "}
            </Paragraph>
          </div>
          <Range
            name="noOfTerms"
            handleChange={handleFieldChange}
            value={fields.noOfTerms}
            min="0"
            max="100"
          />
        </div>
        <div className="w-5/12 md:w-full md:mb-6">
          <div className="flex items-center justify-between my-2">
            <Label labelFor="maxFontSize" labelValue="Max Font Size" />
            <Paragraph className="text-gray-300">
              {" "}
              {fields.maxFontSize} px{" "}
            </Paragraph>
          </div>
          <Range
            name="maxFontSize"
            handleChange={handleFieldChange}
            value={fields.maxFontSize}
            min="0"
            max="100"
          />
        </div>
        <div className="w-5/12 md:w-full md:mb-6">
          <div className="flex items-center justify-between my-2">
            <Label labelFor="minFontSize" labelValue="Min Font Size" />
            <Paragraph className="text-gray-300">
              {fields.minFontSize} px
            </Paragraph>
          </div>
          <Range
            name="minFontSize"
            handleChange={handleFieldChange}
            value={fields.minFontSize}
            min="0"
            max="100"
          />
        </div>
        <Button
          color="blue"
          disabled={selectedOptions ? false : true}
          type="submit"
        >
          <IconContainer>
            <IconPlane />
          </IconContainer>
          &nbsp;
          <Paragraph> Submit </Paragraph>
        </Button>
      </form>
    </div>
  );
}

export default ControlPanel;
