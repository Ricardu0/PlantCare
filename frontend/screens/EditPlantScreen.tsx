// frontend/screens/EditPlantScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  SegmentedButtons,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { usePlant, usePlants } from '../hooks/usePlants';
import { useCategories } from '../hooks/useCategories';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Importação condicional do DateTimePicker apenas para mobile
let DateTimePicker: any = null;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

type Props = NativeStackScreenProps<RootStackParamList, 'EditPlant'>;

export const EditPlantScreen: React.FC<Props> = ({ route, navigation }) => {
  const { plantId } = route.params;
  const { data: plant, isLoading: isLoadingPlant } = usePlant(plantId);
  const { updatePlant, isUpdating } = usePlants();
  const { categorias } = useCategories();

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [frequenciaRega, setFrequenciaRega] = useState('');
  const [dataUltimaRega, setDataUltimaRega] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [idCategoria, setIdCategoria] = useState<string>('');

  // Para web: string no formato YYYY-MM-DD
  const [dateInputValue, setDateInputValue] = useState('');

  // Preencher formulário com dados da planta
  useEffect(() => {
    if (plant) {
      console.log('🌱 Carregando dados da planta:', plant);
      setNome(plant.nome);
      setEspecie(plant.especie || '');
      setFrequenciaRega(plant.frequencia_rega?.toString() || '');
      setObservacoes(plant.observacoes || '');
      setIdCategoria(plant.id_categoria?.toString() || '');
      
      if (plant.data_ultima_rega) {
        const date = new Date(plant.data_ultima_rega);
        setDataUltimaRega(date);
        
        // Formatar para input type="date" (YYYY-MM-DD)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setDateInputValue(`${year}-${month}-${day}`);
      }
    }
  }, [plant]);

  const handleDateChange = (dateString: string) => {
    setDateInputValue(dateString);
    const newDate = new Date(dateString + 'T00:00:00');
    if (!isNaN(newDate.getTime())) {
      setDataUltimaRega(newDate);
    }
  };

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome da planta é obrigatório');
      return;
    }

    try {
      console.log('🔄 Iniciando atualização da planta:', plantId);
      
      await updatePlant({
        id: plantId,
        data: {
          nome: nome.trim(),
          especie: especie.trim() || undefined,
          frequencia_rega: frequenciaRega
            ? parseInt(frequenciaRega, 10)
            : undefined,
          data_ultima_rega: dataUltimaRega.toISOString(),
          observacoes: observacoes.trim() || undefined,
          id_categoria: idCategoria ? parseInt(idCategoria, 10) : undefined,
        },
      });

      console.log('✅ Planta atualizada com sucesso');
      Alert.alert('Sucesso', 'Planta atualizada com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('❌ Erro ao atualizar planta:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a planta');
    }
  };

  const categoriasOptions = categorias.map((cat) => ({
    value: cat.id_categoria.toString(),
    label: cat.nome,
  }));

  if (isLoadingPlant) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando planta...</Text>
      </View>
    );
  }

  if (!plant) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="headlineSmall">❌ Planta não encontrada</Text>
        <Button onPress={() => navigation.goBack()}>Voltar</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Planta" />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <TextInput
          label="Nome da Planta *"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          style={styles.input}
          placeholder="Ex: Samambaia"
        />

        <TextInput
          label="Espécie (opcional)"
          value={especie}
          onChangeText={setEspecie}
          mode="outlined"
          style={styles.input}
          placeholder="Ex: Nephrolepis exaltata"
        />

        <TextInput
          label="Frequência de Rega (dias)"
          value={frequenciaRega}
          onChangeText={setFrequenciaRega}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          placeholder="Ex: 3"
        />

        <Text variant="labelLarge" style={styles.label}>
          Data da Última Rega
        </Text>

        {Platform.OS === 'web' ? (
          // Input nativo HTML para web
          <View style={styles.webDateContainer}>
            <input
              type="date"
              value={dateInputValue}
              onChange={(e) => handleDateChange(e.target.value)}
              className="web-date-input"
              style={{
                padding: '14px 12px',
                fontSize: 16,
                borderRadius: 4,
                border: '1px solid #999',
                fontFamily: 'inherit',
                backgroundColor: '#fff',
                color: '#000',
                cursor: 'pointer',
                outline: 'none',
                maxWidth: '100%',
              }}
            />
          </View>
        ) : (
          // DateTimePicker para mobile
          <>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              icon="calendar"
            >
              {dataUltimaRega.toLocaleDateString('pt-BR')}
            </Button>

            {showDatePicker && DateTimePicker && (
              <DateTimePicker
                value={dataUltimaRega}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setDataUltimaRega(selectedDate);
                  }
                }}
              />
            )}
          </>
        )}

        {categoriasOptions.length > 0 && (
          <>
            <Text variant="labelLarge" style={styles.label}>
              Categoria
            </Text>
            <SegmentedButtons
              value={idCategoria}
              onValueChange={setIdCategoria}
              buttons={categoriasOptions}
              style={styles.segmentedButtons}
            />
          </>
        )}

        <TextInput
          label="Observações"
          value={observacoes}
          onChangeText={setObservacoes}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Ex: Prefere sombra parcial"
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isUpdating}
          disabled={isUpdating}
          style={styles.submitButton}
          icon="check"
        >
          Salvar Alterações
        </Button>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
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
  input: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    marginTop: 8,
  },
  dateButton: {
    marginBottom: 16,
  },
  webDateContainer: {
    marginBottom: 16,
    maxWidth: 300,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 8,
  },
  spacer: {
    height: 32,
  },
});