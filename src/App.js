import React, { useState, useEffect, useMemo } from 'react';
import { ControlPanel, WordStream, Loader, Error } from 'components/core';
import { useFetch } from 'hooks';
import { calcLayers } from 'utils';

export default function App() {
  const [wordsData, setWordsData] = useState(null);
  const [wordStreamProcessing, setwordStreamProcessing] = useState(false);
  const { response, loading, error, post } = useFetch('/get_top_terms');
  const dimensions = useMemo(()=> [1200, 800], []);
  
  useEffect(()=> {
    if(!response) return;
    setwordStreamProcessing(true);
    const layersData = calcLayers({
      data: response,
      screenDimensions: dimensions
    });
    const allWords = [];
    layersData.data.forEach(row=>{
      layersData.fields.forEach(field=>{
          allWords.push(...row.words[field]);
      });
    });
    layersData['allWords'] = allWords;
    setWordsData(layersData);
    setwordStreamProcessing(false);
  }, [response, setWordsData, setwordStreamProcessing, dimensions]);

  return (
    <div
      className={`
        w-screen h-screen
        bg-gray-900
        flex flex-col md:flex-row
      `}
    >
      <div
        className={`
          w-full md:w-1/4 lg:w-1/5 md:h-full
          border border-blue-500
        `}
      >
        <ControlPanel post={post}/>
      </div>
      <div
        className={`
          relative
          flex-1
          text-white
        `}
      >
        { 
          (loading || wordStreamProcessing) ? 
          <>
            <div 
              className={`
                  absolute inset-0
                  h-full w-full
                  bg-gray-600
                  opacity-25
              `}
            />
            <Loader /> 
          </>
          : null 
        }
        { 
          error ? <Error /> :
          wordsData && <WordStream wordsData={wordsData} dimensions={dimensions}/>
        }
      </div>
    </div>
    // <Main />
  )
}
