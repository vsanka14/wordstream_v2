import React from 'react';

const verify = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"  
        className={`
            h-full w-full
            stroke-current
        `} 
        viewBox="0 0 24 24" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M0 0h24v24H0z" stroke="none"/>
            <path d="M14 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h7a2 2 0 002-2v-2"/>
            <path d="M20 12H7l3-3m0 6l-3-3"/>
    </svg> 
)

export default verify;