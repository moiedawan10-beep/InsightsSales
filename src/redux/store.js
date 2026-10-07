import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './Slices/loginSlice';
import verifyPinReducer from './Slices/VerifyPinSlice';
import RunningOrdersReducer from './Slices/RunningOrdersSlice';
import SalesAnalysisSummaryReducer from './Slices/SalesAnalysisSummarySlice';
import SalesAnalysisServiceTypeSalesReducer from './Slices/SalesAnalysisServiceTypeWiseSales';
import SalesAnalysisCategoryPercantageReducer from './Slices/SalesAnalysisCategoryPercentageSlice';
import SalesAnalysisDineInCoversReducer from './Slices/SalesAnalysisDineInCoversSlice';
import WeeklySalesReducer from './Slices/WeeklySalesSlice';
import MonthlySalesReducer from './Slices/MonthlySalesSlice';
import YearlySalesReducer from './Slices/YearlySalesSlice';
import HourlySalesReducer from './Slices/HourlySalesSlice';
import TopSellingItemsReducer from './Slices/TopSellingItemsSlice';
import VoidOrdersReducer from './Slices/VoidOrdersSlice';
import AverageSalesReducer from './Slices/AverageSalesSlice';
import SupplierPaymentReducer from './Slices/SupplierPaymentSlice';
import PettyExpensesReducer from './Slices/PettyExpensesSlice';
import LocationReducer from './Slices/LocationSlice';

const store = configureStore({
  reducer: {
    login: loginReducer,
    verifyPin: verifyPinReducer,
    runningOrders: RunningOrdersReducer,
    salesSummary: SalesAnalysisSummaryReducer,
    typeWiseSales: SalesAnalysisServiceTypeSalesReducer,
    categoryPercentage: SalesAnalysisCategoryPercantageReducer,
    dineInCovers: SalesAnalysisDineInCoversReducer,
    weeklySales: WeeklySalesReducer,
    monthlySales:MonthlySalesReducer,
    yearlySales:YearlySalesReducer,
    hourlySales: HourlySalesReducer,
    topItems:TopSellingItemsReducer,
    voidOrders: VoidOrdersReducer,
    averageSales: AverageSalesReducer,
    supplierPayment: SupplierPaymentReducer,
    pettyExpense: PettyExpensesReducer,
    locations: LocationReducer,
  },
});

export default store;
