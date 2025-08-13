import { View, Text, StyleSheet } from 'react-native';

export default function PartnerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Partner Connection</Text>
      <Text style={styles.text}>Connect and invite your partner here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a21caf',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#6b7280',
  },
});
