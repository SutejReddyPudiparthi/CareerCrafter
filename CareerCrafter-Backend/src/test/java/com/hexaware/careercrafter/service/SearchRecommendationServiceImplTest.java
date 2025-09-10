package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.SearchRecommendationDTO;
import com.hexaware.careercrafter.entities.SearchRecommendation;
import com.hexaware.careercrafter.exception.ResourceNotFoundException;
import com.hexaware.careercrafter.repository.SearchRecommendationRepository;
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
class SearchRecommendationServiceImplTest {

    @Mock
    private SearchRecommendationRepository repo;

    @InjectMocks
    private SearchRecommendationServiceImpl service;

    private SearchRecommendationDTO dto;
    private SearchRecommendation entity;

    @BeforeEach
    void setup() {
        dto = new SearchRecommendationDTO();
        dto.setSearchId(1);
        dto.setUserId(2);
        dto.setSearchKeywords("Java Developer");

        entity = new SearchRecommendation();
        entity.setSearchId(1);
    }

    @Test
    void createSearch_success() {
        when(repo.save(any())).thenReturn(entity);
        assertNotNull(service.createSearch(dto));
    }

    @Test
    void getSearchById_found() {
        when(repo.findById(1)).thenReturn(Optional.of(entity));
        assertNotNull(service.getSearchById(1));
    }

    @Test
    void getSearchById_notFound() {
        when(repo.findById(1)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.getSearchById(1));
    }

    @Test
    void deleteSearch_notFound() {
        when(repo.existsById(1)).thenReturn(false);
        assertThrows(ResourceNotFoundException.class, () -> service.deleteSearch(1));
    }
}
