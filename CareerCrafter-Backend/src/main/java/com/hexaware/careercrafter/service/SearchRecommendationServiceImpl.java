package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.SearchRecommendationDTO;
import com.hexaware.careercrafter.entities.SearchRecommendation;
import com.hexaware.careercrafter.entities.User;
import com.hexaware.careercrafter.exception.*;
import com.hexaware.careercrafter.repository.SearchRecommendationRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/*
 * Implementation of ISearchRecommendationService.
 * Implements search related operations.
 */

@Service
public class SearchRecommendationServiceImpl implements ISearchRecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(SearchRecommendationServiceImpl.class);

    @Autowired
    private SearchRecommendationRepository searchRecommendationRepository;

    @Override
    public SearchRecommendationDTO createSearch(SearchRecommendationDTO dto) {
        logger.debug("Attempting to create search recommendation for userId: {}", dto.getUserId());
        if (dto.getSearchKeywords() == null || dto.getUserId() == 0) {
            logger.error("Invalid request - missing search keywords or userId");
            throw new InvalidRequestException("Search keywords and userId are required.");
        }
        SearchRecommendation entity = mapToEntity(dto);
        SearchRecommendation saved = searchRecommendationRepository.save(entity);
        logger.info("Search recommendation created with ID: {}", saved.getSearchId());
        return mapToDTO(saved);
    }

    @Override
    public SearchRecommendationDTO getSearchById(int id) {
        logger.debug("Fetching search recommendation with ID: {}", id);
        SearchRecommendation entity = searchRecommendationRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("Search recommendation with ID {} not found", id);
                return new ResourceNotFoundException("SearchRecommendation with ID " + id + " not found");
            });
        return mapToDTO(entity);
    }

    @Override
    public List<SearchRecommendationDTO> getSearchesByUserId(int userId) {
        logger.debug("Fetching search recommendations for userId: {}", userId);
        List<SearchRecommendation> entities = searchRecommendationRepository.findByUserUserId(userId);
        List<SearchRecommendationDTO> dtos = new ArrayList<>();
        for (SearchRecommendation sr : entities) {
            dtos.add(mapToDTO(sr));
        }
        logger.info("Fetched {} search recommendations for userId: {}", dtos.size(), userId);
        return dtos;
    }
    
    @Override
    public SearchRecommendationDTO updateSearch(SearchRecommendationDTO dto) {
        logger.debug("Updating search recommendation with ID: {}", dto.getSearchId());
        if (!searchRecommendationRepository.existsById(dto.getSearchId())) {
            logger.error("Cannot update - search recommendation with ID {} not found", dto.getSearchId());
            throw new ResourceNotFoundException("Cannot update. SearchRecommendation with ID " + dto.getSearchId() + " not found");
        }
        SearchRecommendation entity = mapToEntity(dto);
        SearchRecommendation saved = searchRecommendationRepository.save(entity);
        logger.info("Search recommendation with ID {} updated successfully", saved.getSearchId());
        return mapToDTO(saved);
    }

    @Override
    public void deleteSearch(int id) {
        logger.debug("Deleting search recommendation with ID: {}", id);
        if (!searchRecommendationRepository.existsById(id)) {
            logger.error("Cannot delete - search recommendation with ID {} not found", id);
            throw new ResourceNotFoundException("Cannot delete. SearchRecommendation with ID " + id + " not found");
        }
        searchRecommendationRepository.deleteById(id);
        logger.info("Search recommendation with ID {} deleted successfully", id);
    }

    private SearchRecommendationDTO mapToDTO(SearchRecommendation entity) {
        SearchRecommendationDTO dto = new SearchRecommendationDTO();
        dto.setSearchId(entity.getSearchId());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getUserId() : 0);
        dto.setSearchKeywords(entity.getSearchKeywords());
        dto.setSearchFilters(entity.getSearchFilters());
        dto.setLocation(entity.getLocation());
        dto.setRecommendedJobs(entity.getRecommendedJobs());
        return dto;
    }

    private SearchRecommendation mapToEntity(SearchRecommendationDTO dto) {
        SearchRecommendation entity = new SearchRecommendation();
        entity.setSearchId(dto.getSearchId());
        User user = new User();
        user.setUserId(dto.getUserId());
        entity.setUser(user);
        entity.setSearchKeywords(dto.getSearchKeywords());
        entity.setSearchFilters(dto.getSearchFilters());
        entity.setLocation(dto.getLocation());
        entity.setRecommendedJobs(dto.getRecommendedJobs());
        return entity;
    }
}
