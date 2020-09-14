import React from 'react';

export default function Button({ color, children, onClick, disabled, type }) {
    const colors = { 
        green: 'bg-green-500',
        red: 'bg-red-500'
    }
    const hoverColors = { 
        green: 'hover:bg-green-700',
        red: 'hover:bg-red-700'
    }

	return (
		<button
			className={`
                w-full h-auto
                ${colors[color]} ${hoverColors[color]}
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
	);
}
