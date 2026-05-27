import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

const STATUS_LABELS: Record<string, { label: string; color: string; emoji: string }> = {
  pending: { label: "Pending", color: "yellow", emoji: "⏳" },
  picked_up: { label: "Picked Up", color: "blue", emoji: "📦" },
  in_transit: { label: "In Transit", color: "purple", emoji: "🚚" },
  out_for_delivery: { label: "Out for Delivery", color: "orange", emoji: "🏠" },
  delivered: { label: "Delivered", color: "green", emoji: "✅" },
  failed: { label: "Failed", color: "red", emoji: "❌" },
};

interface StatusUpdateEmailProps {
  customerName: string;
  trackingId: string;
  status: string;
  note?: string;
  trackingUrl: string;
}

export default function StatusUpdateEmail({
  customerName,
  trackingId,
  status,
  note,
  trackingUrl,
}: StatusUpdateEmailProps) {
  const statusInfo = STATUS_LABELS[status] ?? { label: status, color: "gray", emoji: "📍" };

  return (
    <Html>
      <Head />
      <Preview>
        Shipment {trackingId} status: {statusInfo.label}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-xl px-4 py-8">
            <Section className="bg-white rounded-2xl shadow-sm p-8">
              <Text className="text-4xl text-center mb-2">{statusInfo.emoji}</Text>
              <Heading className="text-xl font-bold text-gray-900 text-center mb-4">
                Shipment Status Update
              </Heading>

              <Text className="text-gray-700 mb-4">Hi {customerName},</Text>
              <Text className="text-gray-700 mb-6">
                Your shipment status has been updated.
              </Text>

              <Section className="bg-gray-50 rounded-xl p-4 mb-4">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-2 m-0">
                  Tracking ID
                </Text>
                <Text className="text-lg font-bold text-gray-900 font-mono m-0">
                  {trackingId}
                </Text>
              </Section>

              <Section className="bg-gray-50 rounded-xl p-4 mb-6">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-2 m-0">
                  New Status
                </Text>
                <Text className="text-lg font-bold text-gray-900 m-0">
                  {statusInfo.emoji} {statusInfo.label}
                </Text>
                {note && (
                  <Text className="text-gray-600 text-sm mt-2 m-0">{note}</Text>
                )}
              </Section>

              <Section className="text-center mb-6">
                <Button
                  href={trackingUrl}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm inline-block"
                >
                  View Full Tracking
                </Button>
              </Section>

              <Hr className="my-6 border-gray-200" />
              <Text className="text-gray-400 text-xs text-center">
                &copy; {new Date().getFullYear()} SwiftHaul. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
