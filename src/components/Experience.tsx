import React from 'react';
import styled from 'styled-components';

const ExperienceSection = styled.section`
  padding: 2rem;
`;

const JobEntry = styled.div`
  margin-bottom: 1.5rem;
`;

const JobTitle = styled.h3`
  margin-bottom: 0.5rem;
`;

const JobDetails = styled.p`
  margin-bottom: 0.5rem;
`;

const Experience: React.FC = () => {
  return (
    <ExperienceSection>
      <h2>Experience</h2>
      <JobEntry>
        <JobTitle>Director of AI</JobTitle>
        <JobDetails>Ventris Medical, Newport Beach, CA | August 2024 – Present</JobDetails>
        <ul>
          <li>Engineered mobile application powered by LLM agents to streamline data entry</li>
          <li>Supported R&D by automating weekly email summaries of published journal articles</li>
          <li>Ensured proper HIPAA-compliant use of AI within the company</li>
        </ul>
      </JobEntry>
      <JobEntry>
        <JobTitle>Data Scientist / Scrum Master</JobTitle>
        <JobDetails>Beckman Coulter Diagnostics, Brea, CA | January 2023 – August 2024</JobDetails>
        <ul>
          <li>Led the AI Operations team as Scrum Master</li>
          <li>Collaborated with Manufacturing to design and implement automated inspection models</li>
          <li>Deployed an internal LLM chatbot for the IT department</li>
          <li>Engineered an LLM-powered IT ticket creation agent</li>
        </ul>
      </JobEntry>
    </ExperienceSection>
  );
};

export default Experience;
