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

interface WelcomeDriverEmailProps {
  name: string;
  email: string;
  tempPassword: string;
  loginUrl: string;
}

export default function WelcomeDriverEmail({
  name,
  email,
  tempPassword,
  loginUrl,
}: WelcomeDriverEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the SwiftHaul driver team!</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-xl px-4 py-8">
            <Section className="bg-white rounded-2xl shadow-sm p-8">
              <Heading className="text-2xl font-bold text-gray-900 text-center mb-2">
                Welcome to SwiftHaul!
              </Heading>
              <Text className="text-gray-600 text-center mb-6">
                Hi {name}, your driver account has been created.
              </Text>
              <Text className="text-gray-700 mb-4">
                You&apos;ve been onboarded as a delivery driver for SwiftHaul. Here are
                your login credentials:
              </Text>
              <Section className="bg-gray-50 rounded-lg p-4 mb-6">
                <Text className="text-gray-700 mb-1">
                  <strong>Email:</strong> {email}
                </Text>
                <Text className="text-gray-700">
                  <strong>Temporary Password:</strong>{" "}
                  <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">
                    {tempPassword}
                  </span>
                </Text>
              </Section>
              <Text className="text-amber-700 bg-amber-50 rounded-lg p-3 text-sm mb-6">
                Please change your password immediately after your first login for
                security.
              </Text>
              <Section className="text-center mb-8">
                <Button
                  href={loginUrl}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm inline-block"
                >
                  Login to Your Dashboard
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
