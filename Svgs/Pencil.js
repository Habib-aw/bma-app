import React from 'react';
import { Svg, Path } from 'react-native-svg';

export default function Pencil({ width = 20, height = 20, color = 'white' }) {
    return (
        <Svg
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 122.88 122.88"
            xmlSpace="preserve"
            enableBackground="new 0 0 122.88 122.88"
            // {...props}
            width={width}
            height={height}
        >
            <Path
                fill={color}
                d="M14.1 0h94.67c7.76 0 14.1 6.35 14.1 14.1v94.67c0 7.75-6.35 14.1-14.1 14.1H14.1c-7.75 0-14.1-6.34-14.1-14.1V14.1C0 6.34 6.34 0 14.1 0zm67.25 28.38L94.1 41.14c1.68 1.68 1.68 4.44 0 6.11l-7.06 7.06-18.87-18.87 7.06-7.06c1.68-1.68 4.43-1.68 6.12 0zm-29.01 60.6c-5.1 1.58-10.21 3.15-15.32 4.74-12.01 3.71-11.95 6.18-8.68-5.37l5.16-18.2-.02-.02L64.6 39.01l18.87 18.87-31.1 31.11-.03-.01zM36.73 73.36l12.39 12.39c-3.35 1.03-6.71 2.06-10.07 3.11-7.88 2.42-7.84 4.05-5.7-3.54l3.38-11.96z"
                fillRule="evenodd"
                clipRule="evenodd"
            />
        </Svg>
    );
}
