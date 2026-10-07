import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Animated} from 'react-native';
import {useSelector} from 'react-redux';
import Theme from '../constants/Theme';
import {ActivityIndicator} from 'react-native-paper';

const {width} = Dimensions.get('window');
const barMaxWidth = width * 0.6;

const SalesOverviewChart = ({isVisible, Datatype}) => {
  const {loading, weeklySales} = useSelector(state => state.weeklySales);
  const {monthlyloading, monthlySales} = useSelector(
    state => state.monthlySales,
  );
  const {yearlyloading, yearlySales} = useSelector(state => state.yearlySales);

  const [data, setData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [animatedValues, setAnimatedValues] = useState([]);
  const hasAnimated = useRef(false);

  const getSummaryData = () => {
    if (Datatype === 'Weekly' && Array.isArray(weeklySales)) return weeklySales;
    if (Datatype === 'Monthly' && Array.isArray(monthlySales))
      return monthlySales;
    if (Datatype === 'Yearly' && Array.isArray(yearlySales)) return yearlySales;
    return [];
  };

  const formatSalesData = (rawData = []) => {
    if (!Array.isArray(rawData)) return [];
    return rawData.map(item => ({
      label: item.WeekDay || item.Month || item.Year || 'Label',
      value: Number(item.GrossSales || 0),
    }));
  };

//   useEffect(()=>{
// console.log('WeeklyData',weeklySales)
//   },[weeklySales])

//   useEffect(()=>{
// console.log('MonthlyData',monthlySales)
//   },[monthlySales])

//   useEffect(()=>{
// console.log('YearlyData',yearlySales)
//   },[yearlySales])

  useEffect(() => {
    const raw = getSummaryData();
    const chartData = formatSalesData(raw);
    const max = Math.max(...chartData.map(i => i.value), 0);

    setData(chartData);
    setMaxValue(max);

    const animVals = chartData.map(() => new Animated.Value(0));
    setAnimatedValues(animVals);
    hasAnimated.current = false;
  }, [Datatype, weeklySales, monthlySales, yearlySales]);

  useEffect(() => {
    if (
      isVisible &&
      data.length > 0 &&
      animatedValues.length === data.length &&
      maxValue > 0 &&
      !hasAnimated.current
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
        ).start(() => {
          hasAnimated.current = true;
        });
      }, 100);

      return () => clearTimeout(timer);
    } else if (!isVisible && animatedValues.length > 0) {
      animatedValues.forEach(anim => anim.setValue(0));
      hasAnimated.current = false;
    }
  }, [isVisible, data, animatedValues, maxValue]);

  if (data.length === 0) {
    return (
      <View style={styles.noDataWrapper}>
        <Text style={styles.noDataText}>No Data Found</Text>
      </View>
    );
  }

  if (loading || monthlyloading || yearlyloading) {
    return (
      <View style={{margin: 60}}>
        <ActivityIndicator size="large" color="#b23b3b" />
      </View>
    );
  }

  return (
    <View style={{marginTop: 25}}>
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
                      height: data.length <= 2 ? 60 : data.length < 5 ? 50 : 25,
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

export default SalesOverviewChart;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  label: {
    width: 80,
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
  noDataWrapper: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: 'black',
  },
});
