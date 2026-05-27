import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#0ea5e9",
    paddingBottom: 20,
  },
  brandName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#0ea5e9",
  },
  brandTagline: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  receiptTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1e293b",
    textAlign: "right",
  },
  receiptSubtitle: {
    fontSize: 9,
    color: "#64748b",
    textAlign: "right",
    marginTop: 2,
  },
  trackingBadge: {
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    padding: "10 16",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  trackingLabel: {
    fontSize: 9,
    color: "#3b82f6",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  trackingId: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1d4ed8",
    letterSpacing: 2,
  },
  sectionRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
  },
  section: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 6,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  field: {
    marginBottom: 4,
  },
  label: {
    fontSize: 9,
    color: "#64748b",
  },
  value: {
    fontSize: 10,
    color: "#1e293b",
    fontFamily: "Helvetica-Bold",
    marginTop: 1,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0ea5e9",
    borderRadius: "4 4 0 0",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    fontSize: 9,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f8fafc",
  },
  tableCell: {
    fontSize: 10,
    color: "#374151",
  },
  col1: { flex: 2 },
  col2: { flex: 1, textAlign: "right" },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#0ea5e9",
    borderRadius: "0 0 4 4",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  totalLabel: {
    fontSize: 11,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    flex: 2,
  },
  totalValue: {
    fontSize: 11,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    flex: 1,
    textAlign: "right",
  },
  statusBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 9,
    color: "#166534",
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: "#94a3b8",
  },
});

function formatNGN(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
}

interface ReceiptProps {
  trackingId: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  senderDetails: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  recipientDetails: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  packageInfo: {
    weightKg: number;
    dimensions: { length: number; width: number; height: number };
    category: string;
    description: string;
  };
  zone: string;
  pricing: {
    baseRate: number;
    weightCharge: number;
    categorySurcharge: number;
    subtotal: number;
    tax: number;
    total: number;
  };
  paymentRef?: string;
}

export function ShipmentReceipt({
  trackingId,
  createdAt,
  customerName,
  customerEmail,
  senderDetails,
  recipientDetails,
  packageInfo,
  zone,
  pricing,
  paymentRef,
}: ReceiptProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>SwiftHaul</Text>
            <Text style={styles.brandTagline}>Fast. Reliable. Delivered.</Text>
          </View>
          <View>
            <Text style={styles.receiptTitle}>SHIPMENT RECEIPT</Text>
            <Text style={styles.receiptSubtitle}>
              Issued: {new Date(createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "long", year: "numeric" })}
            </Text>
            {paymentRef && (
              <Text style={styles.receiptSubtitle}>Ref: {paymentRef}</Text>
            )}
          </View>
        </View>

        {/* Tracking ID */}
        <View style={styles.trackingBadge}>
          <Text style={styles.trackingLabel}>Tracking ID</Text>
          <Text style={styles.trackingId}>{trackingId}</Text>
        </View>

        {/* Customer + Status */}
        <View style={[styles.sectionRow, { marginBottom: 12 }]}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{customerName}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{customerEmail}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipment Zone</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Zone</Text>
              <Text style={[styles.value, { textTransform: "capitalize" }]}>{zone}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Payment Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Paid</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sender & Recipient */}
        <View style={styles.sectionRow}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sender</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{senderDetails.name}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>
                {senderDetails.address}, {senderDetails.city}
              </Text>
              <Text style={styles.value}>
                {senderDetails.state}, {senderDetails.country}
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recipient</Text>
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{recipientDetails.name}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>
                {recipientDetails.address}, {recipientDetails.city}
              </Text>
              <Text style={styles.value}>
                {recipientDetails.state}, {recipientDetails.country}
              </Text>
            </View>
          </View>
        </View>

        {/* Package Info */}
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 8 }]}>Package Information</Text>
          <View style={[styles.sectionRow, { marginBottom: 0 }]}>
            <View style={styles.section}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>{packageInfo.weightKg} kg</Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Dimensions (L×W×H cm)</Text>
              <Text style={styles.value}>
                {packageInfo.dimensions.length} × {packageInfo.dimensions.width} × {packageInfo.dimensions.height}
              </Text>
            </View>
            <View style={styles.section}>
              <Text style={styles.label}>Category</Text>
              <Text style={[styles.value, { textTransform: "capitalize" }]}>
                {packageInfo.category}
              </Text>
            </View>
          </View>
        </View>

        {/* Pricing Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>Base Rate ({zone})</Text>
            <Text style={[styles.tableCell, styles.col2]}>{formatNGN(pricing.baseRate)}</Text>
          </View>
          <View style={styles.tableRowAlt}>
            <Text style={[styles.tableCell, styles.col1]}>
              Weight Charge ({packageInfo.weightKg} kg)
            </Text>
            <Text style={[styles.tableCell, styles.col2]}>{formatNGN(pricing.weightCharge)}</Text>
          </View>
          {pricing.categorySurcharge > 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                {packageInfo.category} Surcharge
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>
                {formatNGN(pricing.categorySurcharge)}
              </Text>
            </View>
          )}
          <View style={styles.tableRowAlt}>
            <Text style={[styles.tableCell, styles.col1]}>VAT (7.5%)</Text>
            <Text style={[styles.tableCell, styles.col2]}>{formatNGN(pricing.tax)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatNGN(pricing.total)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SwiftHaul Courier & Logistics</Text>
          <Text style={styles.footerText}>support@swifthaul.com</Text>
          <Text style={styles.footerText}>
            Generated {new Date().toLocaleDateString("en-NG")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
