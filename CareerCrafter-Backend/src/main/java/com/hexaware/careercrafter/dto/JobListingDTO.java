package com.hexaware.careercrafter.dto;

import com.hexaware.careercrafter.entities.JobListing.JobType;

import jakarta.validation.constraints.*;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Setter;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/*
 * Data transfer object for job listing details.
 * Used to transfer job listing data.
 * 
 */


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobListingDTO {

    private int jobListingId;

    @NotNull(message="EmployerId is required")
    private int employerId;

    @NotBlank(message="Job Title is required")
    @Size(min=3, max = 100, message = "Job Title must be between 3 and 100 characters")
    private String title;

    @NotBlank(message="Job Description is required")
    @Size(min=5, max = 500, message = "Job Description must be between 5 and 500 characters")
    private String description;
    
    @NotBlank(message = "Qualification are required")
    @Size(max = 200, message = "Qualification cannot exceed 200 characters")
    private String qualification;

    @NotBlank(message="Location is required")
    @Size(max = 200, message = "Location cannot exceed 200 characters")
    private String location;
    
    @Size(max = 150, message = "Company Name cannot exceed 150 characters")
    private String companyName;
    
    @NotNull(message = "Experience is required")
    @Min(value = 0, message = "Experience must be 0 or more")
    @Max(value = 60, message = "Experience must be 60 or less")
    private Integer experience;

    @NotNull(message="Job type is required")
    private JobType jobType;
    
    @Min(value = 0, message = "Salary must be non-negative")
    private Integer salary;

    private boolean active;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate postedDate;

    @Size(max = 500, message = "Required Skills cannot exceed 500 characters")
    private String requiredSkills;
}
