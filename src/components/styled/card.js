import React from 'react';
import { Paragraph } from '.';

function Card({color, icon, data}) {
    return (
        <div
            className={`
                w-full h-full
                px-2 py-5
            `}
        >
            <div
                className={`
                    w-full h-full
                    text-gray-100
                    flex flex-col justify-center items-center
                    bg-${color}-500
                `}
            >
                <div
                    className={`
                        w-16 h-16
                    `}
                >
                    {icon()}
                </div>
                <Paragraph>
                    <span className={`
                        font-semibold
                    `}>
                        {data} 
                    </span>
                </Paragraph>
            </div>
        </div>
    )
}

export default Card;