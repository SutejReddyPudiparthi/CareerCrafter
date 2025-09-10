package com.hexaware.careercrafter.controller;

import com.hexaware.careercrafter.dto.JobSeekerDTO;
import com.hexaware.careercrafter.dto.JobListingDTO;
import com.hexaware.careercrafter.service.IJobSeekerService;

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

@RestController
@RequestMapping("/api/jobseekers")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Job Seekers", description = "Job seeker profile and recommendations APIs")
public class JobSeekerController {

    private static final Logger logger = LoggerFactory.getLogger(JobSeekerController.class);

    @Autowired
    private IJobSeekerService jobSeekerService;

    @Operation(summary = "Create a job seeker profile")
    @PostMapping
    public ResponseEntity<JobSeekerDTO> createJobSeeker(@Valid @RequestBody JobSeekerDTO dto) {
        logger.info("Creating job seeker for userId: {}", dto.getUserId());
        JobSeekerDTO created = jobSeekerService.createJobSeeker(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Get job seeker by ID")
    @GetMapping("/{id}")
    public ResponseEntity<JobSeekerDTO> getJobSeekerById(@PathVariable int id) {
        logger.info("Fetching job seeker with ID: {}", id);
        return ResponseEntity.ok(jobSeekerService.getJobSeekerById(id));
    }
    
    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Get job seeker profile by User ID")
    @GetMapping("/user/{userId}")
    public ResponseEntity<JobSeekerDTO> getJobSeekerByUserId(@PathVariable int userId) {
        logger.info("Fetching job seeker with userId: {}", userId);
        JobSeekerDTO dto = jobSeekerService.getJobSeekerByUserId(userId);
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Get all job seekers")
    @GetMapping
    public ResponseEntity<List<JobSeekerDTO>> getAllJobSeekers() {
        logger.info("Fetching all job seekers");
        return ResponseEntity.ok(jobSeekerService.getAllJobSeekers());
    }

    @PreAuthorize("hasRole('JOBSEEKER')")
    @Operation(summary = "Update a job seeker profile")
    @PutMapping
    public ResponseEntity<JobSeekerDTO> updateJobSeeker(@Valid @RequestBody JobSeekerDTO dto) {
        logger.info("Updating job seeker with ID: {}", dto.getJobSeekerId());
        return ResponseEntity.ok(jobSeekerService.updateJobSeeker(dto));
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Delete a job seeker profile")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJobSeeker(@PathVariable int id) {
        logger.info("Deleting job seeker with ID: {}", id);
        jobSeekerService.deleteJobSeeker(id);
        return ResponseEntity.ok("Job Seeker deleted successfully");
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Get job recommendations for a job seeker")
    @GetMapping("/{jobSeekerId}/recommendations")
    public ResponseEntity<List<JobListingDTO>> getJobRecommendations(@PathVariable int jobSeekerId) {
        logger.info("Fetching job recommendations for job seeker ID: {}", jobSeekerId);
        List<JobListingDTO> recommendations = jobSeekerService.getJobRecommendations(jobSeekerId);
        return ResponseEntity.ok(recommendations);
    }
}
