import React from 'react';
import styled from 'styled-components';

const ContactSection = styled.section`
  padding: 2rem;
`;

const ContactInfo = styled.p`
  margin-bottom: 0.5rem;
`;

const ContactLink = styled.a`
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Contact: React.FC = () => {
  return (
    <ContactSection>
      <h2>Contact</h2>
      <ContactInfo>Location: Irvine, CA</ContactInfo>
      <ContactInfo>Email: <ContactLink href="mailto:jakebodea@gmail.com">jakebodea@gmail.com</ContactLink></ContactInfo>
      <ContactInfo>Phone: (949) 298-0911</ContactInfo>
      <ContactInfo>
        LinkedIn: <ContactLink href="https://www.linkedin.com/in/jakebodea" target="_blank" rel="noopener noreferrer">linkedin.com/in/jakebodea</ContactLink>
      </ContactInfo>
      <ContactInfo>
        GitHub: <ContactLink href="https://github.com/jakebodea" target="_blank" rel="noopener noreferrer">github.com/jakebodea</ContactLink>
      </ContactInfo>
    </ContactSection>
  );
};

export default Contact;
