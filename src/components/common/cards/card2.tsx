import { View } from "react-native"; 
import { Card } from "../../ui/card";
import { Text } from "../../ui/text";

interface Card2Props {
  children?: React.ReactNode;
  title?: string;
  graphic?: React.ReactNode;
  description?: string;
  backgroundColor?: string;
}

function Card2({ 
  title, 
  graphic, 
  description, 
  backgroundColor = "#ffffff"
}: Card2Props) {
  return (
    <View >
      <Card variant="elevated" color={backgroundColor}>
      <Text size="md" type="blackText" align="center" >{title}</Text>
      {graphic}
      <Text size="xs" type="blackText" align="center" >{description}</Text>
    </Card>
  </View>
  );
}

export default Card2;