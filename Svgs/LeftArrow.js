import { Path, Svg } from "react-native-svg";

export default function LeftArrow({
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
                d="M350.65 117.68 221.03 255.76l129.62 138.08c4.67 4.96 4.43 12.76-.53 17.43l-100.74 96.79c-4.9 4.72-12.71 4.57-17.43-.33L3.35 264.21c-4.49-4.78-4.44-12.19 0-16.9L231.86 3.88c4.66-4.96 12.47-5.2 17.43-.53l100.92 96.99c4.88 4.69 5.06 12.42.44 17.34zM195.13 247.31l129.21-137.64-83.05-79.8L29.25 255.76l212.04 225.89 83.05-79.8-129.21-137.64c-4.43-4.71-4.49-12.12 0-16.9z"
            />
        </Svg>
    );
}
