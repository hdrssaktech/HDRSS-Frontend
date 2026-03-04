// WaveLoader.js
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const Loader = () => {
  const animations = useRef([...Array(5)].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    const waveSequence = animations.map((anim, index) => 
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 600,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      )
    );
    
    Animated.parallel(waveSequence).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.loaderContainer}>
        {animations.map((anim, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                transform: [{ scaleY: anim }],
                backgroundColor: index % 2 === 0 ? '#FF8C42' : '#FFB347',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#968989',
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    gap: 5,
  },
  bar: {
    width: 8,
    height: 40,
    borderRadius: 4,
  },
});

export default Loader;
