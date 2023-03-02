import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import React, {ReactNode} from 'react';
import {GlobalStyles} from '../GlobalStyles';
import {Colors} from '../../constants/colors';

const CustomText: React.FC<{
  style?: Object;
  grey?: boolean;
  numberOfLines?: number;
  children?: ReactNode;
  onPress?: boolean;
}> = ({style, grey, numberOfLines, children, onPress}) => {
  // get device theme
  const isDarkMode = useColorScheme() === 'dark';

  // custom styles
  const textColor = {
    color: isDarkMode ? Colors.text.primary.dark : Colors.text.primary.light,
  };
  const greyTextColor = {
    color: isDarkMode
      ? Colors.text.placeHolder.dark
      : Colors.text.placeHolder.dark,
  };
  return (
    <Text
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={[GlobalStyles.text, textColor, grey && greyTextColor, style]}>
      {children}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({});
