import { useMemo } from "react";
import { View } from "tamagui"
import { Thermometer } from "../thermometer";
import { Bubbles } from "../bubbles/bubbles";
import { BodyText } from "../measurementCard/bodyText"
import { Card } from "../measurementCard/card";
import { labelForWaterTemperature } from "./tileConfig";
import { zoneForWaterTemperature } from "./tileConfig";
import { useTranslation } from "@/hooks/ui/useTranslation";
type Props = {
  temperatureC: number;
  width?: number;
  height?: number;
};

export function WaterTemperatureTile({
  temperatureC,
  width = 360,
  height = 250,
}: Props) {
  const {t} = useTranslation('sensors');
  const zone = useMemo(() => zoneForWaterTemperature(temperatureC), [temperatureC]);
  const body = (
    <View flex={1} flexDirection="row" marginTop={10} alignItems="center">      
      <Thermometer temperatureC={temperatureC} width={120} height={180} minC={-10} maxC={40}/>
      <BodyText bodyText={`${temperatureC}°C`} bodyHelperText={labelForWaterTemperature(zone, t)} bodyStyle={{ marginTop: 0 }}/>
      <Bubbles waterHeight={100}/>
    </View>
  )

  return (
    <Card 
      title={t("sensors.waterTemperature")}
      value={temperatureC}
      metric={"°C"}
      body={body}
      width={width}
      height={height}
    />
  );
}