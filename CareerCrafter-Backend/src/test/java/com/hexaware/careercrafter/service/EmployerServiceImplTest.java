package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.EmployerDTO;
import com.hexaware.careercrafter.entities.Employer;
import com.hexaware.careercrafter.entities.User;
import com.hexaware.careercrafter.exception.ResourceNotFoundException;
import com.hexaware.careercrafter.repository.EmployerRepository;
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
class EmployerServiceImplTest {

    @Mock
    private EmployerRepository employerRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EmployerServiceImpl employerService;

    private EmployerDTO dto;
    private Employer entity;
    private User user;

    @BeforeEach
    void setUp() {
        dto = new EmployerDTO();
        dto.setEmployerId(1);
        dto.setUserId(100);
        dto.setCompanyName("TechCorp Solutions");
        dto.setCompanyDescription("A leading tech firm specializing in software solutions.");
        dto.setPosition("HR Manager");

        user = new User();
        user.setUserId(100);

        entity = new Employer();
        entity.setEmployerId(1);
        entity.setUser(user);
    }

    @Test
    void createEmployer_success() {
        when(userRepository.findById(dto.getUserId())).thenReturn(Optional.of(user));
        when(employerRepository.save(any(Employer.class))).thenReturn(entity);

        EmployerDTO result = employerService.createEmployer(dto);
        assertNotNull(result);
        verify(employerRepository, times(1)).save(any(Employer.class));
    }

    @Test
    void getEmployerById_found() {
        when(employerRepository.findById(1)).thenReturn(Optional.of(entity));
        assertNotNull(employerService.getEmployerById(1));
    }

    @Test
    void getEmployerById_notFound() {
        when(employerRepository.findById(1)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> employerService.getEmployerById(1));
    }

    @Test
    void deleteEmployer_notFound() {
        when(employerRepository.existsById(1)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> employerService.deleteEmployer(1));
    }
}
