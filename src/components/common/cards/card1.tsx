import { View, TouchableOpacity } from "react-native";
import { Card } from "../../ui/card";
import { Text } from "../../ui/text";
import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Card1Props {
  text1?: string;
  quantitiy?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  img1?:  React.ReactNode; 
  backgroundColor?: string;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  showToggleIcon?: boolean;
  isText4Visible?: boolean;
  onToggleText4?: () => void;
}

function Card1({ 
  text1, 
  quantitiy, 
  text2, 
  text3, 
  text4,
  img1,
  backgroundColor = "#3633cdff",
  gradientColors = ["#3633cdff", "#6366f1ff", "#ffffffff"] as const,
  showToggleIcon = false,
  isText4Visible = true,
  onToggleText4
}: Card1Props) {
  const cardStyles = [
    styles.textCardBottom,
    styles.imgContainer
  ];
  return (
    <Card variant="elevated" style={{ padding: 0, overflow: 'hidden' }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 16,
          borderRadius: 16,
          minHeight: 80,
          justifyContent: 'center'
        }}
      >
        <View style={styles.imgContainer}>
          <Text size="md" type="whiteText" >{text1}</Text>
          {img1 && <View style={styles.imgContainer}>{img1}</View>}
        </View>
        
          <Text size="xl" type="whiteText" >{quantitiy}</Text>
          <Text size="xs" type="whiteText">{text2}</Text>

        {text3 && <Text size="sm" type="whiteText" style={styles.textCardBottom}>{text3}</Text>}
        {text4 && (
          <View style={styles.text4Container}>
            <Text size="xs" type="whiteText">{text4}</Text>
            {showToggleIcon && (
              <TouchableOpacity onPress={onToggleText4} style={styles.eyeIcon}>
                <Ionicons 
                  name={isText4Visible ? "eye" : "eye-off"} 
                  size={19} 
                  color="white" 
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </LinearGradient>
    </Card>
  );
}

const styles =  StyleSheet.create({
  textCardBottom: {
    marginTop: 48,
    borderRadius: 12,
  },
  imgContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text4Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  eyeIcon: {
    marginLeft: 8,
  },
});

export default Card1;