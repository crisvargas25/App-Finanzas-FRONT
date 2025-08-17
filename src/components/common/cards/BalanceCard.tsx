import Card1 from "../cards/card1";
import { Card } from "../../ui/card";
import { Text } from "../../ui/text";
import { View, Image } from "react-native";
import { useToggleVisibility } from "../../../hooks/useToggleVisibility";

function BalanceCard() {
  const { isVisible, toggleVisibility, hideValue } = useToggleVisibility(false);
  
  const cardNumber = "1234 5678 9012 1234";
  const displayedCardNumber = hideValue(cardNumber);

  return (
    <View>
      <Card1 
        text1="Available Balance"
        quantitiy="$1,234.56"
        text2="As of today"
        img1={
          <Image 
            source={require("../../../../assets/imgs/visaLogo.webp")} 
            style={{ width: 60, height: 30, resizeMode: 'contain' }}
          />
        }
        text3="Card Number:"
        text4={displayedCardNumber}
        backgroundColor="#4a90e2"
        gradientColors={["#3633cdff", "#50e3c2", "#ffffff"]}
        showToggleIcon={true}
        isText4Visible={isVisible}
        onToggleText4={toggleVisibility}
      />
    </View>
  );
}

export default BalanceCard;