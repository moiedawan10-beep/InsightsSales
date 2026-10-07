import React, {useRef, useState} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import PaymentExpensesBarChart from './PaymentExpensesBarChart';
import PaymentExpensesSecondChart from './PaymentExpensesSecondChart';
import Theme from '../constants/Theme';

const {width} = Dimensions.get('window');

const Payment_AnalysisCarousel = ({Datatype}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(300);
  const data = [0, 1];

  const onLayoutSlide = event => {
    const {height} = event.nativeEvent.layout;
    setCarouselHeight(height);
  };

  const renderPagination = () => (
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
  return (
    <View>
      <Carousel
        loop={false}
        width={width}
        height={carouselHeight}
        data={data}
        onSnapToItem={index => setActiveIndex(index)}
        renderItem={({index}) => (
          <View
            style={{paddingBottom: 30}}
            onLayout={index === activeIndex ? onLayoutSlide : undefined}>
            {index === 0 && (
              <PaymentExpensesBarChart
                isVisible={index === activeIndex}
                Datatype={Datatype}
              />
            )}
            {index === 1 && (
              <PaymentExpensesSecondChart
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

export default Payment_AnalysisCarousel;
