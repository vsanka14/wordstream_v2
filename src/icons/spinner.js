import React from 'react';

const spinner = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`
            spin-animation 
            h-full w-full
            stroke-current
        `}   
        viewBox="0 0 24 24" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z"/>
            <path d="M15 4.55a8 8 0 0 0 -6 14.9m0 -4.45v5h-5" />
            <path d="M13 19.95a8 8 0 0 0 5.3 -12.8" strokeDasharray=".001 4.13" />
    </svg>
)

export default spinner;

