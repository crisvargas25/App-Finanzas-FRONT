import { View } from "react-native";
import {Text} from "../../../shared/ui/text";
import OutlinedButton from "../buttons/outlinedButton";

interface HeaderProps {
  children?: React.ReactNode;
  title?: string;
  button?: React.ReactNode;
}

import type { ViewStyle } from "react-native";

const styles: { organization: ViewStyle } = {
  organization: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
};

export function Header2({ 
  title, 
  button,
}: HeaderProps) {
  const header2Styles = [
    styles['organization'],
  ];
  return (
    <View style={header2Styles}>
      <Text size="lg" type="blackText">{title}</Text>
      {button}
    </View>
  );
}

export default Header2;