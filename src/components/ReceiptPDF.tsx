import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatIndianNumber } from '../utils/formatIndianNumber';

export interface ReceiptData {
  receiptNo: string;
  date: string;
  ownerName: string;
  wing: string;
  flat: string;
  amount: string;
  amountInWords: string;
  mode: string;
  purpose: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
  },
  receiptNoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2 solid #333',
  },
  receiptNo: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 11,
  },
  detailsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1 solid #ddd',
  },
  label: {
    width: '35%',
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    width: '65%',
    fontSize: 11,
    color: '#000',
  },
  amountRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1 solid #ddd',
  },
  amountValue: {
    width: '65%',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  wordsRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '1 solid #ddd',
  },
  wordsValue: {
    width: '65%',
    fontSize: 10,
    fontStyle: 'italic',
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: '1 solid #e0e0e0',
    paddingTop: 10,
  },
});

export const ReceiptPDF = ({ data }: { data: ReceiptData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AMW OWNERS INTERIM FORUM</Text>
        <Text style={styles.subtitle}>Payment Receipt</Text>
      </View>

      {/* Receipt No and Date */}
      <View style={styles.receiptNoSection}>
        <Text style={styles.receiptNo}>Receipt No: {data.receiptNo}</Text>
        <Text style={styles.dateText}>Date: {data.date}</Text>
      </View>

      {/* Receipt Details */}
      <View style={styles.detailsContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Owner Name:</Text>
          <Text style={styles.value}>{data.ownerName}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Wing:</Text>
          <Text style={styles.value}>{data.wing}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Flat No.:</Text>
          <Text style={styles.value}>{data.flat}</Text>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.label}>Amount Received:</Text>
          <Text style={styles.amountValue}>Rs. {formatIndianNumber(data.amount)}</Text>
        </View>

        <View style={styles.wordsRow}>
          <Text style={styles.label}>Amount in Words:</Text>
          <Text style={styles.wordsValue}>{data.amountInWords} Only</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Mode:</Text>
          <Text style={styles.value}>{data.mode}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Purpose:</Text>
          <Text style={styles.value}>{data.purpose}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>This is a computer-generated receipt. No signature required.</Text>
      </View>
    </Page>
  </Document>
);
