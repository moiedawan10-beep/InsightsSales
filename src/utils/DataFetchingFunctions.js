import {AverageSalesAction} from '../redux/Slices/AverageSalesSlice';
import {HourlySalesAction} from '../redux/Slices/HourlySalesSlice';
import {LocationAction} from '../redux/Slices/LocationSlice';
import {MonthlySalesAction} from '../redux/Slices/MonthlySalesSlice';
import {PettyExpensesAction} from '../redux/Slices/PettyExpensesSlice';
import {RunningOrdersAction} from '../redux/Slices/RunningOrdersSlice';
import {SalesAnalysisCategoryPercantageAction} from '../redux/Slices/SalesAnalysisCategoryPercentageSlice';
import {SalesAnalysisDineInCoversAction} from '../redux/Slices/SalesAnalysisDineInCoversSlice';
import {SalesAnalysisServiceTypeSalesAction} from '../redux/Slices/SalesAnalysisServiceTypeWiseSales';
import {SalesAnalysisSummaryAction} from '../redux/Slices/SalesAnalysisSummarySlice';
import {SupplierPaymentAction} from '../redux/Slices/SupplierPaymentSlice';
import {TopSellingItemsAction} from '../redux/Slices/TopSellingItemsSlice';
import {VoidOrdersAction} from '../redux/Slices/VoidOrdersSlice';
import {WeeklySalesAction} from '../redux/Slices/WeeklySalesSlice';
import {YearlySalesAction} from '../redux/Slices/YearlySalesSlice';

const getRunningOrdersData = async (dispatch, area) => {
  try {
    const response = await dispatch(RunningOrdersAction(area));
    // console.log('RunningOrdersScreen Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};


const getSalesAnalysisSummaryData = async (dispatch, area) => {
  try {
    const response = await dispatch(SalesAnalysisSummaryAction(area));
    // console.log('SalesAnalysisSummary Data', response);
    return response;
  } catch (error) {
    console.error('Error fetching SalesAnalysisSummary', error);
    throw error;
  }
};

const getSalesAnalysisServiceWiseSales = async (dispatch, area) => {
  try {
    const response = await dispatch(SalesAnalysisServiceTypeSalesAction(area));
    // console.log('ServiceWiseSales Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getCategoryWiseSharePercentage = async (dispatch, area) => {
  try {
    const response = await dispatch(
      SalesAnalysisCategoryPercantageAction(area),
    );
    // console.log('CategoryWiseShare% Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getDineInCovers = async (dispatch, area) => {
  try {
    const response = await dispatch(SalesAnalysisDineInCoversAction(area));
    // console.log('DineInCovers Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getWeeklySales = async (dispatch, area) => {
  try {
    const response = await dispatch(WeeklySalesAction(area));
    // console.log('WeeklySales Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getMonthlySales = async (dispatch, area) => {
  try {
    const response = await dispatch(MonthlySalesAction(area));
    // console.log('MonthlySales Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getYearlySales = async (dispatch, area) => {
  try {
    const response = await dispatch(YearlySalesAction(area));
    // console.log('YearlySales Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getHourlySales = async (dispatch, area) => {
  try {
    const response = await dispatch(HourlySalesAction(area));
    // console.log('HourlySales Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getTopSellingItems = async (dispatch, area) => {
  try {
    const response = await dispatch(TopSellingItemsAction(area));
    // console.log('TopSellingItems Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getVoidOrders = async (dispatch, area) => {
  try {
    const response = await dispatch(VoidOrdersAction(area));
    // console.log('VoidOrders Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getAverageSales = async (dispatch, area) => {
  try {
    const response = await dispatch(AverageSalesAction(area));
    // console.log('AverageSales Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getSupplierPayments = async (dispatch, area) => {
  try {
    const response = await dispatch(SupplierPaymentAction(area));
    // console.log('SupplierPayment Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getPettyExpenses = async (dispatch, area) => {
  try {
    const response = await dispatch(PettyExpensesAction(area));
    // console.log('PettyExpenses Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

const getLocations = async dispatch => {
  try {
    const response = await dispatch(LocationAction());
    // console.log('Locations Response', response);
  } catch (error) {
    console.log('Error', error);
  }
};

export {
  getRunningOrdersData,
  getSalesAnalysisSummaryData,
  getSalesAnalysisServiceWiseSales,
  getCategoryWiseSharePercentage,
  getDineInCovers,
  getWeeklySales,
  getMonthlySales,
  getYearlySales,
  getHourlySales,
  getTopSellingItems,
  getVoidOrders,
  getAverageSales,
  getSupplierPayments,
  getPettyExpenses,
  getLocations,
};
