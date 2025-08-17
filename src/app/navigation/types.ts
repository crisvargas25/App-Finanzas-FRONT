export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TransactionDetail: { transactionId: string };
  EditTransaction: { transactionId: string };
};

export type AuthStackParamList = {
  AuthScreen: undefined;
  ForgetPass: undefined;
};

export type DrawerParamList = {
  Tabs: undefined;
  Profile: undefined;
  Settings: undefined;
  Reports: undefined;
  Categories: undefined;
  About: undefined;
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  Budget: undefined;
  Goals: undefined;
};