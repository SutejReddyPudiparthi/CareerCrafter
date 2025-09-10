package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.JobSeekerDTO;
import com.hexaware.careercrafter.entities.JobSeeker;
import com.hexaware.careercrafter.entities.User;
import com.hexaware.careercrafter.exception.ResourceNotFoundException;
import com.hexaware.careercrafter.repository.JobSeekerRepository;
import com.hexaware.careercrafter.repository.UserRepository;
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
class JobSeekerServiceImplTest {

    @Mock
    private JobSeekerRepository jobSeekerRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private JobSeekerServiceImpl jobSeekerService;

    private JobSeekerDTO dto;
    private JobSeeker entity;
    private User user;

    @BeforeEach
    void setUp() {
        dto = new JobSeekerDTO();
        dto.setJobSeekerId(1);
        dto.setUserId(101);
        dto.setFullName("Alice Johnson");

        user = new User();
        user.setUserId(101);

        entity = new JobSeeker();
        entity.setJobSeekerId(1);
        entity.setUser(user);
    }

    @Test
    void createJobSeeker_success() {
        when(userRepository.findById(dto.getUserId())).thenReturn(Optional.of(user));
        when(jobSeekerRepository.save(any(JobSeeker.class))).thenReturn(entity);

        JobSeekerDTO result = jobSeekerService.createJobSeeker(dto);
        assertNotNull(result);
        verify(jobSeekerRepository, times(1)).save(any(JobSeeker.class));
    }

    @Test
    void getJobSeekerById_found() {
        when(jobSeekerRepository.findById(1)).thenReturn(Optional.of(entity));
        assertNotNull(jobSeekerService.getJobSeekerById(1));
    }

    @Test
    void getJobSeekerById_notFound() {
        when(jobSeekerRepository.findById(1)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> jobSeekerService.getJobSeekerById(1));
    }

    @Test
    void deleteJobSeeker_notFound() {
        when(jobSeekerRepository.existsById(1)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> jobSeekerService.deleteJobSeeker(1));
    }
}
