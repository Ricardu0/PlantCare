// src/components/PlantCard.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button, IconButton, Chip } from 'react-native-paper';
import { Planta } from '../types/index';

interface PlantCardProps {
  plant: Planta;
  onPress: () => void;
  onWater: () => void;
  onDelete: () => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onPress,
  onWater,
  onDelete,
}) => {
  const getDaysUntilWatering = (): number | null => {
    if (!plant.data_ultima_rega || !plant.frequencia_rega) return null;

    const lastWatering = new Date(plant.data_ultima_rega);
    const today = new Date();
    const daysSinceWatering = Math.floor(
      (today.getTime() - lastWatering.getTime()) / (1000 * 60 * 60 * 24)
    );

    return plant.frequencia_rega - daysSinceWatering;
  };

  const needsWatering = (): boolean => {
    const days = getDaysUntilWatering();
    return days !== null && days <= 0;
  };

  const getWateringStatus = (): string => {
    const days = getDaysUntilWatering();
    if (days === null) return 'Sem programação';
    if (days < 0) return `Atrasado ${Math.abs(days)} dia(s)`;
    if (days === 0) return 'Regar hoje';
    return `Regar em ${days} dia(s)`;
  };

  const getStatusColor = (): string => {
    const days = getDaysUntilWatering();
    if (days === null) return '#757575';
    if (days < 0) return '#f44336';
    if (days === 0) return '#ff9800';
    return '#4caf50';
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="titleLarge" style={styles.title}>
              {plant.nome}
            </Text>
            {plant.especie && (
              <Text variant="bodyMedium" style={styles.species}>
                {plant.especie}
              </Text>
            )}
          </View>
          <IconButton
            icon="delete"
            iconColor="#f44336"
            size={20}
            onPress={onDelete}
          />
        </View>

        {plant.categoria_nome && (
          <Chip icon="tag" style={styles.chip}>
            {plant.categoria_nome}
          </Chip>
        )}

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor() },
            ]}
          >
            <Text style={styles.statusText}>{getWateringStatus()}</Text>
          </View>
        </View>

        {plant.observacoes && (
          <Text variant="bodySmall" style={styles.notes}>
            {plant.observacoes}
          </Text>
        )}
      </Card.Content>

      <Card.Actions>
        <Button
          mode={needsWatering() ? 'contained' : 'outlined'}
          onPress={onWater}
          icon="water"
        >
          Regar Agora
        </Button>
        <Button mode="text" onPress={onPress}>
          Detalhes
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
  },
  species: {
    color: '#757575',
    fontStyle: 'italic',
  },
  chip: {
    alignSelf: 'flex-start',
    marginVertical: 8,
  },
  statusContainer: {
    marginVertical: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  notes: {
    marginTop: 8,
    color: '#757575',
  },
});