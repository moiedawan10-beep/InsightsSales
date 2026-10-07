import {
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Theme from '../constants/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Animated} from 'react-native';
import {useSelector} from 'react-redux';

const DashboardHeader = ({handleLocation}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [animations, setAnimations] = useState([]);
  const {locations} = useSelector(state => state.locations);
  useEffect(() => {
    // console.log('Locations',locations)
  const allOption = { DISTRIBUTOR_ID: 0, DISTRIBUTOR_NAME: 'All' };
  const updatedLocation = [allOption, ...(locations ?? [])];

  setLocation(updatedLocation);

  if (updatedLocation.length > 0) {
    setSelectedLocation(updatedLocation[0]); // ✅ default to 'All'
    handleLocation(updatedLocation[0].DISTRIBUTOR_ID); // trigger parent handler with ID 0
  }
}, [locations]);


  const handleOpenDropdown = () => {
    setDropdownVisible(true);

    const newAnimations = location.map(() => new Animated.Value(0));
    setAnimations(newAnimations);

    newAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleLogout = async () => {
    setModalVisible(false);
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('x-conn');
      await AsyncStorage.removeItem('accessTokenExpiry');

      navigation.replace('login');
    } catch (error) {
      console.error('Error clearing session from AsyncStorage:', error);
    }
  };

  const handleDropdownPress = item => {
    setSelectedLocation(item);
    handleLocation(item.DISTRIBUTOR_ID);
  };

  const handleCloseDropdown = () => {
    setDropdownVisible(false);
    setAnimations([]);
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={styles.iconStyle}>
          <Icon name="menu" color="white" size={30} style={{marginRight: 20}} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {selectedLocation
            ? `${selectedLocation.DISTRIBUTOR_NAME}`
            : 'C Block, Model Town'}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={dropdownVisible ? handleCloseDropdown : handleOpenDropdown}>
        <Ionicon name="filter-sharp" color="white" size={30} />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.fullscreenTouchable}>
            <TouchableWithoutFeedback>
              <View style={styles.smallDropdownBox}>
                <TouchableOpacity
                  style={styles.logoutOption}
                  onPress={handleLogout}>
                  <FontAwesome name="sign-out" size={18} color="black" />
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Change Area Modal */}
      <Modal
        transparent
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.fullscreenTouchable}>
            <TouchableWithoutFeedback>
              <View style={styles.DropdownBox}>
                {location.map((item, index) => {
                  const animationStyle = animations[index]
                    ? {
                        opacity: animations[index],
                        transform: [
                          {
                            translateY: animations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [10, 0],
                            }),
                          },
                        ],
                      }
                    : {};

                  return (
                    <Animated.View
                      key={item.DISTRIBUTOR_ID}
                      style={animationStyle}>
                      <TouchableOpacity
                        style={[
                          styles.logoutOption,
                          selectedLocation?.DISTRIBUTOR_ID ===
                            item.DISTRIBUTOR_ID && styles.selectedOption, // ✅ highlight selected
                        ]}
                        onPress={() => {
                          handleDropdownPress(item);
                          handleCloseDropdown();
                        }}>
                        <Text style={styles.dropdownText}>
                          {item.DISTRIBUTOR_NAME}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: Theme.COLORS.HeaderVariant,
    height: 70,
    marginTop: -10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  selectedOption: {
    backgroundColor: 'lightgrey',
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: '500',
    marginLeft: 5,
    flexShrink: 1,
  },
  iconButton: {
    borderColor: 'lightgrey',
    borderRadius: 30,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContainer: {flexDirection: 'row', alignItems: 'center', flex: 1},
  iconStyle: {padding: 5},

  fullscreenTouchable: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  smallDropdownBox: {
    position: 'absolute',
    top: 60,
    left: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: 'black',
  },

  DropdownBox: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  dropdownHeading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'black',
  },
});
