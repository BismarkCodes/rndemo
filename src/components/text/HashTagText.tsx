import {StyleSheet, Text, Linking, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import {Colors} from '../../constants/colors';

const HashTagText: React.FC<{phrase: string}> = ({phrase}): JSX.Element => {
  const [focused, setFocused] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  function toggleFocused() {
    setFocused(!focused);
  }

  function hastagPressHandler(str: string) {
    if (str.startsWith('#')) {
      const url = `https://www.google.com/search?q=${str.substring(
        1,
        str.length,
      )}`;
      Linking.openURL(url);
    }
  }

  return (
    <Text
      style={[
        styles.hashtag,
        focused && {
          backgroundColor: isDarkMode
            ? Colors.cards.bg.dark
            : Colors.cards.bg.light,
        },
      ]}
      onPressIn={toggleFocused}
      onPressOut={toggleFocused}
      onPress={() => hastagPressHandler(phrase)}>
      {phrase}
    </Text>
  );
};

export default HashTagText;

const styles = StyleSheet.create({
  hashtag: {
    fontWeight: '900',
    color: Colors.text.link,
  },
});
