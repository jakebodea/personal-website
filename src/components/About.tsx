import React from 'react';
import styled from 'styled-components';

const AboutSection = styled.section`
  padding: 2rem;
`;

const About: React.FC = () => {
  return (
    <AboutSection>
      <h2>About Me</h2>
      <p>
        Director of AI at Ventris Medical with a strong background in Mathematics and Computer Science. 
        Experienced in developing AI solutions, leading teams, and implementing data-driven strategies.
      </p>
    </AboutSection>
  );
};

export default About;
