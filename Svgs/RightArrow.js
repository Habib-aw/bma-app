import { Path, Svg } from "react-native-svg";

export default function RightArrow({
    color = "#ffff",
    width = 40,
    height = 40,
}) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 354 511.51"
            width={width}
            height={height}
        >
            <Path
                fill={color}
                fill-rule="evenodd"
                d="m3.35 393.83 129.62-138.08L3.35 117.67c-4.67-4.96-4.43-12.76.53-17.43l100.74-96.8c4.9-4.72 12.71-4.56 17.43.34l228.6 243.52c4.49 4.77 4.44 12.19 0 16.9L122.14 507.63c-4.66 4.96-12.47 5.19-17.43.53L3.79 411.17c-4.88-4.69-5.06-12.42-.44-17.34zM158.87 264.2 29.66 401.84l83.05 79.8 212.04-225.89L112.71 29.86l-83.05 79.8L158.87 247.3c4.43 4.71 4.49 12.12 0 16.9z"
            />
        </Svg>
    );
}
