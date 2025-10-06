import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import headerStyles from '../styles/HeaderBar.styles';

type Props = {
  balance?: string;
  onPressNew?: () => void;
  onBack?: () => void;
};

export default function HeaderBar({ balance = '283,12', onPressNew, onBack }: Props) {
  return (
    <View style={headerStyles.headerBar}>
      <View style={headerStyles.headerInner}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('../../assets/logo-horizontal.png')}
            style={headerStyles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={headerStyles.headerActions}>
          {onBack ? (
            <TouchableOpacity style={headerStyles.btnPill} onPress={onBack}>
              <Text style={headerStyles.btnPillText}>Voltar</Text>
            </TouchableOpacity>
          ) : null}

          {onPressNew ? (
            <TouchableOpacity style={headerStyles.btnPrimary} onPress={onPressNew}>
              <Text style={headerStyles.btnPrimaryText}>+ Nova oferta</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity style={headerStyles.btnPill}>
            <Text style={headerStyles.btnPillText}>R$ {balance}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}