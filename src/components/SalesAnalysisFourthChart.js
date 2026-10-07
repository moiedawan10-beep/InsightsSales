import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import { ActivityIndicator } from 'react-native-paper';
import {useSelector} from 'react-redux';

const SalesAnalysisFourthBarChart = ({isVisible, Datatype}) => {
  const {data,loading} = useSelector(state => state.dineInCovers);
  const [BarData, setBarData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [showChart, setShowChart] = useState(false);
  const hasAnimated = useRef(false);

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
    // console.log('SalesAnalysisDineInCoversData', data);

  const filtered = data?.find(item => item.DateType === Datatype);

  if (filtered) {
    const hasData =
      (filtered.Covers || 0) > 0 ||
      (filtered.NoOfInvoices || 0) > 0 ||
      (filtered.NetAmount || 0) > 0;

    if (!hasData) {
      setBarData([]);
      setMaxValue(0);
      return;
    }

    const coversValue = filtered.Covers || 0;
    const invoicesValue = filtered.NoOfInvoices || 0;
    const avgValue =
      filtered.NoOfInvoices > 0
        ? filtered.NetAmount / filtered.NoOfInvoices
        : 0;

    const barData = [
      {
        value: showChart ? coversValue : 0,
        label: 'Covers',
        frontColor: '#b23b3b',
        topLabelComponent: () => {
          const isSmall = coversValue < maxValue * 0.3;
          return (
            <View
              style={[
                styles.topLabelWrapper,
                isSmall ? styles.aboveBar : styles.insideTopLabel,
              ]}>
              <Text
                style={[
                  styles.insideTopLabelText,
                  {color: isSmall ? 'black' : 'white'},
                ]}>
                {coversValue}
              </Text>
            </View>
          );
        },
      },
      {
        value: showChart ? invoicesValue : 0,
        label: 'Invoices',
        frontColor: '#b23b3b',
        topLabelComponent: () => (
          <View style={[styles.topLabelWrapper, styles.aboveBar]}>
            <Text style={[styles.insideTopLabelText, {color: 'black'}]}>
              {invoicesValue}
            </Text>
          </View>
        ),
      },
      {
        value: showChart ? avgValue : 0,
        label: 'Average Sales per Invoice',
        frontColor: '#b23b3b',
        topLabelComponent: () => {
          const isSmall = avgValue < maxValue * 0.3;
          return (
            <View
              style={[
                styles.topLabelWrapper,
                isSmall ? styles.aboveBar : styles.insideTopLabel,
              ]}>
              <Text
                style={[
                  styles.insideTopLabelText,
                  {color: isSmall ? 'black' : 'white'},
                ]}>
                {avgValue > 0 ? Number(avgValue).toLocaleString() : 0}
              </Text>
            </View>
          );
        },
      },
    ];

    setBarData(barData);
    const max = Math.max(coversValue, invoicesValue, avgValue);
    setMaxValue(max);
  } else {
    setBarData([]);
    setMaxValue(0);
  }
}, [data, Datatype, showChart]);  // <-- add showChart here too


  if (loading) {
    return (
      <View style={[styles.container,{justifyContent:'center',marginTop:100}]}>
        <ActivityIndicator size="large" color="#b23b3b" />
      </View>
    );
  }

  if (!loading && (!BarData || BarData.length === 0)) {
    return (
      <View style={styles.container}>
      <Text style={styles.title}>Dine In Covers</Text>
        <Text style={{color: 'black', fontSize: 16,alignSelf:'center',marginTop:100}}>No Data Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dine In Covers</Text>
        <BarChart
          key={showChart ? 'visible' : 'hidden'}
          isAnimated={showChart}
          animationDuration={300}
          barWidth={85}
          noOfSections={1}
          maxValue={maxValue}
          spacing={10}
          data={BarData}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={'black'}
          rulesColor="grey"
          yAxisTextStyle={{color: 'white'}}
          xAxisLabelTextStyle={{
            color: 'black',
            fontSize: 12,
            margin: -2,
          }}
          hideRules
        />
    </View>
  );
};

export default SalesAnalysisFourthBarChart;

const styles = StyleSheet.create({
  container: {
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
  insideTopLabelText: {
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
  topLabelWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  insideTopLabel: {
    top: 20,
  },

  aboveBar: {
  },
});
