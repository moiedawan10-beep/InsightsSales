import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Theme from '../constants/Theme';

const CustomSegmentedControl = ({options, selected, onSelect}) => {
  return (
    <View style={styles.container}>
      {options.map((segment, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.segment,
            selected === segment && styles.activeSegment,
          ]}
          onPress={() => onSelect(segment)}
        >
          <Text
            style={[
              styles.segmentText,
              selected === index && styles.activeText,
            ]}
          >
            {segment}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Theme.COLORS.otherVariant,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 10,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Theme.COLORS.otherVariant,
  },
  activeSegment: {
    backgroundColor: Theme.COLORS.selectedsegmentVariant,
    borderRadius:20,
  },
  segmentText: {
    color:'white',
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
  },
});

export default CustomSegmentedControl;
