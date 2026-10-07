import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Splash = () => {
  const logoScale = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const animateAndNavigate = async () => {
      // Start animation
      Animated.timing(logoScale, {
        toValue: 0.8,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      // Wait during animation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check token
      try {
        const expiresString = await AsyncStorage.getItem('accessTokenExpiry');
        if (expiresString) {
          const expiresDate = new Date(expiresString);
          const now = new Date();
          if (expiresDate > now) {
            navigation.replace('Dashboard');
          } else {
            navigation.replace('login');
          }
        } else {
          navigation.replace('login');
        }
      } catch (error) {
        console.error('Splash screen token check error:', error);
        navigation.replace('login');
      }
    };

    animateAndNavigate();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')} // 🔁 Replace with your actual logo path
        style={[
          styles.logo,
          {
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

export default Splash;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width,
    height,
  },
});
