package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.UserDTO;
import com.hexaware.careercrafter.entities.User;
import com.hexaware.careercrafter.exception.ResourceNotFoundException;
import com.hexaware.careercrafter.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl service;

    private UserDTO dto;
    private User entity;

    @BeforeEach
    void setup() {
        dto = new UserDTO();
        dto.setUserId(1);
        dto.setName("John");
        dto.setEmail("john@test.com");
        dto.setPassword("pwd");

        entity = new User();
        entity.setUserId(1);
        entity.setName("John");
        entity.setEmail("john@test.com");
        entity.setPassword("pwd");
    }

    @Test
    void createUser_success() {
        when(userRepository.findByEmail(dto.getEmail())).thenReturn(null);
        when(userRepository.save(any())).thenReturn(entity);
        assertEquals("John", service.createUser(dto).getName());
    }

    @Test
    void getUserById_found() {
        when(userRepository.findById(1)).thenReturn(Optional.of(entity));
        assertEquals("John", service.getUserById(1).getName());
    }

    @Test
    void getUserById_notFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getUserById(1));
    }

    @Test
    void deleteUser_notFound() {
        when(userRepository.existsById(1)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> service.deleteUser(1));
    }
}
