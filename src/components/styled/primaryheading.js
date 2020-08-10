import React from 'react';

export default function PrimaryHeading({children}) {
    return (
        <h1 className={`
                text-gray-200 text-2xl md:text-3xl lg:text-4xl font-bold tracking-loose
            `}
        >
            {children}
        </h1>
    )
}