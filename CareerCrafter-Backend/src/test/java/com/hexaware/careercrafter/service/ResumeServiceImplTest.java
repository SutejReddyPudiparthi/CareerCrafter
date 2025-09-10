package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.ResumeDTO;
import com.hexaware.careercrafter.entities.JobSeeker;
import com.hexaware.careercrafter.entities.Resume;
import com.hexaware.careercrafter.exception.ResourceNotFoundException;
import com.hexaware.careercrafter.repository.ResumeRepository;
import com.hexaware.careercrafter.repository.JobSeekerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeServiceImplTest {

    @Mock
    private ResumeRepository resumeRepository;

    @Mock
    private JobSeekerRepository jobSeekerRepository;

    @InjectMocks
    private ResumeServiceImpl service;

    private ResumeDTO dto;
    private Resume entity;
    private JobSeeker seeker;

    @BeforeEach
    void setup() {
        dto = new ResumeDTO();
        dto.setResumeId(1);
        dto.setFilePath("resume.pdf");
        dto.setJobSeekerId(2);

        seeker = new JobSeeker();
        seeker.setJobSeekerId(2);

        entity = new Resume();
        entity.setResumeId(1);
        entity.setJobSeeker(seeker);
    }

    @Test
    void uploadResume_success() {
        when(jobSeekerRepository.findById(2)).thenReturn(Optional.of(seeker));
        when(resumeRepository.save(any())).thenReturn(entity);
        assertNotNull(service.uploadResume(dto));
    }

    @Test
    void getResumeById_found() {
        when(resumeRepository.findById(1)).thenReturn(Optional.of(entity));
        assertNotNull(service.getResumeById(1));
    }

    @Test
    void getResumeById_notFound() {
        when(resumeRepository.findById(1)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getResumeById(1));
    }

    @Test
    void deleteResume_notFound() {
        when(resumeRepository.existsById(1)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> service.deleteResume(1));
    }
}
