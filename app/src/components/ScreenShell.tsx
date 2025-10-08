import React from 'react';
import styled from 'styled-components/native';

type ScreenShellProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
  padding: ${({theme}) => theme.spacing.lg}px;
  justify-content: center;
`;

const Title = styled.Text`
  color: ${({theme}) => theme.colors.textPrimary};
  font-size: ${({theme}) => theme.typography.display.size}px;
  font-weight: ${({theme}) => theme.typography.display.weight};
  letter-spacing: ${({theme}) => theme.typography.display.letterSpacing}px;
  text-transform: uppercase;
`;

const Subtitle = styled.Text`
  margin-top: ${({theme}) => theme.spacing.sm}px;
  color: ${({theme}) => theme.colors.textSecondary};
  font-size: ${({theme}) => theme.typography.body.size}px;
  font-weight: ${({theme}) => theme.typography.body.weight};
`;

export const ScreenShell: React.FC<ScreenShellProps> = ({
  title,
  subtitle,
  children,
}) => (
  <Container>
    <Title>{title}</Title>
    {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
    {children}
  </Container>
);
