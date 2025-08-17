export type DrawerParamList = {
  Main: undefined;
  Profile: undefined;
  Settings: undefined;
  Reports: undefined;
  Categories: undefined;
  About: undefined;
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Transactions: undefined;
  AddTransaction: undefined;
  Analytics: undefined;
  Budget: undefined;
};

export type AuthStackParamList = {
  FirstScreen: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgetPass: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Dashboard: undefined;
  Drawer: undefined;
  TransactionDetail: { transactionId: string };
  EditTransaction: { transactionId: string };
};
