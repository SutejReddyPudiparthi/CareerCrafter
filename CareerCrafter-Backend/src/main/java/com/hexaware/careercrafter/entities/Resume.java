package com.hexaware.careercrafter.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/*
 * Entity representing a resume uploaded by a job seeker.
 * Linked to a JobSeeker and stores metadata such as upload date and file path.
 */

@Entity
@Table(name = "resumes")
public class Resume {
	
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int resumeId;

    @ManyToOne
    @JoinColumn(name = "seeker_id", nullable = false)
    private JobSeeker jobSeeker;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadDate;

    @Column(nullable = false)
    private boolean isPrimary;

    public Resume() {
    	
    }

    public Resume(int resumeId, JobSeeker jobSeeker, String filePath, LocalDateTime uploadDate, boolean isPrimary) {
        this.resumeId = resumeId;
        this.jobSeeker = jobSeeker;
        this.filePath = filePath;
        this.uploadDate = uploadDate != null ? uploadDate : LocalDateTime.now();
        this.isPrimary = isPrimary;
    }

    public int getResumeId() {
        return resumeId;
    }

    public void setResumeId(int resumeId) {
        this.resumeId = resumeId;
    }

    public JobSeeker getJobSeeker() {
        return jobSeeker;
    }

    public void setJobSeeker(JobSeeker jobSeeker) {
        this.jobSeeker = jobSeeker;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public boolean isPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean isPrimary) {
        this.isPrimary = isPrimary;
    }
}
