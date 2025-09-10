package com.hexaware.careercrafter.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;


/*
 * Application is a entity that is represented by JobSeeker
 * It links a JobSeeker with a JobListing
 */


@Entity
@Table(name="applications")
public class Application {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int applicationId;
	
	@ManyToOne
	@JoinColumn(name = "job_listing_id", nullable = false)
	private JobListing jobListing;

	@ManyToOne
	@JoinColumn(name = "seeker_id", nullable = false)
	private JobSeeker jobSeeker;

	@Column(updatable = false)
	private LocalDateTime applicationDate = LocalDateTime.now();

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ApplicationStatus status = ApplicationStatus.APPLIED;

	@Column(columnDefinition = "TEXT")
	private String resumeFilePath;
	private String jobTitle;
	private String applicantName;

	public enum ApplicationStatus {
		APPLIED, IN_REVIEW, SHORTLISTED, REJECTED, HIRED
	}

	public Application() {
		
	}

	public Application(int applicationId, JobListing jobListing, JobSeeker jobSeeker, LocalDateTime applicationDate,
			ApplicationStatus status, String coverLetter, String resumeFilePath, String jobTitle, String applicantName) {
		this.applicationId = applicationId;
		this.jobListing = jobListing;
		this.jobSeeker = jobSeeker;
		this.applicationDate = applicationDate;
		this.status = status;
		this.resumeFilePath = resumeFilePath;
		this.jobTitle = jobTitle;
		this.applicantName = applicantName;
	}

	public int getApplicationId() {
		return applicationId;
	}

	public void setApplicationId(int applicationId) {
		this.applicationId = applicationId;
	}

	public JobListing getJobListing() {
		return jobListing;
	}

	public void setJobListing(JobListing jobListing) {
		this.jobListing = jobListing;
	}

	public JobSeeker getJobSeeker() {
		return jobSeeker;
	}

	public void setJobSeeker(JobSeeker jobSeeker) {
		this.jobSeeker = jobSeeker;
	}

	public LocalDateTime getApplicationDate() {
		return applicationDate;
	}

	public void setApplicationDate(LocalDateTime applicationDate) {
		this.applicationDate = applicationDate;
	}

	public ApplicationStatus getStatus() {
		return status;
	}

	public void setStatus(ApplicationStatus status) {
		this.status = status;
	}

	public String getResumeFilePath() {
		return resumeFilePath;
	}

	public void setResumeFilePath(String resumeFilePath) {
		this.resumeFilePath = resumeFilePath;
	}
	
	public String getJobTitle() {
	    return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
	    this.jobTitle = jobTitle;
	}

	public String getApplicantName() {
	    return applicantName;
	}

	public void setApplicantName(String applicantName) {
	    this.applicantName = applicantName;
	}
	
}
