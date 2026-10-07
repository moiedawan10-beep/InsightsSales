// generates mock data into mock-api/v1 (one file per endpoint per branch, 0 = all)
// fixed seed so the output is always the same
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'v1');

let seed = 20250514;
const random = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const between = (min, max) => Math.round(min + random() * (max - min));

const BRANCHES = [
  {DISTRIBUTOR_ID: 1, DISTRIBUTOR_NAME: 'Gulberg Branch', scale: 1.2},
  {DISTRIBUTOR_ID: 2, DISTRIBUTOR_NAME: 'DHA Phase 5', scale: 1},
  {DISTRIBUTOR_ID: 3, DISTRIBUTOR_NAME: 'Model Town', scale: 0.7},
];
const ALL = {
  DISTRIBUTOR_ID: 0,
  scale: BRANCHES.reduce((sum, b) => sum + b.scale, 0),
};

const DATE_TYPES = [
  {DateType: 'Today', factor: 1},
  {DateType: 'MTD', factor: 7},
];
const SERVICE_TYPES = ['Dine In', 'Take Away', 'Delivery'];
const CATEGORIES = ['Burgers', 'Pizza', 'BBQ', 'Beverages', 'Desserts', 'Sides'];
const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SUPPLIERS = ['Fresh Farms', 'City Meat Co', 'Golden Bakery', 'Dairy Fresh', 'Spice Traders'];
const EXPENSE_HEADS = ['Utilities', 'Fuel', 'Repairs', 'Cleaning', 'Staff Meals', 'Stationery'];
const DEALS = [
  'Family Feast', 'Midnight Deal', 'Student Combo', 'Burger Duo', 'Pizza Party',
  'Lunch Box', 'BBQ Platter', 'Weekend Bucket', 'Kids Meal', 'Sharing Deal',
];
const ITEMS = [
  'Zinger Burger', 'Chicken Tikka Pizza', 'Beef Smash Burger', 'Loaded Fries',
  'Malai Boti', 'Mint Margarita', 'Chocolate Lava Cake', 'Club Sandwich',
  'Chicken Wings', 'Cold Coffee',
];

const branchData = ({scale}) => {
  const s = value => Math.round(value * scale);

  const salesSummary = DATE_TYPES.map(({DateType, factor}) => {
    const GrossSales = s(between(180000, 260000) * factor);
    const CreditCardSales = Math.round(GrossSales * (0.35 + random() * 0.2));
    return {
      DateType,
      GrossSales,
      Discount: Math.round(GrossSales * 0.05),
      SalesTax: Math.round(GrossSales * 0.16),
      ServiceCharges: Math.round(GrossSales * 0.04),
      CreditCardSales,
      CashSales: GrossSales - CreditCardSales,
    };
  });

  const serviceTypeSales = DATE_TYPES.flatMap(({DateType, factor}) =>
    SERVICE_TYPES.map(ServiceType => {
      const NoOfInvoices = s(between(25, 90) * factor);
      return {DateType, ServiceType, NoOfInvoices, NetAmount: NoOfInvoices * between(1400, 2600)};
    }),
  );

  const dineInCovers = DATE_TYPES.map(({DateType, factor}) => {
    const NoOfInvoices = s(between(30, 70) * factor);
    return {
      DateType,
      Covers: NoOfInvoices * between(2, 4),
      NoOfInvoices,
      NetAmount: NoOfInvoices * between(3000, 5500),
    };
  });

  const topItems = names =>
    names
      .map(SKU_NAME => {
        const TotalOrders = s(between(40, 400));
        return {SKU_NAME, TotalOrders, GrossAmount: TotalOrders * between(600, 2400)};
      })
      .sort((a, b) => b.TotalOrders - a.TotalOrders);

  return {
    'running-orders': SERVICE_TYPES.map(ServiceType => {
      const NoOfOrders = s(between(2, 18));
      return {ServiceType, NoOfOrders, GrossAmount: NoOfOrders * between(1500, 4000)};
    }),
    'sales-summary': salesSummary,
    'service-type-sales': serviceTypeSales,
    // original api had this typo, the pie chart reads DateTyp
    'category-sales': DATE_TYPES.flatMap(({DateType, factor}) =>
      CATEGORIES.map(CategoryName => ({
        DateTyp: DateType,
        CategoryName,
        GrossAmount: s(between(15000, 60000) * factor),
      })),
    ),
    'dine-in-covers': dineInCovers,
    'weekly-sales': WEEK_DAYS.map(WeekDay => ({WeekDay, GrossSales: s(between(150000, 320000))})),
    'monthly-sales': MONTHS.map(Month => ({Month, GrossSales: s(between(4500000, 8500000))})),
    'yearly-sales': ['2021', '2022', '2023', '2024', '2025'].map((Year, i) => ({
      Year,
      GrossSales: s(between(50000000, 60000000) * (1 + i * 0.15)),
    })),
    'hourly-sales': Array.from({length: 13}, (_, i) => ({
      Hour: i + 11,
      NetSale: s(between(5000, 35000) * (i >= 7 && i <= 10 ? 2 : 1)),
    })),
    // [deals, items]
    'top-selling-items': [topItems(DEALS), topItems(ITEMS)],
    'void-orders': [{NoOfVoidOrders: s(between(1, 8)), OrderAmount: s(between(3000, 15000))}],
    'average-sales': [{MTDAverageSale: s(between(200000, 260000)), MTDPerHeadSale: between(1200, 1900)}],
    'supplier-payments': DATE_TYPES.flatMap(({DateType, factor}) =>
      SUPPLIERS.map(Supplier => ({DateType, Supplier, Payments: s(between(5000, 40000) * factor)})),
    ),
    'petty-expenses': DATE_TYPES.flatMap(({DateType, factor}) =>
      EXPENSE_HEADS.map(Head => ({DateType, Head, ExpenseAmount: s(between(500, 6000) * factor)})),
    ),
  };
};

const writeJson = (relativePath, rows) => {
  const file = path.join(OUT_DIR, relativePath);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, JSON.stringify({Rows: rows}, null, 2) + '\n');
};

fs.rmSync(OUT_DIR, {recursive: true, force: true});

writeJson('clients.json', [
  {CustomerCode: '1234', ClientName: 'Insights Demo Restaurant', ClientConnString: 'demo-tenant-1'},
]);
writeJson(
  'locations.json',
  BRANCHES.map(({DISTRIBUTOR_ID, DISTRIBUTOR_NAME}) => ({DISTRIBUTOR_ID, DISTRIBUTOR_NAME})),
);

for (const branch of [ALL, ...BRANCHES]) {
  for (const [endpoint, rows] of Object.entries(branchData(branch))) {
    writeJson(`${endpoint}/${branch.DISTRIBUTOR_ID}.json`, rows);
  }
}

console.log(`Dummy API written to ${OUT_DIR}`);
