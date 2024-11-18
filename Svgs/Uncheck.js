import { Path, Svg } from 'react-native-svg';

export default function BellOn({ color = '#ffff', width = 30, height = 30 }) {
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
                d="M61.438 0C95.37 0 122.88 27.51 122.88 61.441S95.37 122.88 61.438 122.88C27.509 122.88 0 95.373 0 61.441S27.509 0 61.438 0zm0 18.382c23.781 0 43.06 19.278 43.06 43.06s-19.278 43.057-43.06 43.057c-23.779 0-43.057-19.275-43.057-43.057s19.279-43.06 43.057-43.06z"
                fill={color}
            />
        </Svg>
    );
}
