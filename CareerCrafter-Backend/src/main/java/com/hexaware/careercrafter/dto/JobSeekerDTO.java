package com.hexaware.careercrafter.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

/*
 * DTO for job seeker profile.
 * Validation incoming job seeker details and supports profile operations.
 */


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobSeekerDTO {

    private int jobSeekerId;

    @NotNull(message = "User ID is required")
    private int userId;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 70, message = "Full name must be between 2 and 70 characters")
    private String fullName;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    
    @Size(max = 90, message = "Gender length can't exceed 90 characters")
    private String gender;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Phone number must be 10 digits and start with 6-9")
    private String phone;

    @Size(max = 150, message = "Address can't exceed 150 characters")
    private String address;

    @Size(max = 100, message = "Education can't exceed 100 characters")
    private String education;

    @Size(max = 100, message = "Skills can't exceed 100 characters")
    private String skills;

    @Min(value=0, message="Experience must be 0 or more")
    @Max(value=50, message="Experience must be 50 or less")
    private Integer experience;
}
