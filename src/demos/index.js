import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Text, Button} from 'react-native';
import {runOnJS} from 'react-native-reanimated';
import BottomSheethContainer from './bottomSheeth/BottomSheethContainer';

const Preview = () => {
  const [visible, setVisible] = useState(false);
  const onCloseSheet = useCallback(() => {
    'worklet';
    runOnJS(setVisible)(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Button title="Open Sheet" onPress={() => setVisible(true)} />
      </View>
      <BottomSheethContainer visible={visible} onClose={onCloseSheet} />
    </View>
  );
};
export default Preview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
