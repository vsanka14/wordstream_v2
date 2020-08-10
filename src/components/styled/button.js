import React from 'react';

export default function Button({color, children, onClick, disabled, type}) {
    console.log(disabled);
    return (
        <button 
            className={`
                w-full h-auto
                bg-green-500 hover:bg-green-700
                py-3 px-4 
                focus:outline-none focus:shadow-outline
                inline-flex justify-center items-center
                text-white text-sm md:text-base font-bold
                transition-all duration-150 ease-in-out
                cursor-pointer
                rounded
                ${disabled ? 'cursor-not-allowed opacity-75' : null}
            `} 
            onClick={onClick} 
            disabled={disabled}
            type={type} 
        > 
            {children}
        </button>
    )
}