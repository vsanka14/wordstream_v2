import React from 'react';

const retry = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`
            h-full w-full
            stroke-current
        `}  
        viewBox="0 0 24 24" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3" />
            <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3" />
    </svg>
)

export default retry;