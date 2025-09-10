package com.hexaware.careercrafter.dto;

import jakarta.validation.constraints.*;

import lombok.*;

/*
 * DTO Object for resume upload and retrieval operations.
 * Support resume management functionality.
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumeDTO {
    private int resumeId;

    @NotNull(message="JobSeekerId is required")
    private int jobSeekerId;

    @NotBlank(message="File Path is required")
    private String filePath;

    private boolean isPrimary;
}
