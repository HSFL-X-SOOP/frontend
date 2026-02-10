import {
    YStack,
    Image,
    View
} from 'tamagui';
import { useCallback, useState } from 'react';
import Carousel from 'react-native-reanimated-carousel'

interface ParentSizeCarouselProps {
    items?: { [key: string]: any };
    itemsLabels?: string[];
    interval?: number;
}

export function ParentSizeCarousel(props: ParentSizeCarouselProps) {
    const [size, setSize] = useState({ width: 0, height: 0 })

    const onLayout = useCallback((e: any) => {
        const { width, height } = e.nativeEvent.layout

        const w = Math.round(width)
        const h = Math.round(height)

        setSize((prev) =>
        prev.width === w && prev.height === h ? prev : { width: w, height: h }
        )
    }, [])

  return (
    <YStack
      width="100%"
      height="100%"
      minHeight={200}
      onLayout={onLayout}
    >
      {size.width > 0 && size.height > 0 && (
        <Carousel
          width={size.width}
          height={size.height}
          data={props.itemsLabels || []}
          loop
          autoPlay
          autoPlayInterval={props.interval ?? 4000}
          renderItem={({ item }) => (
            <Image
                source={props.items ? props.items[item] : undefined}
                style={{ width: size.width, height: size.height, objectFit: 'contain' }}
                resizeMode="contain"
            />
          )}
        />
      )}
    </YStack>
  )
}