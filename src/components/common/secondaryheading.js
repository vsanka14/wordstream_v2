import React from 'react';

function SecondaryHeading({children}) {
    return (
        <h1 className={`
                text-gray-200 text-xl md:text-2xl lg:text-3xl text-center
                font-semibold tracking-loose 
            `}
        >
            {children}
        </h1>
    )
}

export default SecondaryHeading;