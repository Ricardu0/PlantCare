// src/components/PlantCard.tsx (refatorado FINAL)
import React, { memo } from 'react';
import { StyleSheet, View, GestureResponderEvent } from 'react-native';
import { Card, Text, Button, IconButton, Chip, ActivityIndicator } from 'react-native-paper';
import { Planta } from '../types';

interface PlantCardProps {
  plant: Planta;
  onPress: () => void;
  onWater: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

//----------------------------------------
// COMPONENTE PRINCIPAL
//----------------------------------------
const PlantCardComponent: React.FC<PlantCardProps> = ({
  plant,
  onPress,
  onWater,
  onDelete,
  isDeleting = false,
}) => {
  //----------------------------------------
  // HANDLERS
  //----------------------------------------
  const handleDeletePress = (e?: GestureResponderEvent) => {
    e?.stopPropagation?.();
    console.log('🗑️ Delete pressionado → ID:', plant.id);
    onDelete();
  };

  const handleWaterPress = (e?: GestureResponderEvent) => {
    e?.stopPropagation?.();
    console.log('💧 Rega pressionada → ID:', plant.id);
    onWater();
  };

  const handleCardPress = () => {
    console.log('📱 Card pressionado → ID:', plant.id);
    onPress();
  };

  //----------------------------------------
  // LÓGICA DE REGA
  //----------------------------------------
  const getDaysUntilWatering = (): number | null => {
    if (!plant.data_ultima_rega || !plant.frequencia_rega) return null;

    const lastWatering = new Date(plant.data_ultima_rega);
    const today = new Date();

    const diffDays = Math.floor(
      (today.getTime() - lastWatering.getTime()) / (1000 * 60 * 60 * 24)
    );

    return plant.frequencia_rega - diffDays;
  };

  const needsWatering = (): boolean => {
    const days = getDaysUntilWatering();
    return days !== null && days <= 0;
  };

  const getWateringStatus = () => {
    const days = getDaysUntilWatering();

    if (days === null) return 'Sem programação';
    if (days < 0) return `Atrasado ${Math.abs(days)} dia(s)`;
    if (days === 0) return 'Regar hoje';
    return `Regar em ${days} dia(s)`;
  };

  const getStatusColor = () => {
    const days = getDaysUntilWatering();
    if (days === null) return '#757575';
    if (days < 0) return '#f44336';
    if (days === 0) return '#ff9800';
    return '#4caf50';
  };

  //----------------------------------------
  // RENDER
  //----------------------------------------
  return (
    <Card style={styles.card} onPress={isDeleting ? () => {} : handleCardPress}>
      <Card.Content>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text variant="titleLarge" style={styles.title} numberOfLines={1}>
              {plant.nome}
            </Text>

            {plant.especie ? (
              <Text variant="bodyMedium" style={styles.species} numberOfLines={1}>
                {plant.especie}
              </Text>
            ) : null}
          </View>

          {/* BOTÃO DELETAR */}
          <View style={styles.iconArea}>
            {isDeleting ? (
              <ActivityIndicator size={20} />
            ) : (
              <IconButton
                icon="delete"
                iconColor="#ff5252"
                size={24}
                onPress={handleDeletePress}
              />
            )}
          </View>
        </View>

        {/* CHIP CATEGORIA */}
        {plant.categoria_nome ? (
          <Chip icon="label" style={styles.chip} compact>
            {plant.categoria_nome}
          </Chip>
        ) : null}

        {/* STATUS DE REGA */}
        <View style={styles.statusContainer}>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            <Text style={styles.statusText}>{getWateringStatus()}</Text>
          </View>
        </View>

        {/* OBSERVAÇÕES */}
        {plant.observacoes ? (
          <Text variant="bodySmall" style={styles.notes} numberOfLines={3}>
            {plant.observacoes}
          </Text>
        ) : null}
      </Card.Content>

      {/* AÇÕES */}
      <Card.Actions style={styles.actionsRow}>
        <Button
          mode={needsWatering() ? 'contained' : 'outlined'}
          icon="watering-can"
          onPress={handleWaterPress}
          disabled={isDeleting}
        >
          Regar Agora
        </Button>

        <Button mode="text" onPress={handleCardPress} disabled={isDeleting}>
          Detalhes
        </Button>
      </Card.Actions>
    </Card>
  );
};

//----------------------------------------
// EXPORT NOMEADO (CORRETO PARA SUA HOMESCREEN)
//----------------------------------------
export const PlantCard = memo(PlantCardComponent);

//----------------------------------------
// STYLES
//----------------------------------------
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontWeight: '600',
  },
  species: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  iconArea: {
    width: 40,
    alignItems: 'center',
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusContainer: {
    marginVertical: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  notes: {
    marginTop: 10,
    color: '#555',
  },
  actionsRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});