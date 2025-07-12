import { G, Rect, Text as SvgText } from "react-native-svg";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { BadgeType, Book, BookStatus } from "@/models/book";
import useStore from "@/store";
import { getGenreChartData } from "@/utils/books";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { PieChart, pieDataItem, BarChart } from "react-native-gifted-charts";
import { scale } from "@/utils/scale";
import Badge from "@/components/Badge";

export default function State() {
  const { cases, badges } = useStore();

  const allBooks = useMemo(() => {
    const books = cases.reduce((acc, bookCase) => {
      return [...acc, ...bookCase.books];
    }, [] as Book[]);
    const uniqueBooks = books.filter(
      (book, index, self) => self.findIndex((b) => b.key === book.key) === index
    );

    return uniqueBooks;
  }, [cases]);

  const pieChartGenreData = useMemo(() => {
    return getGenreChartData(allBooks).map((item) => ({
      value: item.value,
      text: item.label,
      textColor: "#000",
    })) as pieDataItem[];
  }, [allBooks]);

  const bookStatuses = useMemo(() => {
    // aggregate the statuses of all books
    const statusCount: Record<BookStatus, number> = {
      [BookStatus.TBR]: 0,
      [BookStatus.FINISHED]: 0,
      [BookStatus.READING]: 0,
    };

    allBooks.forEach((book) => {
      statusCount[book.status] += 1;
    });

    return statusCount;
  }, [allBooks]);

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 100,
      }}
      className="p-3 mt-5"
    >
      <Heading>Badges</Heading>
      <Text className="text-sm text-gray-500 mb-2">
        Your achievements and badges earned in the app.
      </Text>
      <View className="flex flex-row flex-wrap">
        {Object.values(BadgeType).map((badgeType) => (
          <View className="p-2" key={badgeType}>
            <Badge
              key={badgeType}
              type={badgeType}
              progress={badges.find((b) => b.type === badgeType)?.progress || 0}
              width={scale(150)}
              height={scale(150)}
            />
          </View>
        ))}
      </View>
      <View className="h-5" />
      <Heading>Book Genres</Heading>
      <Text className="text-sm text-gray-500 mb-2">
        The distribution of genres in all books in your collection.
      </Text>
      <View className="h-5" />
      <View className="flex flex-col items-center justify-center">
        <PieChart
          data={pieChartGenreData}
          innerRadius={80}
          radius={scale(100)}
          isAnimated
          animationDuration={500}
          donut
          shadow
          showExternalLabels
          paddingHorizontal={30}
          externalLabelComponent={(item) => (
            <SvgText fontSize={12} fontFamily="Arial">
              {item?.text}
            </SvgText>
          )}
          labelLineConfig={{
            avoidOverlappingOfLabels: true,
            labelComponentWidth: 40,
            labelComponentHeight: 10,
            labelComponentMargin: 5,
            length: 10,
            tailLength: 9,
          }}
        />
      </View>
      <View className="h-5" />
      <Heading>Book Statuses</Heading>
      <Text className="text-sm text-gray-500 mb-2">
        Shows the distribution of book statuses in your collection.
      </Text>
      <View className="h-5" />
      <BarChart
        isAnimated
        animationDuration={500}
        data={[
          {
            value: bookStatuses[BookStatus.TBR],
            label: "TBR",
            frontColor: "#4CAF50",
          },
          {
            value: bookStatuses[BookStatus.FINISHED],
            label: "Finished",
            frontColor: "#2196F3",
          },
          {
            value: bookStatuses[BookStatus.READING],
            label: "Reading",
            frontColor: "#FF9800",
          },
        ]}
        barWidth={50}
        spacing={20}
      />
    </ScrollView>
  );
}
