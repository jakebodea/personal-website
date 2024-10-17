import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Arial', sans-serif;
    transition: all 0.25s linear;
  }
`;

export default GlobalStyle;
