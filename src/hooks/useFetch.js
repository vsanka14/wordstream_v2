import { useReducer, useCallback } from 'react';

const defaults = {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};


const initialState = {
    idle: true,
    loading: false,
    error: false,
    response: null
}

const useFetchReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'FETCH_START':
            return {
                ...state,
                loading: true,
                idle: false
            }
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                response: action.payload,
                error: false
            }
        case 'FETCH_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            }
        default:
            return state;
    }
};

function useFetch (url) {
    const [state, dispatch] = useReducer(useFetchReducer, initialState);
    const {response, loading, error, idle} = state;

    const api = useCallback((method, data) => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: 'FETCH_START'
            });
            fetch(`${defaults.baseUrl}${url}`, {
                method,
                headers: defaults.headers,
                body: method !== 'get' ? JSON.stringify(data) : undefined
            })
            .then(resp=>resp.json())
            .then(json=>{
                console.log(json);
                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: json
                });
                resolve(json);
            })
            .catch(err=>{
                dispatch({
                    type: 'FETCH_ERROR',
                    payload: err
                });
                reject(err);
            })
        });
    }, [url, dispatch]);

    return {
        get: (...args) => api('GET', ...args),
        post: (...args) => api('POST', ...args),
        put: (...args) => api('PUT', ...args),
        patch: (...args) => api('PATCH', ...args),
        delete: (...args) => api('DELETE', ...args),
        response,
        loading,
        error,
        idle
    } 
}


export default useFetch;