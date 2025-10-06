import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import OfferItem from './OfferItem';
import offerTableStyles from '../styles/OfferTable.styles';

type Offer = {
  id: string;
  program: string;
  subProgram?: string;
  status: string;
  login: string;
  amount: string | number;
  date: string;
  logo?: any | null;
};

export default function OfferTable({ offers }: { offers: Offer[] }) {
  return (
    <View style={offerTableStyles.offersPanel}>
      <View style={offerTableStyles.panelTop}>
        <Text style={offerTableStyles.panelTitle}>Todas ofertas</Text>
        <View style={offerTableStyles.panelControls}>
          <TextInput style={[offerTableStyles.input, { borderRadius: 999, paddingHorizontal: 16, width: 280 }]} placeholder="Login de acesso, ID da oferta..." />
          <TouchableOpacity style={offerTableStyles.roundBtn}><Text>Filtros ▾</Text></TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal>
        <View style={{ minWidth: 820 }}>
          <View style={offerTableStyles.tableHeader}>
            <Text style={offerTableStyles.th}>Programa</Text>
            <Text style={offerTableStyles.th}>Status</Text>
            <Text style={offerTableStyles.th}>ID da oferta</Text>
            <Text style={offerTableStyles.th}>Login</Text>
            <Text style={offerTableStyles.th}>Milhas ofertadas</Text>
            <Text style={offerTableStyles.th}>Data</Text>
          </View>

          <View>
            {offers.map((o) => (
              <OfferItem key={o.id} item={o} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}