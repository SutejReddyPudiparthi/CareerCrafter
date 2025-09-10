package com.hexaware.careercrafter.controller;

import com.hexaware.careercrafter.dto.EmployerDTO;
import com.hexaware.careercrafter.service.IEmployerService;

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

/*
 * Rest Controller for managing employer-related operations.
 * Accessible only to users with EMPLOYER role.
 */

@RestController
@RequestMapping("/api/employers")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('EMPLOYER')")
@Tag(name = "Employers", description = "Employer management APIs")
public class EmployerController {

    private static final Logger logger = LoggerFactory.getLogger(EmployerController.class);

    @Autowired
    private IEmployerService employerService;

    @Operation(summary = "Create an employer")
    @PostMapping
    public ResponseEntity<EmployerDTO> createEmployer(@Valid @RequestBody EmployerDTO dto) {
        logger.info("Request to create employer for userId: {}", dto.getUserId());
        EmployerDTO created = employerService.createEmployer(dto);
        logger.info("Employer created successfully with ID: {}", created.getEmployerId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Get employer by ID")
    @GetMapping("/{id}")
    public ResponseEntity<EmployerDTO> getEmployerById(@PathVariable int id) {
        logger.info("Request to fetch employer with ID: {}", id);
        EmployerDTO employer = employerService.getEmployerById(id);
        logger.info("Successfully fetched employer with ID: {}", id);
        return ResponseEntity.ok(employer);
    }
    
    @Operation(summary = "Get employer profile by User ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<EmployerDTO> getEmployerByUserId(@PathVariable int userId) {
        logger.info("Fetching employer with userId: {}", userId);
        EmployerDTO dto = employerService.getEmployerByUserId(userId);
        return ResponseEntity.ok(dto);
    }

    @Operation(summary = "Get all employers")
    @GetMapping
    public ResponseEntity<List<EmployerDTO>> getAllEmployers() {
        logger.info("Request to fetch all employers");
        List<EmployerDTO> employers = employerService.getAllEmployers();
        logger.info("Fetched {} employers", employers.size());
        return ResponseEntity.ok(employers);
    }

    @Operation(summary = "Update an employer")
    @PutMapping
    public ResponseEntity<EmployerDTO> updateEmployer(@Valid @RequestBody EmployerDTO dto) {
        logger.info("Request to update employer with ID: {}", dto.getEmployerId());
        EmployerDTO updated = employerService.updateEmployer(dto);
        logger.info("Employer with ID {} updated successfully", dto.getEmployerId());
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete an employer")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployer(@PathVariable int id) {
        logger.info("Request to delete employer with ID: {}", id);
        employerService.deleteEmployer(id);
        logger.info("Employer with ID {} deleted successfully", id);
        return ResponseEntity.ok("Employer deleted successfully");
    }
}
