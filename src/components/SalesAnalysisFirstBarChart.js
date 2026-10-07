import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Animated} from 'react-native';
import Theme from '../constants/Theme';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';

const {width} = Dimensions.get('window');

const SalesAnalysisFirstBarChart = ({isVisible, Datatype}) => {
  const {summaryData, loading} = useSelector(state => state.salesSummary);
  const [data, setData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [animatedValues, setAnimatedValues] = useState([]);

  const labelMap = {
    GrossSales: 'Gross Amount',
    Discount: 'Discount',
    SalesTax: 'Sales Tax',
    ServiceCharges: 'Service Charges',
    CreditCardSales: 'Credit Card Sales',
    CashSales: 'Cash Sales',
  };

  const formatSalesData = (apiData = {}) => {
    if (!apiData || typeof apiData !== 'object') return [];

    return Object.entries(apiData)
      .filter(([key, value]) => key !== 'DateType' && typeof value === 'number')
      .map(([key, value]) => ({
        label: labelMap[key] || key.replace(/([A-Z])/g, ' $1').trim(), // fallback: make it readable
        value: Number(value),
      }));
  };

  useEffect(() => {
    if (loading) {
      setData([]);
    }
  }, [loading]);

  useEffect(() => {
    // console.log('SalesAnalysisSummaryData', summaryData);

    const summaryRow = Array.isArray(summaryData)
      ? summaryData.find(row => row.DateType === Datatype)
      : null;

    if (summaryRow) {
      const chartData = formatSalesData(summaryRow);
      const max = Math.max(...chartData.map(item => item.value)) || 1;
      const newAnimatedValues = chartData.map(() => new Animated.Value(0));

      setData(chartData);
      setMaxValue(max);
      setAnimatedValues(newAnimatedValues);
    } else {
      setData([]);
      setAnimatedValues([]);
      setMaxValue(1);
    }
  }, [summaryData, Datatype]);

  const barMaxWidth = width * 0.6;

  const hasAnimated = useRef(false);

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
      }, 100); // Delay ensures `animatedValues` are fully initialized

      return () => clearTimeout(timer); // Clean up on unmount
    }
  }, [isVisible, data, animatedValues, maxValue]);

  if (loading) {
    return (
      <View
        style={[styles.container, {justifyContent: 'center', marginTop: 100}]}>
        <ActivityIndicator size="large" color="#b23b3b" />
      </View>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sales Summary</Text>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            alignSelf: 'center',
            marginTop: 100,
          }}>
          No Data Found
        </Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.title}>Sales Summary</Text>
      {data ? (
        data.map((item, index) => {
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
                        height:
                          data.length <= 2 ? 60 : data.length < 5 ? 50 : 25,
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
        })
      ) : (
        <Text>No Data Available</Text>
      )}
    </View>
  );
};

export default SalesAnalysisFirstBarChart;

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
