import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

export default function VerificationEmail({
  name,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your SwiftHaul email address</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-xl px-4 py-8">
            <Section className="bg-white rounded-2xl shadow-sm p-8">
              <Heading className="text-2xl font-bold text-gray-900 text-center mb-2">
                Verify Your Email
              </Heading>
              <Text className="text-gray-600 text-center mb-6">
                Hi {name}, welcome to SwiftHaul!
              </Text>
              <Text className="text-gray-700 mb-6">
                Please verify your email address to activate your account and start
                creating shipments.
              </Text>
              <Section className="text-center mb-8">
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm inline-block"
                >
                  Verify Email Address
                </Button>
              </Section>
              <Text className="text-gray-500 text-sm">
                Or paste this link into your browser:
              </Text>
              <Link href={verificationUrl} className="text-blue-600 text-sm break-all">
                {verificationUrl}
              </Link>
              <Hr className="my-6 border-gray-200" />
              <Text className="text-gray-400 text-xs text-center">
                This link expires in 24 hours. If you didn&apos;t create an account,
                you can safely ignore this email.
              </Text>
              <Text className="text-gray-400 text-xs text-center mt-2">
                &copy; {new Date().getFullYear()} SwiftHaul. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
