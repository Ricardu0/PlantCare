// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Appbar,
  FAB,
  Searchbar,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { usePlants } from '../hooks/usePlants';
import { PlantCard } from '../components/PlantCard';
import { Planta } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    plantas,
    isLoading,
    error,
    refetch,
    deletePlant,
    updateWatering,
    isDeleting,
  } = usePlants();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredPlantas = plantas.filter((plant) =>
    plant.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWaterPlant = async (plant: Planta) => {
    try {
      const now = new Date().toISOString();
      await updateWatering({ id: plant.id, date: now });
      Alert.alert('Sucesso', `${plant.nome} foi regada!`);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível registrar a rega');
    }
  };

  const handleDeletePlant = (plant: Planta) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir ${plant.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePlant(plant.id);
              Alert.alert('Sucesso', 'Planta excluída');
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir a planta');
            }
          },
        },
      ]
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        🌱 Nenhuma planta cadastrada
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        Adicione sua primeira planta usando o botão +
      </Text>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando plantas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="headlineSmall">❌ Erro ao carregar</Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          Verifique se o backend está rodando
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="PlantCare" />
        <Appbar.Action
          icon="refresh"
          onPress={onRefresh}
          disabled={refreshing}
        />
      </Appbar.Header>

      <Searchbar
        placeholder="Buscar plantas..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredPlantas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PlantCard
            plant={item}
            onPress={() =>
              navigation.navigate('PlantDetails', { plantId: item.id })
            }
            onWater={() => handleWaterPlant(item)}
            onDelete={() => handleDeletePlant(item)}
          />
        )}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={
          filteredPlantas.length === 0 && styles.emptyListContent
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddPlant')}
        label="Adicionar"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#757575',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});