import React from 'react';
import { View, Text, Image } from 'react-native';
import offerStyles from '../styles/Offer.styles';

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

export default function OfferItem({ item }: { item: Offer }) {
  return (
    <View style={offerStyles.offerRow}>
      <View style={offerStyles.programBadge}>
        <View style={offerStyles.programLogo}>
          {item.logo ? (
            <Image source={item.logo} style={offerStyles.programLogoImage} />
          ) : (
            <Text style={offerStyles.programLogoFallback}>{(item.program || 'P')[0]}</Text>
          )}
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={offerStyles.offerProgramTitle}>{item.program}</Text>
          <Text style={offerStyles.offerSub}>{item.subProgram}</Text>
        </View>
      </View>

      <View style={offerStyles.td}>
        <View style={[
          offerStyles.chip,
          item.status.toLowerCase().includes('ativa') ? offerStyles.chipGreen : offerStyles.chipBlue
        ]}>
          <Text style={offerStyles.chipText}>{item.status}</Text>
        </View>
      </View>

      <View style={offerStyles.td}><Text style={offerStyles.tdText}>{item.id}</Text></View>
      <View style={offerStyles.td}><Text style={offerStyles.tdText}>{item.login}</Text></View>
      <View style={offerStyles.td}><Text style={offerStyles.tdText}>{item.amount}</Text></View>
      <View style={offerStyles.td}><Text style={offerStyles.tdText}>{item.date}</Text></View>
    </View>
  );
}