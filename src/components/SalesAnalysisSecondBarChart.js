import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import {useSelector} from 'react-redux';
import Theme from '../constants/Theme';
import {ActivityIndicator} from 'react-native-paper';

const SalesAnalysisSecondBarChart = ({isVisible, Datatype}) => {
  const {data, loading} = useSelector(state => state.typeWiseSales);
  const [showChart, setShowChart] = useState(false);
  const hasAnimated = useRef(false);
  const [BarData, setBarData] = useState([]);
  const [maxValue, setMaxValue] = useState(null);
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
    // console.log('ServiceTypeWiseData',data)
  const filteredData = data?.filter(item => item.DateType === Datatype);

  const barData =
    filteredData?.map(item => ({
      value: isVisible ? item.NoOfInvoices : 0,  // ✅ Animate from 0 when visible
      label: item.ServiceType,
      frontColor: Theme.COLORS.HeaderVariant,
      topLabelComponent: () => (
        <View style={styles.insideTopLabel}>
          <Text
            style={[
              styles.insideTopLabelText,
              {fontSize: data?.length > 2 ? 10 : 12},
            ]}>
             {Number(item.NetAmount).toLocaleString()}
          </Text>
        </View>
      ),
    })) || [];

  setBarData(barData);

  const max = Math.max(
    ...(filteredData?.map(item => item.NoOfInvoices) || [0])
  );
  setMaxValue(max > 0 ? max : 5);
}, [data, Datatype, isVisible]);  // ✅ Watch `isVisible`


  if (loading) {
    return (
      <View
        style={[styles.container, {justifyContent: 'center', marginTop: 100}]}>
        <ActivityIndicator size="large" color="#b23b3b" />
      </View>
    );
  }

  if (!loading && (!BarData || BarData.length === 0)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Service Type Wise Sales</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>Service Type Wise Sales</Text>
      <Text style={styles.ordersLabel}>No. Of Invoices</Text>
      <BarChart
        key={`${Datatype}-${showChart}`}
        isAnimated={true}
        animationDuration={300}
        barWidth={BarData.length === 1 ? 120 : BarData.length === 2 ? 90 : 60}
        noOfSections={1}
        maxValue={maxValue}
        spacing={BarData.length===1 ?  50 : 20}
        data={BarData}
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={'black'}
        rulesColor="grey"
        yAxisTextStyle={{color: 'black'}}
        xAxisLabelTextStyle={{
          color: 'black',
          fontSize: 14,
          margin: -2,
        }}
      />
      <Text style={styles.xAxisLabel}>Service Type</Text>
    </View>
  );
};

export default SalesAnalysisSecondBarChart;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: 'black',
  },
  amountLabel: {
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 8,
    borderWidth: 1,
    textAlign: 'center',
  },
  xAxisLabel: {
    color: 'black',
    fontSize: 16,
    marginTop: 5,
  },
  insideTopLabel: {
    top: 20,
  },
  insideTopLabelText: {
    color: 'white',
    fontSize: 12,
  },
  ordersLabel: {
    color: 'black',
    position: 'absolute',
    left: -40,
    top: 120,
    fontSize: 14,
    transform: [{rotate: '-90deg'}],
  },
});