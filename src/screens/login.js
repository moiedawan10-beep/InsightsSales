import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Easing,
} from 'react-native';
import {ActivityIndicator, Button} from 'react-native-paper';
import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import InputField from '../components/TextInput';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {loginUser} from '../redux/Slices/loginSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {verifyPinAction} from '../redux/Slices/VerifyPinSlice';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Arrow from 'react-native-vector-icons/FontAwesome';
import Arrow2 from 'react-native-vector-icons/MaterialIcons';
import * as Keychain from 'react-native-keychain';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const Login = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const logoTranslateY = useRef(new Animated.Value(screenHeight / 2)).current;

  useEffect(() => {
    Animated.timing(logoTranslateY, {
      toValue: 0,
      duration: 3000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  const loadCredentials = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: 'Scan fingerprint to login',
        },
      });

      if (credentials) {
        const parsed = JSON.parse(credentials.password);
        setUsername(credentials.username);
        setPassword(parsed.password);
        setPin(parsed.pin);

        submitData({
          username: credentials.username,
          password: parsed.password,
          pin: parsed.pin,
        });
      } else {
        ToastAndroid.show(
          'Please provide credentials first',
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.error('Biometric auth failed:', error);
      ToastAndroid.show('Please provide credentials first', ToastAndroid.SHORT);
    }
  };

  const storeTokensAndUserData = async (accessToken, expires, user) => {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('accessTokenExpiry', expires);
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing tokens and user data:', error);
      throw error;
    }
  };

  const storeConnString = async connString => {
    try {
      await AsyncStorage.setItem('x-conn', connString);
    } catch (error) {
      console.error('Error storing x-conn String:', error);
    }
  };

  const submitData = async ({username, password, pin}) => {
    if (!username) {
      ToastAndroid.show('Username is required', ToastAndroid.SHORT);
      return;
    }
    if (!password) {
      ToastAndroid.show('Password is required', ToastAndroid.SHORT);
      return;
    }
    if (!pin) {
      ToastAndroid.show('Pin is required', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);

    try {
      const apiResponse = await dispatch(verifyPinAction(pin));
      if (apiResponse?.payload?.ClientConnString) {
        await storeConnString(apiResponse.payload.ClientConnString);

        const payload = {
          username,
          password,
          pin: apiResponse.payload.ClientConnString,
        };

        const response = await dispatch(loginUser(payload));

        if (response?.payload?.Access_Token) {
          const {Access_Token, Expires, UserInfo} = response.payload;

          await storeTokensAndUserData(Access_Token, Expires, UserInfo);

          // 🔐 Check if credentials already exist
          const existingCreds = await Keychain.getGenericPassword();

          if (!existingCreds) {
            // 🟡 Ask user to save credentials if none exist
            Alert.alert(
              'Enable Fingerprint Login?',
              'Would you like to save your credentials to login with fingerprint next time?',
              [
                {
                  text: 'No',
                  onPress: () => {
                    navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
                  },
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: async () => {
                    try {
                      await Keychain.setGenericPassword(
                        username,
                        JSON.stringify({password, pin}),
                        {
                          accessControl:
                            Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
                          accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
                          authenticationPrompt: {
                            title: 'Scan your fingerprint to store credentials',
                          },
                        },
                      );
                    } catch (err) {
                      console.log('Keychain store error:', err);
                      ToastAndroid.show(
                        'Failed to store credentials',
                        ToastAndroid.SHORT,
                      );
                    }

                    navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
                  },
                },
              ],
            );
          } else {
            // ✅ Credentials already exist — go to Dashboard
            navigation.reset({index: 0, routes: [{name: 'Dashboard'}]});
          }
        } else {
          ToastAndroid.show(response.payload.Message, ToastAndroid.SHORT);
        }
      } else {
        ToastAndroid.show(apiResponse.payload.Message, ToastAndroid.SHORT);
      }
    } catch (error) {
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{flex: 1}}>
      <StatusBar
        hidden={false}
        animated={true}
        backgroundColor="#fff"
        barStyle={'dark-content'}
      />
      <LinearGradient
        colors={['#fff', '#bb3a35']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 0.7}}
        style={styles.container}>
        <SafeAreaView>
          <View style={styles.InnerBox}>
            {/* <View
              style={{
                flexDirection: 'row',
                marginVertical: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Arrow name="arrow-right" color="#04abad" size={30} />
              <Arrow2
                name="arrow-forward-ios"
                color="#9e0067"
                size={35}
                style={{marginLeft: -15}}
              />
              <Arrow2
                name="arrow-forward-ios"
                color="#f3ca9c"
                size={35}
                style={{marginLeft: -25}}
              />
              <Text style={{fontSize: 40, color: 'white'}}>DELIVER</Text>
              <Text style={{fontSize: 40, color: 'white', fontWeight: 'bold'}}>
                FAST
              </Text>
            </View> */}

            <ScrollView
              contentContainerStyle={{
                paddingBottom: screenHeight * 0.3,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <Animated.Image
  style={[
    styles.logo,
    {
      zIndex:1,
      transform: [{ translateY: logoTranslateY }],
    },
  ]}
  source={require('../assets/logo.png')}
  resizeMode="contain"
/>

              <Text
                style={[
                  styles.heading,
                  {fontSize: 25, fontWeight: 'bold', marginBottom: 0},
                ]}>
                Login
              </Text>
              <Text style={styles.heading}>Add your details to login</Text>
              <Text style={styles.demoHint}>
                Demo: code 1234 · emilys / emilyspass
              </Text>
              <InputField
                label="Customer Code"
                value={pin}
                onChange={text => setPin(text)}
                icon={'lock'}
              />
              <InputField
                label="Username"
                icon="user-alt"
                value={username}
                onChange={text => setUsername(text)}
              />
              <InputField
                label="Password"
                value={password}
                onChange={text => setPassword(text)}
                icon={'lock'}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  marginHorizontal: 20,
                  alignItems: 'center',
                }}>
                <Button
                  style={styles.button}
                  mode="contained"
                  onPress={() =>
                    loading ? null : submitData({username, password, pin})
                  }>
                  {loading ? (
                    <ActivityIndicator color="white" size={20} />
                  ) : (
                    'Login'
                  )}
                </Button>
                <TouchableOpacity onPress={loadCredentials}>
                  <Icon
                    name="finger-print"
                    color="white"
                    size={50}
                    style={{paddingLeft: 0}}
                  />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          {/* <View
        style={{
          width: '120%',
          position: 'absolute',
          bottom: 35,
          // borderRadius: 300,
          height: '20%',
          backgroundColor: '#c8453d',
          transform: [{rotate: '33deg'}],
          right: '7%',
        }}></View> */}
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.95,
    paddingTop: 5,
    alignItems: 'center',
    borderBottomLeftRadius: 200,
  },
  InnerBox: {
    width: '90%',
  },
  logo: {
    width: screenWidth,
    height: 180,
    alignSelf: 'center',
    marginVertical: 10,
  },
  line: {
    marginHorizontal: 10,
    backgroundColor: '#781d17',
    height: 2,
  },
  heading: {
    color: 'white',
    justifyContent: 'flex-start',
    marginHorizontal: 10,
    marginBottom: 15,
    alignSelf: 'center',
    fontSize: 18,
  },
  demoHint: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 13,
    opacity: 0.85,
    marginTop: -10,
    marginBottom: 10,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  button: {
    width: '80%',
    padding: 5,
    alignSelf: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  textBottom: {
    color: 'black',
    alignSelf: 'center',
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
