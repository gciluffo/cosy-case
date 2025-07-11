import { G, Rect, Text as SvgText } from "react-native-svg";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Book, BookStatus } from "@/models/book";
import useStore from "@/store";
import { getGenreChartData } from "@/utils/books";
import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import { PieChart, pieDataItem, BarChart } from "react-native-gifted-charts";

export default function State() {
  const { cases, user, updateUser } = useStore();

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
      <View className="h-5" />
      <Heading>Book Genres</Heading>
      <Text className="text-sm text-gray-500 mb-2">
        The distribution of genres in all books in your collection.
      </Text>
      <View className="h-5" />
      <View className="flex flex-col items-center justify-center">
        <PieChart
          data={pieChartGenreData}
          innerRadius={90}
          radius={130}
          donut
          shadow
          showExternalLabels
          paddingHorizontal={10}
          externalLabelComponent={(item) => (
            <SvgText fontSize={12} fontFamily="Arial">
              {item?.text}
            </SvgText>
          )}
          labelLineConfig={{
            avoidOverlappingOfLabels: true,
            labelComponentWidth: 30,
            labelComponentMargin: 10,
            length: 5,
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
        data={[
          { value: bookStatuses[BookStatus.TBR], label: "TBR" },
          { value: bookStatuses[BookStatus.FINISHED], label: "Finished" },
          { value: bookStatuses[BookStatus.READING], label: "Reading" },
        ]}
        barWidth={50}
        spacing={20}
      />
    </ScrollView>
  );
}
