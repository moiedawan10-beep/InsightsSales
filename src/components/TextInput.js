// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import { TextInput } from "react-native-paper";

// const InputField = ({ label, value, onChange, icon }) => {
//   return (
//     <TextInput
//       label={label}
//       style={{
//         fontSize: 16,
//         marginHorizontal: 10,
//         backgroundColor: "transparent",
//         placeholderTextColor:'yellow'
//       }}
//       value={value}
//       secureTextEntry={label=='Password'}
//       autoCapitalize="none"
//       onChangeText={onChange}
//       mode="flat"
//       left={<TextInput.Icon icon={icon} color="#c8453d" size={32} />} // icon color
//       theme={{
//         colors: {
//           primary: "#c8453d",
//           onSurfaceVariant:'grey'
//         },
//       }}
//     />
//   );
// };

// export default InputField;

// const styles = StyleSheet.create({});

import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

const InputField = ({label, value, onChange, icon}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal:20,
        padding:3,
        borderRadius:20,
        backgroundColor: 'white',
      }}>
      <Icon
        name={icon}
        color="grey"
        size={25}
        style={{paddingLeft: 20}}
      />
      <TextInput
        label={label}
        style={{
          fontSize: 16,
          width: '80%',
          textAlign:'center',
        }}
        value={value}
        placeholder={label}
        placeholderTextColor={'grey'}
        secureTextEntry={label == 'Password'}
        autoCapitalize="none"
        onChangeText={onChange}
      />
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({});
