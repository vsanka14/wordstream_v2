import { useReducer, useCallback } from "react";
import { getTopTerms } from "../utils/dataLoader";

const initialState = {
  idle: true,
  loading: false,
  error: false,
  response: null,
};

const useStaticDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        idle: false,
        error: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        response: action.payload,
        error: false,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
        response: null,
      };
    default:
      return state;
  }
};

function useStaticData() {
  const [state, dispatch] = useReducer(useStaticDataReducer, initialState);
  const { response, loading, error, idle } = state;

  const post = useCallback(
    (params) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch({
            type: "FETCH_START",
          });

          // Use the static data loader instead of making API call
          const filteredData = await getTopTerms(params);

          console.log("Filtered data:", filteredData);

          dispatch({
            type: "FETCH_SUCCESS",
            payload: filteredData,
          });

          resolve(filteredData);
        } catch (err) {
          console.error("Error in useStaticData:", err);

          dispatch({
            type: "FETCH_ERROR",
            payload: err.message || "Failed to load data",
          });

          reject(err);
        }
      });
    },
    [dispatch]
  );

  return {
    post,
    response,
    loading,
    error,
    idle,
  };
}

export default useStaticData;
