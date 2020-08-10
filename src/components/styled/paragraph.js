import React from 'react';

export default function Paragraph({children}) {
    return (
        <p className={`
                block 
                text-gray-200 text-xs md:text-base 
            `}
        
        >
            {children}
        </p>
    )
}