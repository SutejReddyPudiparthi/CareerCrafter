package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.JobListingDTO;
import com.hexaware.careercrafter.entities.Employer;
import com.hexaware.careercrafter.entities.JobListing;
import com.hexaware.careercrafter.exception.ResourceNotFoundException;
import com.hexaware.careercrafter.repository.EmployerRepository;
import com.hexaware.careercrafter.repository.JobListingRepository;
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
class JobListingServiceImplTest {

    @Mock
    private JobListingRepository jobListingRepository;

    @Mock
    private EmployerRepository employerRepository;

    @InjectMocks
    private JobListingServiceImpl jobListingService;

    private JobListingDTO dto;
    private JobListing entity;
    private Employer employer;

    @BeforeEach
    void setUp() {
        dto = new JobListingDTO();
        dto.setJobListingId(1);
        dto.setEmployerId(10);
        dto.setTitle("Java Developer");
        dto.setDescription("Develop Java backend applications");
        dto.setQualification("B.Tech or equivalent");
        dto.setLocation("Bangalore");
        dto.setExperience(4);
        dto.setJobType(JobListing.JobType.FULL_TIME);
        dto.setSalary(90000);
        dto.setActive(true);
        dto.setRequiredSkills("Java, Spring Boot, SQL");

        entity = new JobListing();
        entity.setJobListingId(1);

        employer = new Employer();
        employer.setEmployerId(10);
    }

    @Test
    void createJobListing_success() {
        when(employerRepository.findById(dto.getEmployerId())).thenReturn(Optional.of(employer));
        when(jobListingRepository.save(any(JobListing.class))).thenReturn(entity);

        JobListingDTO result = jobListingService.createJobListing(dto);
        assertNotNull(result);
        verify(jobListingRepository, times(1)).save(any());
    }

    @Test
    void getJobListingById_found() {
        when(jobListingRepository.findById(1)).thenReturn(Optional.of(entity));

        JobListingDTO result = jobListingService.getJobListingById(1);
        assertNotNull(result);
        assertEquals(1, result.getJobListingId());
    }

    @Test
    void getJobListingById_notFound() {
        when(jobListingRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> jobListingService.getJobListingById(1));
    }

    @Test
    void deleteJobListing_notFound() {
    	when(jobListingRepository.existsById(1)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> jobListingService.deleteJobListing(1));

        verify(jobListingRepository, times(1)).existsById(1);
        verify(jobListingRepository, never()).deleteById(anyInt());
    }
}
