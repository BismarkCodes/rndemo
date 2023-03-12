import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  StatusBar,
  Pressable,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '../../constants/colors';
import {useChangeAndroidNavbarColor} from '../../functions/hooks/useChangeAndroidNavbarColor';

type Props = {
  children?: React.ReactNode;
  visible: boolean;
  onClose: object;
};

// get screen dimensions
const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const BottomSheethContainer: React.FC<Props> = ({
  visible,
  onClose,
  children,
}) => {
  const translateY = useSharedValue(0);

  // store previouse translateY value
  const context = useSharedValue({y: 0});

  const MAX_TRANSLATE_Y = -SCREEN_HEIGHT - StatusBar.currentHeight;

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    translateY.value = withTiming(destination, {duration: 100});
  }, []);

  const handleOnClose = useCallback(
    (destination: number) => {
      'worklet';
      translateY.value = withTiming(destination, {duration: 100}, () => {
        onClose();
      });
    },
    [onClose, translateY],
  );

  const gesture = Gesture.Pan()
    // store previouse translateY value
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      // let translateY.value pickup from previous position
      translateY.value = event.translationY + context.value.y;
      // set maxmum translateY value / cut-off point
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 6) {
        handleOnClose(0);
        // translateY.value = withTiming(0);
        // runOnUI(handleOnClose)();
      } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
        scrollTo(MAX_TRANSLATE_Y);
      } else {
        scrollTo(-SCREEN_HEIGHT / 3.5);
      }
    });

  // draw up sheet when component mounts
  useEffect(() => {
    if (visible) {
      scrollTo(-SCREEN_HEIGHT / 3.5);
    }
  }, [visible]);

  const bottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 0],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{translateY: translateY.value}],
      borderRadius,
    };
  });

  const panBarStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 80, MAX_TRANSLATE_Y],
      [1, 0],
      Extrapolate.CLAMP,
    );
    return {
      opacity,
    };
  });

  return (
    <Modal
      animationType={'fade'}
      visible={visible}
      onRequestClose={onClose}
      transparent
      statusBarTranslucent>
      {/* {console.log(isVisible)} */}
      <GestureHandlerRootView
        style={{
          flex: 1,
          backgroundColor: '#00000080',
        }}>
        <Pressable
          style={{flex: 1, backgroundColor: '#ffffff00'}}
          onPress={() => handleOnClose(0)}
        />
        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[styles.bottomSheethContainer, bottomSheetStyle]}>
            <Animated.View style={[styles.panBar, panBarStyle]} />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomSheethContainer: {
    height: SCREEN_HEIGHT + StatusBar.currentHeight,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT + StatusBar.currentHeight,
    // borderRadius: 25,
  },
  panBar: {
    width: 35,
    height: 6,
    borderRadius: 4,
    backgroundColor: 'grey',
    marginVertical: 12,
    alignSelf: 'center',
  },
});

export default BottomSheethContainer;
