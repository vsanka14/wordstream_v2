import React from 'react';
import { SecondaryHeading } from 'components/styled';
import { IconBug } from 'icons';

function Loader() {
   return (
        <div
            className={`
                h-full w-full
                flex justify-center items-center
            `}
        >
            <div className={`
                w-12 h-12 
                text-red-400
            `}>
                <IconBug />
            </div>
            <SecondaryHeading> Something went wrong. </SecondaryHeading>
        </div>
    )
}

export default Loader;