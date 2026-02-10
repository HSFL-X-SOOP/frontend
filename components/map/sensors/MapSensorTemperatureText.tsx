import {LocationWithBoxes, BoxType} from "@/api/models/sensor";
import {SensorMarkerSvg} from "../markers/SensorMarkerSvg";
import {useThemeContext} from "@/context/ThemeSwitch.tsx";

type SensorMarkerContentProps = {
    locationWithBoxes: LocationWithBoxes
    metricToShow: string
}

export const SensorMarkerContent: React.FC<SensorMarkerContentProps> = ({locationWithBoxes, metricToShow}) => {
    const {isDark} = useThemeContext();
    const box = locationWithBoxes.boxes.find(box =>
        box.type === BoxType.WaterBox ||
        box.type === BoxType.WaterTemperatureOnlyBox ||
        box.type === BoxType.AirBox
    );

    let valueToShow: string | number = "--";
    let metricSymbol: string = "";
    //const temperature = valueToShow !== undefined ? Math.round(Number(valueToShow)) : "--";
    console.log(metricToShow)
    switch (metricToShow) {
        case "Temperature":
            if (box?.type === BoxType.AirBox) {
                valueToShow = box.measurementTimes.find(measurement => measurement.measurements.airTemperature)?.measurements.airTemperature ?? "--";
            } else {
                valueToShow = box?.measurementTimes.find(measurement => measurement.measurements.waterTemperature)?.measurements.waterTemperature ?? "--";
            }
            console.log("Raw value to show for temperature:", valueToShow);
            metricSymbol = "°C";
            break;
        case "Waterlevel":
            if (box?.type === BoxType.WaterBox) {
                valueToShow = box.measurementTimes.find(measurement => measurement.measurements.tide)?.measurements.tide ?? "--";
                metricSymbol = "cm";
            }
            break;
        case "WaveHeight":
            if (box?.type === BoxType.WaterBox) {
                valueToShow = box.measurementTimes.find(measurement => measurement.measurements.waveHeight)?.measurements.waveHeight ?? "--";
                metricSymbol = "cm";
            }
            break;
    }
    console.log("Value to show for metric", metricToShow, ":", valueToShow);
    if (valueToShow !== "--") {
        valueToShow = Math.round(Number(valueToShow));
    }

    const accentColor = !isDark ? '#006e99' : 'rgb(91,138,246)';
    const backgroundColor = isDark ? 'rgba(237,245,253,0.9)' : '#1c1c1c';
    const textColor = isDark ? '#010107' : 'white';

    const getIndicatorColor = (boxType?: string): string => {
        switch (boxType) {
            case BoxType.WaterBox:
                return '#0052ff';
            case BoxType.WaterTemperatureOnlyBox:
                return '#d900ff';
            case BoxType.AirBox:
                return '#ff9a00';
            default:
                return '#90CAF9';
        }
    };

    return (
        <SensorMarkerSvg
            value={valueToShow}
            metricSymbol={metricSymbol}
            accentColor={accentColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
            indicatorColor={getIndicatorColor(box?.type)}
            enableAnimations={true}
        />
    );
}
