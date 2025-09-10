package com.hexaware.careercrafter.entities;

import jakarta.persistence.*;

import java.util.List;


/*
 * This represents an Employer class
 * An Employer is Linked to the User Entity
 * It is responsible for posting jobs
 * 
 */


@Entity
@Table(name="employers")
public class Employer {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int employerId;

	@OneToOne
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	@Column(nullable = false)
	private String companyName;
	private String companyDescription;
	private String position;
	
	@OneToMany(mappedBy = "employer", cascade = CascadeType.ALL)
	private List<JobListing> jobListings;

	public Employer() {
		
	}

	public Employer(int employerId, User user, String companyName, String companyDescription, String position,
			List<JobListing> jobListings) {
		super();
		this.employerId = employerId;
		this.user = user;
		this.companyName = companyName;
		this.companyDescription = companyDescription;
		this.position = position;
		this.jobListings = jobListings;
	}

	public int getEmployerId() {
		return employerId;
	}

	public void setEmployerId(int employerId) {
		this.employerId = employerId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCompanyDescription() {
		return companyDescription;
	}

	public void setCompanyDescription(String companyDescription) {
		this.companyDescription = companyDescription;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public List<JobListing> getJobListings() {
		return jobListings;
	}

	public void setJobListings(List<JobListing> jobListings) {
		this.jobListings = jobListings;
	}
	
	
}
