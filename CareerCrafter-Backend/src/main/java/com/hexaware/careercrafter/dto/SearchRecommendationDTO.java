package com.hexaware.careercrafter.dto;

import jakarta.validation.constraints.*;
import lombok.*;

/*
 * DTO for search recommendations.
 * Searches to personalize job search experience.
 * 
 */


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchRecommendationDTO {

    private int searchId;

    @NotNull(message="UserId is required")
    private int userId;

    @NotBlank(message = "Search keywords required")
    @Size(max = 100, message = "Search keywords cannot exceed 100 characters")
    private String searchKeywords;

    @Size(max = 500,  message = "Search filters can't exceed 500 characters")
    private String searchFilters;
    
    @Size(max = 70, message = "Location cannot exceed 70 characters")
    private String location;

    @Size(max = 200, message = "Recommended jobs list cannot exceed 200 characters")
    private String recommendedJobs;
}
