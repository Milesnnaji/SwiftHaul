import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface DeliveryCompletedEmailProps {
  customerName: string;
  trackingId: string;
  recipientName: string;
  deliveredAt: string;
  proofOfDeliveryUrl?: string;
  trackingUrl: string;
}

export default function DeliveryCompletedEmail({
  customerName,
  trackingId,
  recipientName,
  deliveredAt,
  proofOfDeliveryUrl,
  trackingUrl,
}: DeliveryCompletedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your shipment {trackingId} has been delivered!</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-xl px-4 py-8">
            <Section className="bg-white rounded-2xl shadow-sm p-8">
              <Section className="bg-green-50 rounded-xl p-6 mb-6 text-center">
                <Text className="text-5xl mb-2">🎉</Text>
                <Heading className="text-xl font-bold text-green-800 m-0">
                  Package Delivered!
                </Heading>
              </Section>

              <Text className="text-gray-700 mb-4">Hi {customerName},</Text>
              <Text className="text-gray-700 mb-6">
                Great news! Your shipment <strong>{trackingId}</strong> has been
                successfully delivered to <strong>{recipientName}</strong> on{" "}
                <strong>{deliveredAt}</strong>.
              </Text>

              {proofOfDeliveryUrl && (
                <Section className="mb-6">
                  <Text className="text-gray-600 text-sm font-semibold mb-2">
                    Proof of Delivery:
                  </Text>
                  <Img
                    src={proofOfDeliveryUrl}
                    alt="Proof of delivery"
                    className="w-full rounded-lg border border-gray-200"
                    width={480}
                  />
                </Section>
              )}

              <Section className="text-center mb-6">
                <Button
                  href={trackingUrl}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm inline-block"
                >
                  View Delivery Details
                </Button>
              </Section>

              <Text className="text-gray-500 text-sm text-center">
                Thank you for choosing SwiftHaul for your delivery needs!
              </Text>

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
