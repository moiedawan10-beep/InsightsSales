import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import DashboardHeader from '../components/DashboardHeader';
import Theme from '../constants/Theme';
import RunningOrdersChart from '../components/RunningOrdersChart';
import SalesAnalysisCarousel from '../components/SalesAnalysisCarousal';
import CustomSegmentedControl from '../components/CustomSegmentedControl';
import TopSellingItems from '../components/TopSellingItems';
import HourlySalesChart from '../components/HourlySalesChart';
import SalesOverviewChart from '../components/SalesOverviewChart';
import Payment_AnalysisCarousel from '../components/Payment_AnalysisCarousal';
import {useDispatch, useSelector} from 'react-redux';
import {RefreshControl} from 'react-native';
import {
  getAverageSales,
  getCategoryWiseSharePercentage,
  getDineInCovers,
  getHourlySales,
  getLocations,
  getMonthlySales,
  getPettyExpenses,
  getRunningOrdersData,
  getSalesAnalysisServiceWiseSales,
  getSalesAnalysisSummaryData,
  getSupplierPayments,
  getTopSellingItems,
  getVoidOrders,
  getWeeklySales,
  getYearlySales,
} from '../utils/DataFetchingFunctions';

const Dashboard = () => {
  const dispatch = useDispatch();
  const {voidOrders} = useSelector(state => state.voidOrders);
  const {averageSale} = useSelector(state => state.averageSales);
  const [salesData, setSalesData] = useState('Today');
  const [expenseData, setExpenseData] = useState('Today');
  const [area, setArea] = useState(null);
  const [salesOverviewData, setSalesOverviewData] = useState('Weekly');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loadData = async () => {
    getRunningOrdersData(dispatch, area);
    getSalesAnalysisSummaryData(dispatch, area);
    getSalesAnalysisServiceWiseSales(dispatch, area);
    getCategoryWiseSharePercentage(dispatch, area);
    getDineInCovers(dispatch, area);
    getWeeklySales(dispatch, area);
    getMonthlySales(dispatch, area);
    getYearlySales(dispatch, area);
    getHourlySales(dispatch, area);
    getTopSellingItems(dispatch, area);
    getVoidOrders(dispatch, area);
    getAverageSales(dispatch, area);
    getSupplierPayments(dispatch, area);
    getPettyExpenses(dispatch, area);
  };

  useEffect(() => {
    if (area === null) return;
    loadData();
  }, [area]);

  // useEffect(() => {
  //   console.log('VoidOrdersData',voidOrders)
  // }, [voidOrders]);

  // useEffect(() => {
  //   console.log('AverageSalesData',averageSale)
  // }, [averageSale]);

  useEffect(() => {
    getLocations(dispatch);
  }, []);

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={100}
        />
      }>
      <DashboardHeader handleLocation={id => setArea(id)} />

      {/* BarChart */}
      <RunningOrdersChart isVisible />

      {/* SALES ANALYSIS */}
      <View style={styles.analysisContainer}>
        <Text style={[styles.title, {color: Theme.COLORS.ButtonVariant}]}>
          Sales Analysis
        </Text>

        <CustomSegmentedControl
          options={['Today', 'MTD']}
          selected={salesData}
          onSelect={setSalesData}
        />
        <SalesAnalysisCarousel Datatype={salesData} />
      </View>

      {/* SALES OVERVIEW */}
      <View style={styles.overviewContainer}>
        <Text style={[styles.title, {color: Theme.COLORS.ButtonVariant}]}>
          Sales Overview
        </Text>
        <CustomSegmentedControl
          options={['Weekly', 'Monthly', 'Yearly']}
          selected={salesOverviewData}
          onSelect={setSalesOverviewData}
        />
        <SalesOverviewChart
          key={salesOverviewData}
          isVisible={true}
          Datatype={salesOverviewData}
        />
      </View>

      {/* Hourly Sales Trend */}
      <View style={styles.salesTrendContainer}>
        <Text style={[styles.title, {color: 'white'}]}>
          Hourly Sales Trends
        </Text>
        <HourlySalesChart />
      </View>

      {/* Top Selling Items */}
      <View style={styles.sellingItemsContainer}>
        {/* <Text
          style={[
            styles.title,
            {color: Theme.COLORS.ButtonVariant, marginTop: 10},
          ]}>
          Top 10 Selling Items
        </Text> */}
        <TopSellingItems />
      </View>

      {/* Void Orders */}
      <View style={styles.voidOrderContainer}>
        <View style={styles.voidOrderHeading}>
          <Text style={[styles.title, {fontSize: 16}]}>Void Orders:</Text>
          <Text style={[styles.title, {fontSize: 16}]}>Orders Amount:</Text>
        </View>
        <View style={styles.voidOrderHeading}>
          <Text style={[styles.title, {fontSize: 16}]}>
            {(voidOrders && voidOrders[0]?.NoOfVoidOrders) || 'N/A'}
          </Text>
          <Text style={[styles.title, {fontSize: 16}]}>
            {(voidOrders && voidOrders[0]?.OrderAmount.toLocaleString()) ||
              'N/A'}
          </Text>
        </View>
      </View>

      {/* Average Sale */}
      {averageSale?.length > 0 && (
        <View
          style={[
            styles.voidOrderContainer,
            {backgroundColor: 'white', paddingVertical: 30},
          ]}>
          <Text
            style={[
              styles.title,
              {
                color: Theme.COLORS.chartBackground,
                fontSize: 20,
                marginBottom: 10,
              },
            ]}>
            Average Sale
          </Text>
          <View style={styles.voidOrderHeading}>
            <Text
              style={[
                styles.title,
                {fontSize: 16, color: Theme.COLORS.chartBackground},
              ]}>
              MTD Average Sales
            </Text>
            <Text
              style={[
                styles.title,
                {fontSize: 16, color: Theme.COLORS.chartBackground},
              ]}>
              MTD Per Head Sales
            </Text>
          </View>
         <View style={styles.voidOrderHeading}>
  <Text style={[styles.title, {fontSize: 20, color: 'black'}]}>
    {(averageSale?.[0]?.MTDAverageSale ?? 0).toLocaleString()}
  </Text>
  <Text style={[styles.title, {fontSize: 20, color: 'black'}]}>
    {(averageSale?.[0]?.MTDPerHeadSale ?? 0).toLocaleString()}
  </Text>
</View>

        </View>
      )}

      {/* Payment & Expenses */}
      <View style={styles.analysisContainer}>
        <Text style={[styles.title, {color: Theme.COLORS.ButtonVariant}]}>
          Payment & Expenses
        </Text>

        <CustomSegmentedControl
          options={['Today', 'MTD']}
          selected={expenseData}
          onSelect={setExpenseData}
        />
        <Payment_AnalysisCarousel
          // key={expenseData}
          Datatype={expenseData}
        />
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.COLORS.otherVariant,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  analysisContainer: {
    backgroundColor: 'white',
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  overviewContainer: {
    backgroundColor: 'white',
    marginTop: 15,
    zIndex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  salesTrendContainer: {
    backgroundColor: Theme.COLORS.chartBackground,
    marginTop: -30,
    marginBottom: 20,
    paddingTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sellingItemsContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 10,
    overflow: 'hidden',
  },
  voidOrderContainer: {
    backgroundColor: Theme.COLORS.chartBackground,
    borderRadius: 10,
    paddingVertical: 20,
    marginBottom: 10,
  },
  voidOrderHeading: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  amountLabel: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
    borderWidth: 1,
    textAlign: 'center',
  },
  xAxisLabel: {
    color: '#fff',
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
    color: 'white',
    position: 'absolute',
    left: -10,
    top: 150,
    fontWeight: 'bold',
    fontSize: 14,
    transform: [{rotate: '-90deg'}],
  },
});
