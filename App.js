import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';

export default function App() {
  const [deskripsi, setDeskripsi] = useState('');
  const [nominal, setNominal] = useState('');
  const [transaksi, setTransaksi] = useState([]);

  const tambahTransaksi = (tipe) => {
    if (deskripsi.trim() === '' || nominal.trim() === '') {
      Alert.alert('Input Kosong', 'Deskripsi dan nominal wajib diisi.');
      return;
    }

    const angkaNominal = Number(nominal.replace(/[^0-9]/g, ''));

    if (isNaN(angkaNominal) || angkaNominal <= 0) {
      Alert.alert('Nominal Tidak Valid', 'Nominal harus berupa angka lebih dari 0.');
      return;
    }

    const dataBaru = {
      id: Date.now().toString(),
      ket: deskripsi.trim(),
      nominal: angkaNominal,
      tipe: tipe,
    };

    setTransaksi([dataBaru, ...transaksi]);
    setDeskripsi('');
    setNominal('');
  };

  const hapusTransaksi = (id) => {
    const dataBaru = transaksi.filter((item) => item.id !== id);
    setTransaksi(dataBaru);
  };

  const totalSaldo = transaksi.reduce((total, item) => {
    return item.tipe === 'masuk'
      ? total + item.nominal
      : total - item.nominal;
  }, 0);

  const totalMasuk = transaksi
    .filter((item) => item.tipe === 'masuk')
    .reduce((total, item) => total + item.nominal, 0);

  const totalKeluar = transaksi
    .filter((item) => item.tipe === 'keluar')
    .reduce((total, item) => total + item.nominal, 0);

  const formatRupiah = (angka) => {
    return 'Rp ' + angka.toLocaleString('id-ID');
  };

  const renderItem = ({ item }) => {
    const isMasuk = item.tipe === 'masuk';

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemLeft}>
          <View
            style={[
              styles.garis,
              isMasuk ? styles.garisMasuk : styles.garisKeluar,
            ]}
          />

          <View>
            <Text style={styles.itemKet}>{item.ket}</Text>
            <Text style={styles.itemJenis}>
              {isMasuk ? 'Pemasukan' : 'Pengeluaran'}
            </Text>

            <TouchableOpacity onPress={() => hapusTransaksi(item.id)}>
              <Text style={styles.hapusText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.itemNominal, isMasuk ? styles.hijau : styles.merah]}>
          {isMasuk ? '+ ' : '- '}
          {formatRupiah(item.nominal)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF5FF" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={transaksi}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Dompet Kampus</Text>
                <Text style={styles.subtitle}>
                  Aplikasi pencatat keuangan sederhana
                </Text>
              </View>

              <View style={styles.saldoCard}>
                <Text style={styles.saldoLabel}>Saldo Saat Ini</Text>
                <Text style={styles.saldoText}>{formatRupiah(totalSaldo)}</Text>

                <View style={styles.summaryRow}>
                  <View style={styles.summaryMasukBox}>
                    <Text style={styles.summaryLabel}>Pemasukan</Text>
                    <Text style={styles.summaryMasuk}>
                      {formatRupiah(totalMasuk)}
                    </Text>
                  </View>

                  <View style={styles.summaryKeluarBox}>
                    <Text style={styles.summaryLabel}>Pengeluaran</Text>
                    <Text style={styles.summaryKeluar}>
                      {formatRupiah(totalKeluar)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.formCard}>
                <Text style={styles.sectionTitle}>Input Transaksi</Text>
                <Text style={styles.sectionDesc}>
                  Masukkan deskripsi dan nominal transaksi.
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Deskripsi, contoh: Beli Makan"
                  placeholderTextColor="#8A96A8"
                  value={deskripsi}
                  onChangeText={setDeskripsi}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Nominal, contoh: 50000"
                  placeholderTextColor="#8A96A8"
                  value={nominal}
                  onChangeText={setNominal}
                  keyboardType="numeric"
                />

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.buttonMasuk}
                    onPress={() => tambahTransaksi('masuk')}
                  >
                    <Text style={styles.buttonText}>Pemasukan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.buttonKeluar}
                    onPress={() => tambahTransaksi('keluar')}
                  >
                    <Text style={styles.buttonText}>Pengeluaran</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>Riwayat Transaksi</Text>
                <Text style={styles.sectionDesc}>
                  Daftar transaksi yang sudah ditambahkan.
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Belum ada transaksi.</Text>
              <Text style={styles.emptyDesc}>
                Tambahkan pemasukan atau pengeluaran terlebih dahulu.
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EEF5FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#EEF5FF',
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 18,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1F3A5F',
  },
  subtitle: {
    fontSize: 15,
    color: '#5D7CA6',
    marginTop: 4,
  },
  saldoCard: {
    backgroundColor: '#D7E9FF',
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#B8D8FF',
  },
  saldoLabel: {
    fontSize: 15,
    color: '#315A89',
    textAlign: 'center',
  },
  saldoText: {
    fontSize: 33,
    fontWeight: '900',
    color: '#16324F',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryMasukBox: {
    width: '48%',
    backgroundColor: '#F2FFF7',
    borderRadius: 20,
    padding: 14,
  },
  summaryKeluarBox: {
    width: '48%',
    backgroundColor: '#FFF1F3',
    borderRadius: 20,
    padding: 14,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#6F7B8A',
    marginBottom: 6,
  },
  summaryMasuk: {
    fontSize: 15,
    fontWeight: '900',
    color: '#3A8B5A',
  },
  summaryKeluar: {
    fontSize: 15,
    fontWeight: '900',
    color: '#C65E6B',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#D8E4F2',
  },
  sectionTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#1F3A5F',
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#7B8797',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: '#CAD9EA',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F3A5F',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonMasuk: {
    width: '48%',
    backgroundColor: '#9BD8B4',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
  },
  buttonKeluar: {
    width: '48%',
    backgroundColor: '#F5A3AC',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#16324F',
    fontWeight: '900',
    fontSize: 14,
  },
  historyHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D8E4F2',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#D8E4F2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  garis: {
    width: 8,
    height: 55,
    borderRadius: 10,
    marginRight: 12,
  },
  garisMasuk: {
    backgroundColor: '#9BD8B4',
  },
  garisKeluar: {
    backgroundColor: '#F5A3AC',
  },
  itemKet: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F3A5F',
  },
  itemJenis: {
    fontSize: 13,
    color: '#7B8797',
    marginTop: 4,
  },
  itemNominal: {
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 8,
  },
  hijau: {
    color: '#3A8B5A',
  },
  merah: {
    color: '#C65E6B',
  },
  hapusText: {
    color: '#D85B6A',
    marginTop: 6,
    fontSize: 13,
    fontWeight: '800',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E4F2',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F3A5F',
  },
  emptyDesc: {
    fontSize: 13,
    color: '#7B8797',
    textAlign: 'center',
    marginTop: 6,
  },
});