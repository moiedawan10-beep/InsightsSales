import React, {useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import SalesAnalysisSecondBarChart from './SalesAnalysisSecondBarChart';
import SalesAnalysisPieChart from './SalesAnalysisPieChart';
import Theme from '../constants/Theme';
import SalesAnalysisFirstBarChart from './SalesAnalysisFirstBarChart';
import SalesAnalysisFourthBarChart from './SalesAnalysisFourthChart';

const {width} = Dimensions.get('window');

const SalesAnalysisCarousel = ({Datatype}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(300);

  const data = [0, 1, 2, 3];

  const onLayoutSlide = event => {
    const {height} = event.nativeEvent.layout;
    setCarouselHeight(height);
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View>
      <Carousel
        loop={false}
        width={width}
        height={300}
        data={data}
        onSnapToItem={index => setActiveIndex(index)}
        renderItem={({index}) => (
          <View onLayout={index === activeIndex ? onLayoutSlide : undefined}>
            {index === 0 && (
              <SalesAnalysisFirstBarChart
                isVisible={index === activeIndex}
                Datatype={Datatype}
              />
            )}
            {index === 1 && (
              <SalesAnalysisSecondBarChart
                isVisible={index === activeIndex}
                Datatype={Datatype}
              />
            )}
            {index === 2 && (
              <SalesAnalysisPieChart
                isVisible={index === activeIndex}
                Datatype={Datatype}
              />
            )}
            {index === 3 && (
              <SalesAnalysisFourthBarChart
                isVisible={index === activeIndex}
                Datatype={Datatype}
              />
            )}
          </View>
        )}
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Theme.COLORS.selectedsegmentVariant,
  },
  inactiveDot: {
    backgroundColor: '#d68e85',
    borderWidth: 1,
    borderColor: Theme.COLORS.HeaderVariant,
  },
});

export default SalesAnalysisCarousel;
