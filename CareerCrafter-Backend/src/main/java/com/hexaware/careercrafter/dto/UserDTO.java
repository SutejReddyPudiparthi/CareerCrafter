package com.hexaware.careercrafter.dto;

import com.hexaware.careercrafter.entities.User.UserType;

import jakarta.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/*
 * DTO for user information.
 * Used for transferring user authentication and profile data.
 * 
 */

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private int userId;

    @NotBlank(message = "Name is mandatory")
    @Size(min = 2, max = 70, message = "Name must be between 2 and 70 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).*$", 
             message = "Password must contain at least one uppercase, one lowercase, and one digit")
    private String password;

    @NotNull(message = "User type is required")
    private UserType userType;
    
    private boolean active;
    
}
