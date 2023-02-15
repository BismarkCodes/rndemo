import {
  StyleSheet,
  Text,
  View,
  TextInput,
  useColorScheme,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {Colors} from '../../constants/colors';
import {GlobalStyles} from '../../components/GlobalStyles';
import HashTagText from '../../components/text/HashTagText';

function findHashTags(str: string) {
  let hashArr = []; //array to hold hashtags and non-hastag words or phrases
  let strArr = str.split(' '); //convert string to array

  hashArr = strArr.map(word => {
    if (word.startsWith('#')) {
      return '~' + word + '~'; //mark #taged words with ~ for splitting into more concise array
    }
    return word;
  });

  let hashStr = hashArr.join(' '); //convert array back to string

  return hashStr.split('~');
}

const HastagInput = (): JSX.Element => {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState([]);

  const isDarkMode = useColorScheme() === 'dark';
  const scrollViewRef = React.useRef();

  useEffect(() => {
    setMessage(findHashTags(input));
  }, [input]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={contentHeight => {
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({
              y: contentHeight,
              animated: true,
            });
          }
        }}
        style={styles.preview}
        contentContainerStyle={{justifyContent: 'center'}}>
        <Text
          style={[
            styles.text,
            isDarkMode && {color: Colors.text.primary.dark},
          ]}>
          {input ? (
            message.map((phrase, index) => {
              return (
                <Text key={index}>
                  {phrase.startsWith('#') ? (
                    <HashTagText phrase={phrase} />
                  ) : (
                    <Text>{phrase}</Text>
                  )}
                </Text>
              );
            })
          ) : (
            <Text
              style={[
                styles.text,
                isDarkMode && {color: Colors.text.primary.dark},
              ]}>
              Message shows here...
            </Text>
          )}
        </Text>
      </ScrollView>
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

export default HastagInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  preview: {
    paddingHorizontal: 15,
    marginBottom: 5,
    flex: 1,
  },
  text: {
    fontSize: 26,
    color: Colors.text.primary.light,
  },
});
