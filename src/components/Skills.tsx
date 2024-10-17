import React from 'react';
import styled from 'styled-components';

const SkillsSection = styled.section`
  padding: 2rem;
`;

const SkillCategory = styled.div`
  margin-bottom: 1rem;
`;

const SkillList = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const SkillItem = styled.li`
  display: inline-block;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  background-color: ${({ theme }) => theme.skillBackground};
  color: ${({ theme }) => theme.skillText};
  padding: 0.3rem 0.6rem;
  border-radius: 15px;
`;

const Skills: React.FC = () => {
  return (
    <SkillsSection>
      <h2>Skills</h2>
      <SkillCategory>
        <h3>Professional Skills</h3>
        <SkillList>
          <SkillItem>Problem Solving</SkillItem>
          <SkillItem>Continuous Learning</SkillItem>
          <SkillItem>Collaboration</SkillItem>
          <SkillItem>Communication</SkillItem>
          <SkillItem>Leadership</SkillItem>
        </SkillList>
      </SkillCategory>
      <SkillCategory>
        <h3>Technical Skills</h3>
        <SkillList>
          <SkillItem>Mathematics</SkillItem>
          <SkillItem>Deep Learning</SkillItem>
          <SkillItem>Networks</SkillItem>
          <SkillItem>NLP</SkillItem>
          <SkillItem>Computer Vision</SkillItem>
          <SkillItem>Web Development</SkillItem>
          <SkillItem>Containerization</SkillItem>
        </SkillList>
      </SkillCategory>
      <SkillCategory>
        <h3>Libraries</h3>
        <SkillList>
          <SkillItem>Numpy</SkillItem>
          <SkillItem>PyTorch</SkillItem>
          <SkillItem>TensorFlow</SkillItem>
          <SkillItem>Hugging Face</SkillItem>
          <SkillItem>OpenCV</SkillItem>
          <SkillItem>SQLAlchemy</SkillItem>
          <SkillItem>MLFlow</SkillItem>
          <SkillItem>NLTK</SkillItem>
          <SkillItem>Flask</SkillItem>
          <SkillItem>React</SkillItem>
        </SkillList>
      </SkillCategory>
      <SkillCategory>
        <h3>Languages</h3>
        <SkillList>
          <SkillItem>Python</SkillItem>
          <SkillItem>SQL</SkillItem>
          <SkillItem>TypeScript</SkillItem>
          <SkillItem>JavaScript</SkillItem>
          <SkillItem>C#</SkillItem>
          <SkillItem>R</SkillItem>
        </SkillList>
      </SkillCategory>
    </SkillsSection>
  );
};

export default Skills;
