import changeNavigationBarColor from 'react-native-navigation-bar-color';

export const useChangeAndroidNavbarColor = async (
  color?: string,
  light?: boolean,
) => {
  try {
    changeNavigationBarColor(color || '#000000', light);
  } catch (e) {
    // console.log(e);
  }
};
