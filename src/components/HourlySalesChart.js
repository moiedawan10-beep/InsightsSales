// import {useEffect, useMemo, useState} from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import {LineChart} from 'react-native-gifted-charts';
// import {useSelector} from 'react-redux';
// import Theme from '../constants/Theme';
// import { ActivityIndicator } from 'react-native-paper';

// const HourlySalesChart = () => {
//   const {loading,hourlySales} = useSelector(state => state.hourlySales);
//   const [maxValue, setMaxValue] = useState(0);

//   // Transform data dynamically for the chart
//   const data = useMemo(() => {
//   const safeSales = Array.isArray(hourlySales) ? hourlySales : [];
//   const transformed = [...safeSales]
//     .sort((a, b) => a.Hour - b.Hour)
//     .map(item => ({
//       label: `${item.Hour}`,
//       value: item.NetSale,
//     }));

//   // Add 0 hour with 0 sale at the beginning
//   return [{ label: '0', value: 0 }, ...transformed];
// }, [hourlySales]);

//   useEffect(() => {
//     if (Array.isArray(hourlySales) && hourlySales.length > 0) {
//       const max = Math.max(...hourlySales.map(item => item.NetSale)) + 1000;
//       setMaxValue(max);
//     }
//   }, [hourlySales]);

//   if (loading) {
//     return (
//       <View style={{margin:60}} >
//         <ActivityIndicator size="large" color="white" />
//       </View>
//     );
//   }

//   if (!loading && (!hourlySales || hourlySales.length === 0)) {
//         return (
//           <View >
//             <Text style={{color: 'white',alignSelf:'center',margin:60}}>No Data Found</Text>
//           </View>
//         );
//       }

//   return (
//     <>
//       <Text
//         style={{
//           color: 'white',
//           position: 'absolute',
//           left: -18,
//           alignSelf: 'flex-start',
//           top: 170,
//           transform: [{rotate: '-90deg'}],
//         }}>
//         Net Sale
//       </Text>
//       <LineChart
//         data={data}
//         spacing={data.length<=3 ? 100 : 50}
//         endSpacing={data.length<=3 ? 70:30}
//         // initialSpacing={data.length<3 ? 80:50}
//         initialSpacing={0}
//         showVerticalLines
//         noOfSections={3}
//         verticalLinesColor={'white'}
//         yAxisLabelWidth={60}
//         yAxisColor={'white'}
//         yAxisTextStyle={{color: 'white', fontSize: 12}}
//         xAxisLabelTextStyle={{color: 'white', fontSize: 12}}
//         xAxisColor={'white'}
//         maxValue={maxValue}
//         color={'white'}
//         thickness={3}
//         dataPointsColor={Theme.COLORS.HeaderVariant}
//         curved
//       />
//       <Text style={{color: 'white', alignSelf: 'center'}}>Hour</Text>
//     </>
//   );
// };

// export default HourlySalesChart;

import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {ActivityIndicator} from 'react-native-paper';
import {useSelector} from 'react-redux';

const screenWidth = Dimensions.get('window').width;

const HourlySalesChart = () => {
  const {loading, hourlySales} = useSelector(state => state.hourlySales);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // console.log('HourlySalesData',hourlySales)
    if (!Array.isArray(hourlySales)) return;

    const sorted = [...hourlySales].sort((a, b) => a.Hour - b.Hour);
    const dataWithZero = [{Hour: 0, NetSale: 0}, ...sorted];

    const values = dataWithZero.map(item => item.NetSale ?? 0);
    const labels = dataWithZero.map(item => item.Hour.toString());

    const total = labels.length;
    const spacing = Math.floor(total / 2) || 1;

    const visibleLabels = labels.map((label, idx) =>
      idx === 0 || idx === total - 1 || idx === spacing ? label : '',
    );

    const formattedData = {
      labels: visibleLabels,
      datasets: [
        {
          data: values,
          strokeWidth: 3,
          color: () => 'white',
        },
      ],
    };

    setChartData(formattedData);
  }, [hourlySales]);

  if (loading) {
    return (
      <View style={{margin: 60}}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  if (
    !chartData ||
    !chartData.datasets ||
    chartData.datasets[0].data.length === 0 ||
    chartData.datasets[0].data.every(val => val === 0)
  ) {
    return (
      <View>
        <Text style={{color: 'white', alignSelf: 'center', margin: 60}}>
          No Data Found
        </Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: '#ff5a54',
    backgroundGradientTo: '#ff5a54',
    fillShadowGradient: '#ff5a54',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: () => '#fff',
    decimalPlaces: 0,
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: '#fff',
    },
    propsForDots: {
      r: '3',
      strokeWidth: '4',
      stroke: '#fff',
    },
  };

  return (
    <View>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        withInnerLines
        withOuterLines
        withDots
        segments={3}
        withShadow={false}
        bezier
        style={{
          marginLeft: -25,
        }}
      />

      <Text
        style={{
          textAlign: 'center',
          color: 'white',
          marginTop: 5,
          fontSize: 14,
        }}>
        Hour
      </Text>
    </View>
  );
};

export default HourlySalesChart;
