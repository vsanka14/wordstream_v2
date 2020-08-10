import React from 'react';

export default function PrimaryHeading({children}) {
    return (
        <h1 className={`
                text-gray-200 text-xl md:text-2xl lg:text-3xl font-semibold tracking-loose text-center
            `}
        >
            {children}
        </h1>
    )
}