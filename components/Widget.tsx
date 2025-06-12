import { Widget } from "@/models/book";
import CachedImage from "./ChachedImage";

interface Props {
  widget: Widget & { width: number; height: number };
}

const CachedWidget = (props: Props) => {
  const { widget } = props;
  const { width, height } = widget;

  if (!widget?.cacheKey) {
    return null;
  }

  return (
    <CachedImage
      source={{
        uri: "",
      }}
      cacheKey={widget.cacheKey}
      style={{
        width: width,
        height: height,
        borderRadius: 1,
      }}
    />
  );
};

export default CachedWidget;
