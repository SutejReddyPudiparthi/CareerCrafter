package com.hexaware.careercrafter.dto;

import jakarta.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


/*
 * 
 * Data Transfer Object for Employer Information.
 * User for transferring employer data between client and server with validation.
 * 
 */


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployerDTO {

    private int employerId;

    @NotNull(message="UserID is required")
    private int userId;

    @NotBlank(message = "Company name is required")
    @Size(max = 150, message = "Company name cannot exceed 150 characters")
    private String companyName;

    @NotBlank(message = "Company description is required")
    @Size(max = 1000, message = "Company description cannot exceed 1000 characters")
    private String companyDescription;
    
    @NotBlank(message = "Position is required")
    @Size(max = 100, message = "Position cannot exceed 100 characters")
    private String position;
    
}
