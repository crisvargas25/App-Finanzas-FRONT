import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../shared/ui/text';
import { ScrollView } from 'react-native-gesture-handler';
import MainContainer from '../components/common/containers/mainContainer';
import Header from '../components/common/headings/header';

export default function AboutScreen() {
  return (
    <ScrollView>
      <MainContainer>
        <Header title="About" description='Learn more about our application' />

        <View style={styles.section}>
          <Text size='md' type="cbBlueText">Introduction</Text>
          <Text>
          This project focuses on the development of a mobile application specialized in personal expense management, with the aim of providing users with detailed control over their daily financial transactions. By recording expenses, categorizing them by item, and displaying data through graphs and tables, the application facilitates informed decision-making about the use of financial resources. The solution was developed with React Native and TypeScript, incorporating local storage and cloud synchronization mechanisms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text size='md' type="cbBlueText">Development Focus</Text>
          <Text>
          During development, features focused on recording and analyzing user expenses will be designed and implemented. The interface will allow users to add, edit, and delete expense records, as well as assign categories and dates for more effective tracking.
          To create an intuitive and efficient experience, Drawer Navigator and Bottom Navigator will be integrated, providing quick access to the main sections: expense recording, history, reports, and settings. Data will be managed using local state for filters and editing, while critical information such as the monthly balance will be stored in global state.
          The application will include a balance calculation hook that will process expense data and alert when budget limits are reached. It will also feature dynamic charts and tables that will display information organized by categories and periods.
          In the backend, Express.js with JWT will be implemented for data security, and financial information will be encrypted before being stored in local SQLite and MongoDB in the cloud. The project will be developed following the KANBAN methodology, with a division by modules that will allow for gradual and controlled implementation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text size='md' type="cbBlueText">Implementation Details</Text>
          <Text>
          The implementation will be carried out in several stages, starting with the design of the user interface and the establishment of the database schema. Subsequently, the core functionalities will be developed, including expense recording, categorization, and reporting features.
          Throughout the development process, user feedback will be actively sought to ensure that the application meets the needs and expectations of its target audience. Regular testing and iteration will be conducted to refine the user experience and address any issues that arise.
          </Text>
        </View>

        <View style={styles.section}>
          <Text size='md' type="cbBlueText">Points to Consider</Text>
          <Text>
           Application for tracking expenses, income, budgets, and savings goals.

            • Features:
            • Drawer Navigator + Bottom Navigator
            • Local status for editing entries and filters 
            • Global status for monthly budget and goals
            • Custom components such as graphs and dynamic tables
            • Hook for balance calculation and alerts
            • Token for secure authentication
            • Financial data encryption
            • Database: Local SQLite + MongoDB in the cloud
            • Backend with Express.js + JWT
            • Development with KANBAN by modules
            • Icon implementation
          </Text>
        </View>

      <View style={styles.sectionTeam}>
        <Text size='md' type="cbBlueText">Team</Text>
        <Text>
          • Antunez Ramirez Diego
          • Niebla Rosales Natalia
          • Vargas Perez Cristian Arturo
          • Villarreal Gallegos Daniel Aurelio
          • Vázquez Karen
        </Text>
      </View>

      </MainContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTeam: {
    marginTop: 16,
    marginBottom: 16,
  },
});