import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'Nunito-Regular': require('../../assets/Nunito/static/Nunito-Regular.ttf'),
    'Nunito-Light': require('../../assets/Nunito/static/Nunito-Light.ttf'),
    'Nunito-Medium': require('../../assets/Nunito/static/Nunito-Medium.ttf'),
    'Nunito-SemiBold': require('../../assets/Nunito/static/Nunito-SemiBold.ttf'),
    'Nunito-Bold': require('../../assets/Nunito/static/Nunito-Bold.ttf'),
    'Nunito-ExtraBold': require('../../assets/Nunito/static/Nunito-ExtraBold.ttf'),
    'Nunito-Black': require('../../assets/Nunito/static/Nunito-Black.ttf'),
    'Nunito-ExtraLight': require('../../assets/Nunito/static/Nunito-ExtraLight.ttf'),
  });

  return fontsLoaded;
};
