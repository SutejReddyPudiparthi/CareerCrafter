package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.ApplicationDTO;
import com.hexaware.careercrafter.entities.Application;
import com.hexaware.careercrafter.entities.JobListing;
import com.hexaware.careercrafter.entities.JobSeeker;
import com.hexaware.careercrafter.exception.ResourceNotFoundException;
import com.hexaware.careercrafter.repository.ApplicationRepository;
import com.hexaware.careercrafter.repository.JobListingRepository;
import com.hexaware.careercrafter.repository.JobSeekerRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceImplTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobListingRepository jobListingRepository;
    
    @Mock
    private JobSeekerRepository jobSeekerRepository;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private ApplicationDTO applicationDTO;
    private Application applicationEntity;
    private JobListing jobListingEntity;
    private JobSeeker jobSeekerEntity;

    @BeforeEach
    void setUp() {
        applicationDTO = new ApplicationDTO();
        applicationDTO.setApplicationId(1);
        applicationDTO.setJobListingId(100);
        applicationDTO.setJobSeekerId(200);
        applicationDTO.setStatus(ApplicationDTO.ApplicationStatus.APPLIED);

        jobListingEntity = new JobListing();
        jobListingEntity.setJobListingId(100);

        jobSeekerEntity = new JobSeeker();
        jobSeekerEntity.setJobSeekerId(200);

        applicationEntity = new Application();
        applicationEntity.setApplicationId(1);
        applicationEntity.setJobListing(jobListingEntity);
        applicationEntity.setJobSeeker(jobSeekerEntity);
        applicationEntity.setStatus(Application.ApplicationStatus.APPLIED);
    }

    @Test
    void applyForJob_success() {
        when(jobListingRepository.findById(applicationDTO.getJobListingId())).thenReturn(Optional.of(jobListingEntity));
        when(jobSeekerRepository.findById(applicationDTO.getJobSeekerId())).thenReturn(Optional.of(jobSeekerEntity));
        when(applicationRepository.save(any(Application.class))).thenReturn(applicationEntity);

        ApplicationDTO result = applicationService.applyForJob(applicationDTO);
        assertNotNull(result);
        verify(applicationRepository, times(1)).save(any());
    }

    @Test
    void getApplicationById_found() {
        when(applicationRepository.findById(1)).thenReturn(Optional.of(applicationEntity));

        ApplicationDTO result = applicationService.getApplicationById(1);
        assertNotNull(result);
        assertEquals(1, result.getApplicationId());
        assertEquals(200, result.getJobSeekerId());
    }

    @Test
    void getApplicationById_notFound() {
        when(applicationRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> applicationService.getApplicationById(1));
    }

    @Test
    void deleteApplication_notFound() {
        when(applicationRepository.existsById(1)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> applicationService.deleteApplication(1));
    }
}
