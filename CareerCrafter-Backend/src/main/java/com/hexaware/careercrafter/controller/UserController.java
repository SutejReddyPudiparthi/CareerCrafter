package com.hexaware.careercrafter.controller;

import com.hexaware.careercrafter.dto.UserDTO;
import com.hexaware.careercrafter.service.IUserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


/*
 * Rest Controller for user operations.
 */

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@Tag(name = "Users", description = "APIs for user management")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private IUserService userService;

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Create a new user")
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserDTO userDTO) {
        logger.info("Request to create a new user with email: {}", userDTO.getEmail());
        UserDTO createdUser = userService.createUser(userDTO);
        logger.info("User created successfully with ID: {}", createdUser.getUserId());
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable int id) {
        logger.info("Request to fetch user with ID: {}", id);
        UserDTO user = userService.getUserById(id);
        logger.info("Successfully fetched user with ID: {}", id);
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Get all users")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        logger.info("Request to fetch all users");
        List<UserDTO> users = userService.getAllUsers();
        logger.info("Successfully fetched {} users", users.size());
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Update a user")
    @PutMapping
    public ResponseEntity<UserDTO> updateUser(@Valid @RequestBody UserDTO userDTO) {
        logger.info("Request to update user with ID: {}", userDTO.getUserId());
        UserDTO updatedUser = userService.updateUser(userDTO);
        logger.info("User with ID {} updated successfully", userDTO.getUserId());
        return ResponseEntity.ok(updatedUser);
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Delete a user")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        logger.info("Request to delete user with ID: {}", id);
        userService.deleteUser(id);
        logger.info("User with ID {} deleted successfully", id);
        return ResponseEntity.ok("User deleted successfully");
    }
    
    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");
        boolean valid = userService.verifyUserCredentials(email, password);
        return ResponseEntity.ok(valid);
    }

}
