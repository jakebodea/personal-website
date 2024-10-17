import React from 'react';
import styled from 'styled-components';

const EducationSection = styled.section`
  padding: 2rem;
`;

const EducationEntry = styled.div`
  margin-bottom: 1.5rem;
`;

const SchoolName = styled.h3`
  margin-bottom: 0.5rem;
`;

const DegreeDetails = styled.p`
  margin-bottom: 0.5rem;
`;

const Education: React.FC = () => {
  return (
    <EducationSection>
      <h2>Education</h2>
      <EducationEntry>
        <SchoolName>Stanford University</SchoolName>
        <DegreeDetails>Graduate Certificate in Artificial Intelligence, GPA 4.0 | In progress</DegreeDetails>
      </EducationEntry>
      <EducationEntry>
        <SchoolName>Concordia University Irvine</SchoolName>
        <DegreeDetails>
          Bachelor's in Mathematics, Minors in Computer Science, Business Data Analytics, and Music
        </DegreeDetails>
        <p>GPA 3.94, Summa Cum Laude, Outstanding Mathematics Graduate Award, Recipient of Honors Academic Scholarship</p>
      </EducationEntry>
    </EducationSection>
  );
};

export default Education;
