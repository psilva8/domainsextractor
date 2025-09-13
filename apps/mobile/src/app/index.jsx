import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import DomainExtractor from '../components/DomainExtractor';

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DomainExtractor />
    </SafeAreaView>
  );
}