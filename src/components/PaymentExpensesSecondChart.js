import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Animated} from 'react-native';
import Theme from '../constants/Theme';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';

const {width} = Dimensions.get('window');

const PaymentExpensesSecondChart = ({isVisible, Datatype}) => {
  const {pettyExpense, loading} = useSelector(state => state.pettyExpense);
  const [data, setData] = useState([]);
  const [maxValue, setMaxValue] = useState(1);
  const [animatedValues, setAnimatedValues] = useState([]);

  const formatSalesData = (apiArray = []) => {
    if (!Array.isArray(apiArray)) return [];

    return apiArray
      .filter(item => item.DateType === Datatype && item.ExpenseAmount > 0)
      .map(item => ({
        label: item.Head,
        value: Math.ceil(item.ExpenseAmount),
      }));
  };

  useEffect(() => {
    if (loading) {
      setData([]);
    }
  }, [loading]);

  useEffect(() => {
    const chartData = formatSalesData(pettyExpense);
    const max = Math.max(...chartData.map(item => item.value)) || 1;
    const newAnimatedValues = chartData.map(() => new Animated.Value(0));

    setData(chartData);
    setMaxValue(max);
    setAnimatedValues(newAnimatedValues);
  }, [pettyExpense, Datatype]);

  const barMaxWidth = width * 0.6;

  useEffect(() => {
    if (
      isVisible &&
      data.length > 0 &&
      animatedValues.length === data.length &&
      maxValue > 0
    ) {
      const timer = setTimeout(() => {
        Animated.parallel(
          animatedValues.map((anim, index) =>
            Animated.timing(anim, {
              toValue: (data[index].value / maxValue) * barMaxWidth,
              duration: 600,
              useNativeDriver: false,
            }),
          ),
        ).start();
      }, 100); // Delay to ensure Animated.Values are ready

      return () => clearTimeout(timer);
    }
  }, [isVisible, data, animatedValues, maxValue]);

  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center', margin: 30}]}>
        <ActivityIndicator size="large" color="#b23b3b" />
      </View>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Petty Expenses</Text>
        <Text style={{color: 'black', alignSelf: 'center', margin: 30}}>
          No Data Found
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Petty Expenses</Text>
      {data.map((item, index) => {
        const barWidth = (item.value / maxValue) * barMaxWidth;
        const valueText = `${item.value.toLocaleString()}`;
        const approxTextWidth = valueText.length * 7;
        const fitsInside = barWidth > approxTextWidth + 16;

        return (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item.label} -</Text>
            {item.value > 0 ? (
              <View style={styles.barWrapper}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      width: animatedValues[index],
                      height: data.length <= 2 ? 70 : data.length <= 5 ? 40 : 25,
                    },
                  ]}>
                  {fitsInside && (
                    <Text style={styles.barText}>{valueText}</Text>
                  )}
                </Animated.View>
                {!fitsInside && (
                  <Text style={styles.outsideText}>{valueText}</Text>
                )}
              </View>
            ) : (
              <Text style={styles.zeroText}>0</Text>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default PaymentExpensesSecondChart;

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  label: {
    width: 120,
    textAlign: 'right',
    fontSize: 12,
    color: '#333',
    marginRight: 4,
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    backgroundColor: Theme.COLORS.selectedsegmentVariant,
    height: 25,
    justifyContent: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  barText: {
    color: '#fff',
    fontSize: 12,
  },
  outsideText: {
    fontSize: 12,
    color: '#b23b3b',
    marginLeft: 6,
  },
  zeroText: {
    color: '#b23b3b',
    fontSize: 14,
  },
});
