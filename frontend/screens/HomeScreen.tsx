// src/screens/HomeScreen.tsx - VERSÃO REFACTORED COMPLETA
import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  Platform,
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
  } = usePlants();

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  //-----------------------------------------------
  // REFRESH
  //-----------------------------------------------
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  //-----------------------------------------------
  // FILTRAGEM
  //-----------------------------------------------
  const filteredPlantas = plantas.filter((plant) =>
    plant.nome.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  //-----------------------------------------------
  // LÓGICA DE REGAR
  //-----------------------------------------------
  const handleWaterPlant = async (plant: Planta) => {
    try {
      const now = new Date().toISOString();
      await updateWatering({ id: plant.id, date: now });
      Alert.alert('Sucesso', `${plant.nome} foi regada!`);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível registrar a rega');
    }
  };

  //-----------------------------------------------
  // ⚠️ LÓGICA DE DELETE — COM WEB + MOBILE CORRIGIDO
  //-----------------------------------------------
  const handleDeletePlant = (plant: Planta) => {
    console.log('🛑 handleDeletePlant chamado para:', plant.id, plant.nome);

    // 🔥 WEB → usar window.confirm (Alert.alert é inconsistente no navegador)
    if (Platform.OS === 'web') {
      const ok = window.confirm(`Deseja realmente excluir ${plant.nome}?`);
      if (!ok) return;

      (async () => {
        console.log('🚀 WEB: iniciando exclusão...');
        setDeletingId(plant.id);

        try {
          console.log('📞 Chamando deletePlant()...');
          await deletePlant(plant.id);

          console.log('✅ deletePlant concluído!');
          Alert.alert('Sucesso', `${plant.nome} excluída com sucesso`);
        } catch (err: any) {
          console.error('❌ Erro ao deletar (web):', err);
          Alert.alert('Erro', err.message || 'Erro desconhecido');
        } finally {
          console.log('🏁 Limpando deletingId');
          setDeletingId(null);
        }
      })();

      return;
    }

    // 📱 ANDROID / iOS
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja realmente excluir ${plant.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            console.log('🚀 MOBILE: iniciando exclusão...');
            setDeletingId(plant.id);

            try {
              console.log('📞 Chamando deletePlant()...');
              await deletePlant(plant.id);

              console.log('✅ deletePlant concluído!');
              Alert.alert('Sucesso', `${plant.nome} excluída com sucesso`);
            } catch (err: any) {
              console.error('❌ Erro ao deletar (mobile):', err);
              Alert.alert('Erro', err.message || 'Erro desconhecido');
            } finally {
              console.log('🏁 Limpando deletingId');
              setDeletingId(null);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  //-----------------------------------------------
  // EMPTY LIST
  //-----------------------------------------------
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

  //-----------------------------------------------
  // LOADING / ERROR
  //-----------------------------------------------
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
          {error.message}
        </Text>
      </View>
    );
  }

  //-----------------------------------------------
  // RENDER
  //-----------------------------------------------
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Appbar.Header>
        <Appbar.Content title="PlantCare" />

        <Appbar.Action icon="refresh" onPress={onRefresh} disabled={refreshing} />

        {/* BOTÃO DE DEBUG */}
        <Appbar.Action
          icon="bug"
          onPress={async () => {
            if (plantas.length === 0) return console.log('Nenhuma planta');

            const p = plantas[0];
            console.log('🐛 DEBUG delete ->', p.id);
            await deletePlant(p.id);
          }}
        />
      </Appbar.Header>

      {/* SEARCH */}
      <Searchbar
        placeholder="Buscar plantas..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* LISTA */}
      <FlatList
        data={filteredPlantas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PlantCard
            plant={item}
            isDeleting={deletingId === item.id}
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

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddPlant')}
        label="Adicionar"
      />
    </View>
  );
};

//-----------------------------------------------
// STYLES
//-----------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchbar: { margin: 16, elevation: 2 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { marginTop: 8, color: '#757575' },
  emptyContainer: { alignItems: 'center', padding: 24 },
  emptyListContent: { flexGrow: 1, justifyContent: 'center' },
  emptyTitle: { marginBottom: 8 },
  emptyText: { textAlign: 'center', color: '#757575' },
  fab: { position: 'absolute', bottom: 16, right: 16 },
});
