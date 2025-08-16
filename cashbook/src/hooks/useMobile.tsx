import { useWindowDimensions } from 'react-native';

export const useMobile = () => {
  const { width, height } = useWindowDimensions();
  return { isSmallScreen: width < 400, orientation: width > height ? 'landscape' : 'portrait' };
};