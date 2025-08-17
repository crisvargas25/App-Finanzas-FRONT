import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text } from '../../components/ui/text';
import StepButton from '../../components/common/buttons/StepButton';
import { useNavigation } from '@react-navigation/native';
import GradientContainer from '../../components/common/containers/gradientContainer';
import MainContainer from '../../components/common/containers/mainContainer';


const { width, height } = Dimensions.get('window');

export default function FirstScreen() {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Login' as never);
  };

  return (
      <GradientContainer>
        {/* Logo and main content */}
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../../assets/icons/iconWhite.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text size="2xl" type="blackText" align="left" >
              Your money's{'\n'}best friend.
            </Text>
          </View>

          {/* Money illustration */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('../../../assets/imgs/dollar1stScreen.png')} 
              style={styles.moneyImage}
              resizeMode="contain"
            />
          </View>
        </View>
            <StepButton text="Get started" action="tertiary" type="cbBlueText" onPress={handleGetStarted} />     
       </GradientContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginTop: 100,
  },
  logo: {
    width: 120,
    height: 40,
  },
  textContainer: {
    marginTop: 10,
  },
  mainText: {
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    bottom: 20,
  },
  moneyImage: {
    width: width * 0.9,
    height: height * 0.40,
  },
});
