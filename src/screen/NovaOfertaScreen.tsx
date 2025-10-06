import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import Stepper from '../components/Stepper';
import styles from '../styles/NovaOfertaScreen.styles';

export default function NovaOfertaScreen() {
  const navigation = useNavigation();
  const [milhas, setMilhas] = useState('');
  const [valor, setValor] = useState('');

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }}>
      <HeaderBar balance="283,12" onBack={() => navigation.goBack()} />
      <View style={styles.novaPage}>
        <View style={styles.novaGrid}>
          <View style={styles.leftCol}>
            <Stepper step={2} />
          </View>

          <View style={styles.mainCard}>
            <Text style={styles.title}>02. Oferte suas milhas</Text>

            <View style={styles.formRow}>
              <View style={styles.field}>
                <Text style={styles.label}>Milhas ofertadas</Text>
                <TextInput value={milhas} onChangeText={setMilhas} placeholder="10.000" keyboardType="numeric" style={styles.input} />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Valor a cada 1.000 milhas</Text>
                <TextInput value={valor} onChangeText={setValor} placeholder="R$ 25,00" keyboardType="numeric" style={styles.input} />
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.roundBtn} onPress={() => navigation.goBack()}>
                <Text>← Voltar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cta} onPress={() => { Alert.alert('Oferta criada', `Milhas: ${milhas}\nValor: ${valor}`); navigation.navigate('MinhasOfertas' as never); }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Prosseguir →</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rightCard}>
            <Text style={{ fontWeight: '700', marginBottom: 12 }}>Média de milhas</Text>
            <View style={styles.salesCard}>
              <Text style={{ fontSize: 20, fontWeight: '700' }}>R$ 24.325,23</Text>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Estimativa por venda</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}