// emails/FamilyInvitation.tsx
import { Body, Container, Head, Heading, Html, Link, Preview, Text } from '@react-email/components'

interface FamilyInvitationEmailProps {
  inviterName: string
  inviteUrl: string
}

export default function FamilyInvitationEmail({ inviterName, inviteUrl }: FamilyInvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You've been added to {inviterName}'s Family Circle</Preview>
      <Body style={{ backgroundColor: '#f6f9fc', padding: '20px' }}>
        <Container style={{ 
          backgroundColor: '#ffffff', 
          padding: '40px', 
          borderRadius: '5px',
          maxWidth: '600px'
        }}>
          <Heading>Welcome to Family Circle</Heading>
          <Text>
            {inviterName} has added you to their family circle. You can now access
            shared family features and settings.
          </Text>
          <Link
            href={inviteUrl}
            style={{
              display: 'inline-block',
              backgroundColor: '#0070f3',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              marginTop: '20px'
            }}
          >
            Go to Dashboard
          </Link>
        </Container>
      </Body>
    </Html>
  )
}