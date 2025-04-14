import { Text } from "@/components/ui/text";
import { useState } from "react";
import { View } from "react-native";

interface Props {
  description: string;
}

export default function CollapsibleDescription(props: Props) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { description } = props;

  return (
    <View>
      {isCollapsed ? (
        <>
          <Text>
            {description.slice(0, 250)}
            {"... "}
            <Text size="xs" onPress={() => setIsCollapsed(false)}>
              See more
            </Text>
          </Text>
        </>
      ) : (
        <>
          <Text>
            {description}{" "}
            <Text size="xs" onPress={() => setIsCollapsed(true)}>
              See Less
            </Text>
          </Text>
        </>
      )}
    </View>
  );
}
