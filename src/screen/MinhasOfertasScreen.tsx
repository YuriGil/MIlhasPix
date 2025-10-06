import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import OfferTable from '../components/OfferTable';
import styles from '../styles/MinhasOfertasScreen.styles';

export default function MinhasOfertasScreen() {
  const navigation = useNavigation();

  const offers = useMemo(() => ([
    { id: 'OF-1001', program: 'Smiles', subProgram: 'Cartão A', status: 'Ativa', login: 'user1', amount: '10.000', date: '02/10/2025', logo: null },
    { id: 'OF-1002', program: 'Latam Pass', subProgram: 'Gold', status: 'Pendente', login: 'user2', amount: '5.200', date: '30/09/2025', logo: null },
    { id: 'OF-1003', program: 'TudoAzul', subProgram: 'Promo', status: 'Ativa', login: 'user3', amount: '12.000', date: '28/09/2025', logo: null },
  ]), []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <HeaderBar balance="283,12" onPressNew={() => navigation.navigate('NovaOferta' as never)} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.pageWrap}>
          <View style={styles.pageHead}>
            <Text style={styles.pageTitle}>Minhas ofertas</Text>
            <View>
              <Text onPress={() => navigation.navigate('NovaOferta' as never)} style={styles.linkNew}>+ Nova oferta</Text>
            </View>
          </View>

          <OfferTable offers={offers} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
