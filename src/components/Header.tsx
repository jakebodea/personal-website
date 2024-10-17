import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const Title = styled.h1`
  margin: 0;
`;

const ToggleButton = styled.button`
  background-color: ${({ theme }) => theme.toggleBackground};
  color: ${({ theme }) => theme.toggleText};
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.toggleHoverBackground};
  }
`;

interface HeaderProps {
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
  return (
    <HeaderContainer>
      <Title>Jake Bodea</Title>
      <ToggleButton onClick={toggleTheme}>
        Toggle Theme
      </ToggleButton>
    </HeaderContainer>
  );
};

export default Header;
