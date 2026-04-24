import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { type ReceiptDocument } from '../services/firebase';

interface AllReceiptsPDFProps {
  receipts: ReceiptDocument[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
  },
  date: {
    fontSize: 10,
    color: '#666',
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '2 solid #000',
    paddingBottom: 5,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #ccc',
    paddingVertical: 5,
  },
  col1: { width: '8%' },  // Receipt No
  col2: { width: '12%' }, // Date
  col3: { width: '20%' }, // Owner Name
  col4: { width: '6%' },  // Wing
  col5: { width: '8%' },  // Flat
  col6: { width: '12%' }, // Amount
  col7: { width: '12%' }, // Mode
  col8: { width: '22%' }, // Purpose
  cellText: {
    fontSize: 9,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#666',
  },
});

export function AllReceiptsPDF({ receipts }: AllReceiptsPDFProps) {
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AMW OWNERS INTERIM FORUM</Text>
          <Text style={styles.subtitle}>All Receipts Report</Text>
          <Text style={styles.date}>Generated on: {today}</Text>
          <Text style={styles.date}>Total Receipts: {receipts.length}</Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.cellText]}>Receipt</Text>
            <Text style={[styles.col2, styles.cellText]}>Date</Text>
            <Text style={[styles.col3, styles.cellText]}>Owner Name</Text>
            <Text style={[styles.col4, styles.cellText]}>Wing</Text>
            <Text style={[styles.col5, styles.cellText]}>Flat</Text>
            <Text style={[styles.col6, styles.cellText]}>Amount (Rs.)</Text>
            <Text style={[styles.col7, styles.cellText]}>Mode</Text>
            <Text style={[styles.col8, styles.cellText]}>Purpose</Text>
          </View>

          {/* Table Rows */}
          {receipts.map((receipt, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.col1, styles.cellText]}>{receipt.receiptNo}</Text>
              <Text style={[styles.col2, styles.cellText]}>{receipt.date}</Text>
              <Text style={[styles.col3, styles.cellText]}>{receipt.ownerName}</Text>
              <Text style={[styles.col4, styles.cellText]}>{receipt.wing}</Text>
              <Text style={[styles.col5, styles.cellText]}>{receipt.flat}</Text>
              <Text style={[styles.col6, styles.cellText]}>Rs. {receipt.amount}</Text>
              <Text style={[styles.col7, styles.cellText]}>{receipt.mode}</Text>
              <Text style={[styles.col8, styles.cellText]}>
                {receipt.purpose.length > 40
                  ? `${receipt.purpose.substring(0, 40)}...`
                  : receipt.purpose}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          AMW Owners Interim Forum - Receipts Report - Page 1
        </Text>
      </Page>
    </Document>
  );
}
