import { Input, InputField } from "@/components/ui/input";

function BookReviewTextBox() {
  return (
    <Input
      variant="outline"
      size="md"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
    >
      <InputField placeholder="Enter Text here..." />
    </Input>
  );
}
