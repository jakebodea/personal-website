import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    body: string;
    text: string;
    toggleBorder: string;
    background: string;
    skillBackground: string;
    skillText: string;
    toggleBackground: string;
    toggleText: string;
    toggleHoverBackground: string;
  }
}

export const lightTheme = {
  body: '#FFF',
  text: '#363537',
  toggleBorder: '#363537',
  background: '#F5F5F5',
  skillBackground: '#e0e0e0',
  skillText: '#363537',
  toggleBackground: '#363537',
  toggleText: '#FFF',
  toggleHoverBackground: '#555',
};

export const darkTheme = {
  body: '#363537',
  text: '#FAFAFA',
  toggleBorder: '#6B8096',
  background: '#1A1A1A',
  skillBackground: '#555',
  skillText: '#FAFAFA',
  toggleBackground: '#FAFAFA',
  toggleText: '#363537',
  toggleHoverBackground: '#DDD',
};
