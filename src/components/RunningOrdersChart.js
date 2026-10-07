import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import Theme from '../constants/Theme';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';

const RunningOrdersChart = ({isVisible}) => {
  const [showChart, setShowChart] = useState(false);
  const [BarData, setBarData] = useState([]);
  const [maxValue, setMaxValue] = useState(null);
  const hasAnimated = useRef(false);
  const {data, loading} = useSelector(state => state.runningOrders);
  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      setShowChart(true);
      hasAnimated.current = true;
    } else if (!isVisible) {
      setShowChart(false);
      hasAnimated.current = false;
    }
  }, [isVisible]);

  useEffect(() => {
// console.log('RunningOrdersData',data)

    const barData =
      data?.map(item => ({
        value: item.NoOfOrders,
        label: item.ServiceType,
        frontColor: Theme.COLORS.HeaderVariant,
        topLabelComponent: () => (
          <View style={styles.insideTopLabel}>
            <Text
              style={[
                styles.insideTopLabelText,
                {fontSize: data?.length > 2 ? 10 : 12},
              ]}>
             {Number(item.GrossAmount).toLocaleString()}

            </Text>
          </View>
        ),
      })) || [];
    setBarData(barData);
    const max = Math.max(...(data?.map(item => item.NoOfOrders) || [0]));
    setMaxValue(max > 0 ? max : 5);
  }, [data]);


  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (!loading && (!data || data.length === 0)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Running Orders</Text>
        <Text
          style={{
            color: 'white',
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
    <View style={styles.container}>
      <Text style={styles.title}>Running Orders</Text>
      <Text style={styles.ordersLabel}>Orders</Text>
      <BarChart
        // key={showChart ? 'visible' : 'hidden'}
        isAnimated={showChart}
        animationDuration={300}
        barWidth={BarData.length === 1 ? 120 : BarData.length === 2 ? 90 : 60}
        noOfSections={2}
        maxValue={maxValue}
        spacing={BarData.length === 1 ? 50 : 20}
        data={BarData}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={'white'}
        rulesColor="white"
        yAxisTextStyle={{color: 'white'}}
        xAxisLabelTextStyle={{
          color: 'white',
          fontSize: 14,
          margin: -2,
        }}
      />
      <Text style={styles.xAxisLabel}>Service Type</Text>
    </View>
  );
};

export default RunningOrdersChart;

const styles = StyleSheet.create({
  container: {
    height: 320,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    backgroundColor: Theme.COLORS.chartBackground,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginVertical: 10,
  },
  amountLabel: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    borderWidth: 1,
    textAlign: 'center',
  },
  xAxisLabel: {
    color: 'white',
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
  },
  insideTopLabel: {
    top: 20,
  },
  insideTopLabelText: {
    color: 'white',
    fontSize: 12,
  },
  ordersLabel: {
    color: 'white',
    position: 'absolute',
    left: -10,
    alignSelf: 'flex-start',
    top: 130,
    fontSize: 14,
    transform: [{rotate: '-90deg'}],
  },
});



