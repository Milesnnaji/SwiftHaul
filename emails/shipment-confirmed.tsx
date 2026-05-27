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
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface ShipmentConfirmedEmailProps {
  customerName: string;
  trackingId: string;
  recipientName: string;
  recipientCity: string;
  recipientCountry: string;
  packageCategory: string;
  weightKg: number;
  totalAmount: string;
  zone: string;
  trackingUrl: string;
}

export default function ShipmentConfirmedEmail({
  customerName,
  trackingId,
  recipientName,
  recipientCity,
  recipientCountry,
  packageCategory,
  weightKg,
  totalAmount,
  zone,
  trackingUrl,
}: ShipmentConfirmedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your shipment {trackingId} has been confirmed!</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-xl px-4 py-8">
            <Section className="bg-white rounded-2xl shadow-sm p-8">
              <Section className="bg-green-50 rounded-xl p-4 mb-6 text-center">
                <Text className="text-green-600 text-4xl mb-1">✓</Text>
                <Heading className="text-xl font-bold text-green-800 m-0">
                  Shipment Confirmed!
                </Heading>
              </Section>

              <Text className="text-gray-700 mb-4">Hi {customerName},</Text>
              <Text className="text-gray-700 mb-6">
                Your shipment has been confirmed and payment received. Your package is
                now queued for pickup.
              </Text>

              <Section className="bg-blue-50 rounded-xl p-4 mb-6 text-center">
                <Text className="text-blue-500 text-xs uppercase tracking-wider mb-1 m-0">
                  Tracking ID
                </Text>
                <Text className="text-2xl font-bold text-blue-800 font-mono m-0">
                  {trackingId}
                </Text>
              </Section>

              <Section className="bg-gray-50 rounded-xl p-4 mb-6">
                <Text className="text-gray-500 text-xs uppercase tracking-wider mb-3 m-0">
                  Shipment Details
                </Text>
                <Row className="mb-2">
                  <Column className="text-gray-600 text-sm">To:</Column>
                  <Column className="text-gray-900 text-sm font-medium text-right">
                    {recipientName}, {recipientCity}, {recipientCountry}
                  </Column>
                </Row>
                <Row className="mb-2">
                  <Column className="text-gray-600 text-sm">Category:</Column>
                  <Column className="text-gray-900 text-sm font-medium text-right capitalize">
                    {packageCategory}
                  </Column>
                </Row>
                <Row className="mb-2">
                  <Column className="text-gray-600 text-sm">Weight:</Column>
                  <Column className="text-gray-900 text-sm font-medium text-right">
                    {weightKg} kg
                  </Column>
                </Row>
                <Row className="mb-2">
                  <Column className="text-gray-600 text-sm">Zone:</Column>
                  <Column className="text-gray-900 text-sm font-medium text-right capitalize">
                    {zone}
                  </Column>
                </Row>
                <Hr className="border-gray-200 my-2" />
                <Row>
                  <Column className="text-gray-700 font-semibold">Total Paid:</Column>
                  <Column className="text-blue-700 font-bold text-right">
                    {totalAmount}
                  </Column>
                </Row>
              </Section>

              <Section className="text-center mb-6">
                <Button
                  href={trackingUrl}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm inline-block"
                >
                  Track Your Shipment
                </Button>
              </Section>

              <Text className="text-gray-500 text-sm text-center">
                The PDF receipt is attached to this email.
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
