import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Label,
  Paragraph,
  Button,
  Range,
  IconContainer,
} from "components/common";
import Select from "react-select";
import { useFormFields, useFetch } from "hooks";
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
  const [selectedOptions, setSelectedOptions] = useState(null);
  const { response, loading, error, post } = useFetch("/get_top_terms");
  const canCalcLayers = useRef(false);

  useEffect(() => {
    setOptions(topicOptions[topic.value]);
    const defaultOptions = [...topicOptions[topic.value]];
    defaultOptions.splice(2);
    setSelectedOptions(defaultOptions);
  }, [topic, setOptions, topicOptions]);

  const [fields, handleFieldChange] = useFormFields({
    noOfTerms: "45",
    maxFontSize: "16",
    minFontSize: "10",
  });

  useEffect(() => {
    canCalcLayers.current = false;
  }, [fields, canCalcLayers]);

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();
      post({
        topic: topic.value,
        noOfTopTerms: fields.noOfTerms,
        fields: selectedOptions.map((item) => item.value),
      });
      canCalcLayers.current = true;
    },
    [topic, post, selectedOptions, fields, canCalcLayers]
  );

  useEffect(() => {
    if (!response || !canCalcLayers.current) return;
    setwordStreamProcessing(true);
    setRawData(response);
    const layersData = calcLayers({
      data: response,
      screenDimensions: dimensions,
      maxFontSize: parseInt(fields.maxFontSize),
      minFontSize: parseInt(fields.minFontSize),
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
  }, [
    response,
    setWordsData,
    setRawData,
    setwordStreamProcessing,
    dimensions,
    fields,
    canCalcLayers,
  ]);

  useEffect(() => {
    setLoading(loading);
    setError(error);
  }, [loading, error, setLoading, setError]);

  return (
    <div
      className={`
				w-full h-full
				p-4
			`}
    >
      <form
        className={`
					w-full h-full 
					flex flex-row md:flex-col flex-wrap justify-between md:justify-evenly items-center
				`}
        onSubmit={handleFormSubmit}
      >
        <div
          className={`
						w-full
						md:mb-6
					`}
        >
          <Label labelFor="topics" labelValue="Topics" />
          <Select
            value={topic}
            name="topics"
            options={topics}
            onChange={(topic) => setTopic(topic)}
            className={`
							basic-multi-select 
							cursor-pointer 
							text-xs md:text-base my-2
						`}
            classNamePrefix="select"
          />
        </div>
        <div
          className={`
						w-full
						md:mb-6
					`}
        >
          <Label labelFor="options" labelValue="Options" />
          <Select
            isMulti
            name="options"
            options={options}
            value={selectedOptions}
            onChange={(options) => setSelectedOptions(options)}
            className={`
							basic-multi-select 
							cursor-pointer 
							text-xs md:text-base my-2
						`}
            classNamePrefix="select"
          />
        </div>
        <div
          className={`
						w-5/12 md:w-full
						md:mb-6
					`}
        >
          <div
            className={`
							flex items-center justify-between 
							my-2
						`}
          >
            <Label labelFor="noOfTerms" labelValue="Terms" />
            <Paragraph className="text-gray-100">
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
        <div
          className={`
						w-5/12 md:w-full
						md:mb-6
					`}
        >
          <div
            className={`
							flex items-center justify-between 
							my-2
						`}
          >
            <Label labelFor="maxFontSize" labelValue="Max Font Size" />
            <Paragraph className="text-gray-100">
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
        <div
          className={`
						w-5/12 md:w-full
						md:mb-6
					`}
        >
          <div
            className={`
							flex items-center justify-between 
							my-2
						`}
          >
            <Label labelFor="minFontSize" labelValue="Min Font Size" />
            <Paragraph className="text-gray-100">
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
          color="green"
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
