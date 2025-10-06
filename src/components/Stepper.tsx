import React from 'react';
import { View, Text } from 'react-native';
import stepperStyles from '../styles/Stepper.styles';

export default function Stepper({ step = 1 }: { step?: number }) {
  const steps = ['Informações', 'Oferte suas milhas', 'Revisar & Publicar'];
  return (
    <View style={stepperStyles.stepper}>
      {steps.map((s, i) => {
        const idx = i + 1;
        const active = idx === step;
        return (
          <View key={s} style={[stepperStyles.step, !active && stepperStyles.stepInactive]}>
            <View style={[stepperStyles.dot, !active && stepperStyles.dotInactive]}>
              <Text style={[stepperStyles.dotText, !active && stepperStyles.dotTextInactive]}>{idx}</Text>
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={[stepperStyles.stepTitle, !active && stepperStyles.stepTitleInactive]}>{s}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
