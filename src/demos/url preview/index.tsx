import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useColorScheme,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';

import {Colors} from '../../constants/colors';
import {GlobalStyles} from '../../components/GlobalStyles';
import HashTagText from '../../components/text/HashTagText';
import URLPreviewCard from '../../components/cards/URLPreviewCard';

function findUrls(text) {
  const urlRegex =
    /(?:(?:(?:https?|ftp):\/\/)?(?:www\.)?|(?:[a-z0-9]+\.))([a-z0-9]+\.[^\s]{2,}|[a-z0-9]+\.[^\s]{2,}\.[a-z]{2,})\.?/gi;
  let result = text.match(urlRegex);
  return result ? result[0] : '';
}

const URLPreview = (): JSX.Element => {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');

  const isDarkMode = useColorScheme() === 'dark';
  const scrollViewRef = React.useRef();

  useEffect(() => {
    setUrl(findUrls(input) || '');
  }, [input]);

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        {/* url preview component */}
        <URLPreviewCard
          url={url.endsWith('.') ? url.substring(0, url.length - 1) : url}
        />
      </View>
      <View
        style={[
          GlobalStyles.input.messageInput.inputContainer,
          isDarkMode && {backgroundColor: Colors.cards.bg.dark},
        ]}>
        <TextInput
          defaultValue={input}
          multiline={true}
          placeholder="Type your message"
          style={[
            GlobalStyles.input.messageInput.textInput,
            isDarkMode && {color: Colors.text.primary.dark},
          ]}
          onChangeText={setInput}
          placeholderTextColor={Colors.text.placeHolder.light}
        />
      </View>
    </View>
  );
};

export default URLPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  preview: {
    padding: 0,
    flex: 1,
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: 26,
    color: Colors.text.primary.light,
  },
});
