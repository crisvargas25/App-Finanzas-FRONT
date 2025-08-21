// screens/CategoriesScreen.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CategoryItem from "./CategoryItem";
import AddCategoryModal from "./AddCategoryModal";
import { useCategories } from "./hooks/useCategories";

const CategoriesScreen: React.FC = () => {
  const { categories, addCategory, editCategory, removeCategory } = useCategories();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSave = async (category: any) => {
    if (editMode && selectedCategory) {
      await editCategory(selectedCategory._id, category);
    } else {
      await addCategory(category);
    }
    setModalVisible(false);
    setEditMode(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <Text style={styles.subtitle}>Manage your income and expense categories</Text>

      {/* Botón Nueva Categoría */}
      <TouchableOpacity
        style={styles.newButton}
        onPress={() => {
          setEditMode(false);
          setSelectedCategory(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.newButtonText}>+ New Category</Text>
      </TouchableOpacity>

      {/* Tabs (ejemplo) */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de categorías */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            onEdit={() => {
              setSelectedCategory(item);
              setEditMode(true);
              setModalVisible(true);
            }}
            onDelete={() => removeCategory(item._id)}
          />
        )}
        contentContainerStyle={styles.list}
      />

      {/* Modal Crear/Editar */}
      <AddCategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        initialData={editMode ? selectedCategory : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  title: { fontSize: 24, fontWeight: "bold", color: "#3533cd", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#373643", marginBottom: 20 },
  newButton: {
    backgroundColor: "#22c55e",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  newButtonText: { color: "#fff", fontWeight: "bold" },
  filterContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  filterIcon: { marginRight: 5 },
  filterTitle: { fontSize: 16, color: "#373643" },
  tabs: { flexDirection: "row", marginBottom: 20 },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#fff",
  },
  activeTab: { backgroundColor: "#22c55e" },
  tabText: { color: "#373643", fontWeight: "bold" },
  activeTabText: { color: "#fff" },
  list: { paddingBottom: 20 },
});

export default CategoriesScreen;
