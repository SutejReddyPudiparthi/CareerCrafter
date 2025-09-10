package com.hexaware.careercrafter.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/*
 * DTO for application.
 * Applies status validation through enum types.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
	
	public enum ApplicationStatus {
		APPLIED, IN_REVIEW, SHORTLISTED, REJECTED, HIRED
    }

    private int applicationId;

    @NotNull(message="JobListingID is required")
    private int jobListingId;

    @NotNull(message="JobSeekerID is required")
    private int jobSeekerId;
    
    @NotNull(message="Status is required")
    private ApplicationStatus status;

    @Size(max = 500, message = "Resume file path can't exceed 500 characters")
    private String resumeFilePath;
    
    @Size(max = 200, message = "Job title can't exceed 200 characters")
    private String jobTitle;
    
    @NotNull
    private LocalDateTime applicationDate;

    @Size(max = 100, message = "Applicant name can't exceed 100 characters")
    private String applicantName;

}
