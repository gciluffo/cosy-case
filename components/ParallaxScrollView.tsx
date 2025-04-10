import { View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";

interface Props {
  parallaxHeaderContent: () => React.ReactNode;
  parallaxHeaderHeight: number;
  children: React.ReactNode;
  onContentSizeChange?: (w: number, h: number) => void;
}

const ParallaxScrollView = (props: Props) => {
  const { parallaxHeaderContent, parallaxHeaderHeight, children, ...rest } =
    props;
  const scrollRef = useAnimatedRef();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-parallaxHeaderHeight, 0, parallaxHeaderHeight],
            [-parallaxHeaderHeight / 2, 0, parallaxHeaderHeight * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-parallaxHeaderHeight, 0, parallaxHeaderHeight],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16} {...rest}>
      <Animated.View style={[imageAnimatedStyle]}>
        {parallaxHeaderContent()}
      </Animated.View>
      {children}
    </Animated.ScrollView>
  );
};

export default ParallaxScrollView;
