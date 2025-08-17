import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../ui/text';

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    paddingBottom: 9,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#122c6f',
  },
});

type TabSwitcherProps = {
  onTabChange: (tab: 'login' | 'signup') => void;
  activeTab?: 'login' | 'signup';
};

function TabSwitcher({ onTabChange, activeTab: propActiveTab }: TabSwitcherProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(propActiveTab || 'login');

  React.useEffect(() => {
    if (propActiveTab && propActiveTab !== activeTab) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  const handleTabChange = (tab: 'login' | 'signup') => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'login' && styles.activeTab]}
        onPress={() => handleTabChange('login')}
      >
        <Text 
          size="md" 
          type={activeTab === 'login' ? 'navyBlueText' : 'grayText'}
        >
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tab, activeTab === 'signup' && styles.activeTab]}
        onPress={() => handleTabChange('signup')}
      >
        <Text 
          size="md" 
          type={activeTab === 'signup' ? 'navyBlueText' : 'grayText'}
        >
          Sign-up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default TabSwitcher;
