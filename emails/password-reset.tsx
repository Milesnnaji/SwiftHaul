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

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export default function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your SwiftHaul password</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-xl px-4 py-8">
            <Section className="bg-white rounded-2xl shadow-sm p-8">
              <Text className="text-4xl text-center mb-2">🔐</Text>
              <Heading className="text-2xl font-bold text-gray-900 text-center mb-2">
                Reset Your Password
              </Heading>

              <Text className="text-gray-700 mb-4">Hi {name},</Text>
              <Text className="text-gray-700 mb-6">
                We received a request to reset your SwiftHaul account password. Click
                the button below to create a new password.
              </Text>

              <Section className="text-center mb-8">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-sm inline-block"
                >
                  Reset Password
                </Button>
              </Section>

              <Text className="text-gray-500 text-sm mb-2">
                Or paste this link into your browser:
              </Text>
              <Link href={resetUrl} className="text-blue-600 text-sm break-all">
                {resetUrl}
              </Link>

              <Hr className="my-6 border-gray-200" />

              <Text className="text-amber-700 bg-amber-50 rounded-lg p-3 text-sm mb-4">
                This link expires in <strong>1 hour</strong>. If you didn&apos;t
                request a password reset, please ignore this email and your password
                will remain unchanged.
              </Text>

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
