// src/screens/PlantDetailsScreen.tsx
import React from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { usePlant } from '../hooks/usePlants';
import { usePlants } from '../hooks/usePlants';

type Props = NativeStackScreenProps<RootStackParamList, 'PlantDetails'>;

export const PlantDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { plantId } = route.params;
  const { data: plant, isLoading, error } = usePlant(plantId);
  const { updateWatering, deletePlant } = usePlants();

  const handleWater = async () => {
    if (!plant) return;

    try {
      const now = new Date().toISOString();
      await updateWatering({ id: plant.id, date: now });
      Alert.alert('Sucesso', `${plant.nome} foi regada!`);
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível registrar a rega');
    }
  };

  const handleDelete = () => {
    if (!plant) return;

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
              Alert.alert('Sucesso', 'Planta excluída', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível excluir a planta');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Não informado';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getNextWateringDate = (): string => {
    if (!plant?.data_ultima_rega || !plant.frequencia_rega) {
      return 'Não programado';
    }

    const lastWatering = new Date(plant.data_ultima_rega);
    const nextWatering = new Date(lastWatering);
    nextWatering.setDate(nextWatering.getDate() + plant.frequencia_rega);

    return nextWatering.toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !plant) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="headlineSmall">❌ Erro ao carregar</Text>
        <Button onPress={() => navigation.goBack()}>Voltar</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={plant.nome} />
        <Appbar.Action icon="delete" onPress={handleDelete} />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerSection}>
              <Text variant="displaySmall" style={styles.plantName}>
                🌱 {plant.nome}
              </Text>
              {plant.especie && (
                <Text variant="titleMedium" style={styles.species}>
                  {plant.especie}
                </Text>
              )}
            </View>

            {plant.categoria_nome && (
              <Chip icon="tag" style={styles.chip}>
                {plant.categoria_nome}
              </Chip>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Informações de Rega" />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text variant="labelLarge">Última Rega:</Text>
              <Text variant="bodyLarge">
                {formatDate(plant.data_ultima_rega)}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Frequência:</Text>
              <Text variant="bodyLarge">
                {plant.frequencia_rega
                  ? `A cada ${plant.frequencia_rega} dia(s)`
                  : 'Não definida'}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text variant="labelLarge">Próxima Rega:</Text>
              <Text variant="bodyLarge">{getNextWateringDate()}</Text>
            </View>
          </Card.Content>

          <Card.Actions>
            <Button mode="contained" onPress={handleWater} icon="water">
              Regar Agora
            </Button>
          </Card.Actions>
        </Card>

        {plant.observacoes && (
          <Card style={styles.card}>
            <Card.Title title="Observações" />
            <Card.Content>
              <Text variant="bodyMedium">{plant.observacoes}</Text>
            </Card.Content>
          </Card>
        )}

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  headerSection: {
    marginBottom: 16,
  },
  plantName: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  species: {
    color: '#757575',
    fontStyle: 'italic',
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 8,
  },
  spacer: {
    height: 32,
  },
});