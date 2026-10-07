import React, {useMemo, useEffect, useState, useRef} from 'react';
import {View, Text as NativeText, StyleSheet} from 'react-native';
import Svg, {Path, Text, Line} from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';

const SalesAnalysisPieChart = ({Datatype,isVisible}) => {
  const {data, loading} = useSelector(state => state.categoryPercentage);

  const filteredData = useMemo(() => {
    // console.log('PieChartData', data);

    if (!data || !Array.isArray(data)) return [];
    if (!Datatype) return data;

    return data.filter(item => item.DateTyp === Datatype);
  }, [data, Datatype]);

  const chartData = useMemo(() => {
    if (!filteredData || !Array.isArray(data)) return [];

    const validData = filteredData.filter(
      item => item.GrossAmount && item.GrossAmount > 0,
    );

    const totalGross = validData.reduce(
      (sum, item) => sum + item.GrossAmount,
      0,
    );

    const colors = [
      '#b23b3b',
      '#c94c4c',
      '#e06666',
      '#f28b82',
      '#f7b6a2',
      '#ffccbc',
      '#a93226',
      '#d64545',
      '#ff6f61',
      '#e57373',
      '#f4a6a6',
      '#d32f2f',
      '#e53935',
      '#fbc6c6',
      '#ff9e9e',
    ];

    const rawChartData = validData.map((item, index) => {
      const value = item.GrossAmount;
      const color = colors[index % colors.length];
      const label = `${item.CategoryName}: ${(
        (value / totalGross) *
        100
      ).toFixed(1)}%`;
      return {value, color, label};
    });

    // Group small slices into "Others"
    const minVisiblePercentage = 2;
    const largeSlices = rawChartData.filter(
      d => (d.value / totalGross) * 100 >= minVisiblePercentage,
    );
    const smallSlices = rawChartData.filter(
      d => (d.value / totalGross) * 100 < minVisiblePercentage,
    );

    const othersValue = smallSlices.reduce((sum, d) => sum + d.value, 0);
    if (othersValue > 0) {
      largeSlices.push({
        value: othersValue,
        color: '#ccc',
        label: 'Others',
      });
    }

    return largeSlices;
  }, [filteredData]);

  const radius = 100;
  const labelRadius = radius + 15;
  const extraSpace = 60;

  const arcGenerator = useMemo(
    () => d3Shape.arc().outerRadius(radius).innerRadius(0),
    [radius],
  );

  // Precompute full arcs (angles) once
  const fullArcs = useMemo(() => {
    return d3Shape
      .pie()
      .value(d => d.value)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + 2 * Math.PI)(chartData);
  }, [chartData]);

  // Animation state: progress from 0 to 1
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationFrameRef = useRef(null);

  // Animate using requestAnimationFrame, updating progress state
  useEffect(() => {
  if (!isVisible) {
    setAnimationProgress(0);
    return;
  }

  let start = null;
  const duration = 1000;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    setAnimationProgress(progress);
    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }

  animationFrameRef.current = requestAnimationFrame(animate);

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAnimationProgress(0); // Reset on unmount or hidden
  };
}, [isVisible, chartData]);


  // Label opacity fade-in after pie chart animation
  const [labelOpacity, setLabelOpacity] = useState(0);
  const labelAnimationFrameRef = useRef(null);

  useEffect(() => {
  if (!isVisible || animationProgress < 1) {
    setLabelOpacity(0);
    return;
  }

  let start = null;
  const duration = 500;

  const fadeIn = timestamp => {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const opacityProgress = Math.min(elapsed / duration, 1);
    setLabelOpacity(opacityProgress);
    if (opacityProgress < 1) {
      labelAnimationFrameRef.current = requestAnimationFrame(fadeIn);
    }
  };

  labelAnimationFrameRef.current = requestAnimationFrame(fadeIn);

  return () => {
    if (labelAnimationFrameRef.current) {
      cancelAnimationFrame(labelAnimationFrameRef.current);
    }
  };
}, [animationProgress, isVisible]);


  if (loading) {
    return (
      <View style={[styles.container, {justifyContent: 'center'}]}>
        <ActivityIndicator size="large" color="#b23b3b" />
      </View>
    );
  }

  if (!loading && (!filteredData || filteredData.length === 0)) {
    return (
      <View style={styles.container}>
        <NativeText style={styles.title}>
          Category Wise Share Percentage
        </NativeText>
        <NativeText
          style={{
            color: 'black',
            fontSize: 16,
            alignSelf: 'center',
            marginTop: 100,
          }}>
          No Data Found
        </NativeText>
      </View>
    );
  }

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        overflow: 'visible',
      }}>
      <NativeText style={{fontSize: 18, marginBottom: 5, color: 'black'}}>
        Category Wise Share Percentage
      </NativeText>
      <Svg
        width={radius * 2 + 80 + extraSpace}
        height={radius * 2 + 80 + 40}
        viewBox={`-${radius + 5 + extraSpace / 2} -${radius + 50} ${
          2 * (radius + 40) + extraSpace
        } ${2 * (radius + 80 + 20)}`}>
        {fullArcs.map((arc, index) => {
          // Calculate max allowed endAngle based on animationProgress (0 to 1)
          const maxEndAngle = -Math.PI / 2 + animationProgress * 2 * Math.PI;

          // Clamp slice endAngle to animationProgress angle so the whole pie grows uniformly
          const interpolatedEndAngle = Math.min(arc.endAngle, maxEndAngle);

          // If slice is not yet visible (startAngle > maxEndAngle), skip drawing or draw with zero size
          if (arc.startAngle >= interpolatedEndAngle) {
            return null; // not visible yet
          }

          // Create interpolated arc with clamped endAngle
          const interpolatedArc = {
            ...arc,
            endAngle: interpolatedEndAngle,
          };

          const path = arcGenerator(interpolatedArc);

          // Calculate midAngle for labels/lines only if fully visible (animationProgress === 1)
          const midAngle =
            (interpolatedArc.startAngle + interpolatedArc.endAngle) / 2 -
            Math.PI / 2;
          const lineStartX = Math.cos(midAngle) * radius;
          const lineStartY = Math.sin(midAngle) * radius;
          const lineEndX = Math.cos(midAngle) * labelRadius;
          const lineEndY = Math.sin(midAngle) * labelRadius;

          return (
            <React.Fragment key={index}>
              <Path d={path} fill={chartData[index].color} />
              {animationProgress === 1 && (
                <>
                  <Line
                    x1={lineStartX}
                    y1={lineStartY}
                    x2={lineEndX}
                    y2={lineEndY}
                    stroke={chartData[index].color}
                    strokeWidth={2}
                    opacity={labelOpacity}
                  />
                  <Text
                    x={lineEndX + (lineEndX > 0 ? 10 : -10)}
                    y={lineEndY}
                    fill={chartData[index].color}
                    fontSize={12}
                    textAnchor={lineEndX > 0 ? 'start' : 'end'}
                    alignmentBaseline="middle"
                    opacity={labelOpacity}>
                    {chartData[index].label}
                  </Text>
                </>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

export default SalesAnalysisPieChart;

const styles = StyleSheet.create({
  container: {
    height: 320,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    color: 'black',
    marginVertical: 10,
  },
});


// import React, { useMemo } from 'react';
// import { View, Text, Dimensions } from 'react-native';
// import { PieChart } from 'react-native-chart-kit';
// import { useSelector } from 'react-redux';
// import { ActivityIndicator } from 'react-native-paper';

// const screenWidth = Dimensions.get('window').width;

// const SalesAnalysisPieChart = ({ Datatype, isVisible }) => {
//   const { data, loading } = useSelector(state => state.categoryPercentage);

//   const filteredData = useMemo(() => {
//     if (!data || !Array.isArray(data)) return [];
//     if (!Datatype) return data;
//     return data.filter(item => item.DateTyp === Datatype);
//   }, [data, Datatype]);

//   const chartData = useMemo(() => {
//     if (!filteredData || !Array.isArray(data)) return [];

//     const validData = filteredData.filter(
//       item => item.GrossAmount && item.GrossAmount > 0
//     );

//     const totalGross = validData.reduce(
//       (sum, item) => sum + item.GrossAmount,
//       0
//     );

//     const colors = [
//       '#b23b3b', '#c94c4c', '#e06666', '#f28b82', '#f7b6a2', '#ffccbc',
//       '#a93226', '#d64545', '#ff6f61', '#e57373', '#f4a6a6', '#d32f2f',
//       '#e53935', '#fbc6c6', '#ff9e9e',
//     ];

//     const rawChartData = validData.map((item, index) => {
//       const value = item.GrossAmount;
//       const color = colors[index % colors.length];
//       const percentage = ((value / totalGross) * 100).toFixed(1);
      
//       return {
//         name: `${item.CategoryName} (${percentage}%)`,
//         population: value,
//         color,
//         legendFontColor: '#000',
//         legendFontSize: 10,
//       };
//     });

//     const minVisiblePercentage = 2;
//     const largeSlices = rawChartData.filter(
//       d => ((d.population / totalGross) * 100) >= minVisiblePercentage
//     );
//     const smallSlices = rawChartData.filter(
//       d => ((d.population / totalGross) * 100) < minVisiblePercentage
//     );

//     const othersValue = smallSlices.reduce((sum, d) => sum + d.population, 0);
//     if (othersValue > 0) {
//       largeSlices.push({
//         name: 'Others',
//         population: othersValue,
//         color: '#ccc',
//         legendFontColor: '#000',
//         legendFontSize: 10,
//       });
//     }

//     return largeSlices;
//   }, [filteredData]);

//   if (loading) {
//     return (
//       <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#b23b3b" />
//       </View>
//     );
//   }

//   if (!loading && (!filteredData || filteredData.length === 0)) {
//     return (
//       <View style={{ height: 300, justifyContent: 'center', alignItems: 'center' }}>
//         <Text style={{ color: 'black', fontSize: 16 }}>No Data Found</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={{ alignItems: 'center', padding: 10 }}>
//       <Text style={{ fontSize: 18, marginBottom: 5, color: 'black' }}>
//         Category Wise Share Percentage
//       </Text>
//       <PieChart
//         data={chartData}
//         width={screenWidth - 30}
//         height={250}
//         chartConfig={{
//           backgroundGradientFrom: 'white',
//           backgroundGradientTo: 'white',
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//         }}
//         accessor={'population'}
//         backgroundColor={'transparent'}
//         paddingLeft={'5'}
//         absolute
//       />
//     </View>
//   );
// };

// export default SalesAnalysisPieChart;
