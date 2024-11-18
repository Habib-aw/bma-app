import { Path, Svg } from 'react-native-svg';

export default function Check({ color = '#ffff', width = 30, height = 30 }) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 122.88 122.88"
            xmlSpace="preserve"
            width={width}
            height={height}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M61.438 0c33.938 0 61.442 27.509 61.442 61.442S95.375 122.88 61.438 122.88C27.509 122.88 0 95.376 0 61.442S27.509 0 61.438 0zm.004 43.027c10.17 0 18.413 8.245 18.413 18.416 0 10.17-8.243 18.413-18.413 18.413-10.171 0-18.416-8.243-18.416-18.413 0-10.171 8.245-18.416 18.416-18.416zm-.004-24.638c23.778 0 43.054 19.279 43.054 43.054s-19.275 43.049-43.054 43.049c-23.77 0-43.049-19.274-43.049-43.049s19.279-43.054 43.049-43.054z"
                fill={color}
            />
        </Svg>
    );
}
