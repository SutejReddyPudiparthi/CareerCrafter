package com.hexaware.careercrafter.controller;

import com.hexaware.careercrafter.dto.JobListingDTO;
import com.hexaware.careercrafter.service.IJobListingService;
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

/*
 * Controller for job listings.
 */

@RestController
@RequestMapping("/api/joblistings")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Job Listings", description = "Job listing management APIs")
public class JobListingController {

    private static final Logger logger = LoggerFactory.getLogger(JobListingController.class);

    @Autowired
    private IJobListingService jobListingService;
    
    @Autowired
    private IJobSeekerService jobSeekerService;

    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Create a new job listing")
    @PostMapping
    public ResponseEntity<JobListingDTO> createJobListing(@Valid @RequestBody JobListingDTO dto) {
        logger.info("Request to create job listing with title: {}", dto.getTitle());
        JobListingDTO created = jobListingService.createJobListing(dto);
        logger.info("Job listing created successfully with ID: {}", created.getJobListingId());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Get job listing by ID")
    @GetMapping("/{id}")
    public ResponseEntity<JobListingDTO> getJobListingById(@PathVariable int id) {
        logger.info("Request to fetch job listing with ID: {}", id);
        JobListingDTO listing = jobListingService.getJobListingById(id);
        logger.info("Successfully fetched job listing with ID: {}", id);
        return ResponseEntity.ok(listing);
    }

    @PreAuthorize("hasRole('JOBSEEKER') or hasRole('EMPLOYER')")
    @Operation(summary = "Get all job listings")
    @GetMapping
    public ResponseEntity<List<JobListingDTO>> getAllJobListings() {
        logger.info("Request to fetch all job listings");
        List<JobListingDTO> listings = jobListingService.getAll();
        logger.info("Fetched {} job listings", listings.size());
        return ResponseEntity.ok(listings);
    }

    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Update a job listing")
    @PutMapping
    public ResponseEntity<JobListingDTO> updateJobListing(@Valid @RequestBody JobListingDTO dto) {
        logger.info("Request to update job listing with ID: {}", dto.getJobListingId());
        JobListingDTO updated = jobListingService.updateJobListing(dto);
        logger.info("Job listing updated successfully with ID: {}", dto.getJobListingId());
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('EMPLOYER')")
    @Operation(summary = "Delete (soft) a job listing")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJobListing(@PathVariable int id) {
        logger.info("Request to delete job listing with ID: {}", id);
        jobListingService.deleteJobListing(id);
        logger.info("Job listing marked inactive with ID: {}", id);
        return ResponseEntity.ok("Job Listing deleted successfully");
    }
    
    @PreAuthorize("hasRole('JOBSEEKER')")
    @Operation(summary = "Get job recommendations for a job seeker")
    @GetMapping("/jobseekers/{seekerId}/recommendations")
    public ResponseEntity<List<JobListingDTO>> getJobRecommendations(@PathVariable int seekerId) {
        List<JobListingDTO> recs = jobSeekerService.getJobRecommendations(seekerId);
        return ResponseEntity.ok(recs);
    }
}
