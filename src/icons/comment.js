import React from 'react';

const comment = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className={`
            h-full w-full
            stroke-current
        `}
		viewBox="0 0 24 24"
		strokeWidth="2"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" />
		<path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
		<line x1="12" y1="12" x2="12" y2="12.01" />
		<line x1="8" y1="12" x2="8" y2="12.01" />
		<line x1="16" y1="12" x2="16" y2="12.01" />
	</svg>
);

export default comment;
