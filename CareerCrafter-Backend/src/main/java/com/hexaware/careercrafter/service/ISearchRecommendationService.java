package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.*;

import java.util.List;

/*
 * service interface for user search recommendations.
 */

public interface ISearchRecommendationService {
	
    SearchRecommendationDTO createSearch(SearchRecommendationDTO searchRecommendationDTO);
    SearchRecommendationDTO getSearchById(int id);
    List<SearchRecommendationDTO> getSearchesByUserId(int userId);
    SearchRecommendationDTO updateSearch(SearchRecommendationDTO searchRecommendationDTO);
    void deleteSearch(int id);
    
}
