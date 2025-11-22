// src/screens/AddPlantScreen.tsx
import React, { useState } from 'react';
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
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { usePlants } from '../hooks/usePlants';
import { useCategories } from '../hooks/useCategories';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  AddPlant: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'AddPlant'>;

export const AddPlantScreen: React.FC<Props> = ({ navigation }) => {
  const { createPlant, isCreating } = usePlants();
  const { categorias } = useCategories();

  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [frequenciaRega, setFrequenciaRega] = useState('');
  const [dataUltimaRega, setDataUltimaRega] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [idCategoria, setIdCategoria] = useState<string>('');

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome da planta é obrigatório');
      return;
    }

    try {
  await createPlant({
    nome: nome.trim(),
    especie: especie.trim() || undefined,
    frequencia_rega: frequenciaRega
      ? parseInt(frequenciaRega, 10)
      : undefined,
    data_ultima_rega: dataUltimaRega.toISOString(),
    observacoes: observacoes.trim() || undefined,
    id_categoria: idCategoria ? parseInt(idCategoria, 10) : undefined,
  });

  // Exibe o alerta normalmente
  Alert.alert('Sucesso', 'Planta cadastrada com sucesso!');

  // Retorna imediatamente para a tela anterior
  navigation.goBack();

} catch (error) {
  Alert.alert('Erro', 'Não foi possível cadastrar a planta');
  console.error(error);
}
    };

  const categoriasOptions = categorias.map((cat) => ({
    value: cat.id_categoria.toString(),
    label: cat.nome,
  }));

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Adicionar Planta" />
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
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
          icon="calendar"
        >
          {dataUltimaRega.toLocaleDateString('pt-BR')}
        </Button>

        {showDatePicker && (
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
          loading={isCreating}
          disabled={isCreating}
          style={styles.submitButton}
          icon="check"
        >
          Cadastrar Planta
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