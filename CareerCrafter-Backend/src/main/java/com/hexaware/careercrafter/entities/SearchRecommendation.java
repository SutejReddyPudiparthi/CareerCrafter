package com.hexaware.careercrafter.entities;

import jakarta.persistence.*;


/*
 * Entity representing a user's job search history or preferences.
 * Can be used to generate personalized job recommendations.
 */

@Entity
@Table(name = "search_recommendations")
public class SearchRecommendation {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int searchId;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false, length=150)
	private String searchKeywords;

	@Column(columnDefinition = "TEXT")
	private String searchFilters;
	
	@Column(nullable = false, length = 50)
    private String location;
	
	@Column(nullable = false, length = 1000)
	private String recommendedJobs;

	public SearchRecommendation() {
		
	}

	public SearchRecommendation(int searchId, User user, String searchKeywords, String searchFilters, String location, String recommendedJobs) {
		this.searchId = searchId;
		this.user = user;
		this.searchKeywords = searchKeywords;
		this.searchFilters = searchFilters;
		this.location = location;
		this.recommendedJobs = recommendedJobs;
	}

	public int getSearchId() {
		return searchId;
	}

	public void setSearchId(int searchId) {
		this.searchId = searchId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public String getSearchKeywords() {
		return searchKeywords;
	}

	public void setSearchKeywords(String searchKeywords) {
		this.searchKeywords = searchKeywords;
	}

	public String getSearchFilters() {
		return searchFilters;
	}

	public void setSearchFilters(String searchFilters) {
		this.searchFilters = searchFilters;
	}
	
	public String getLocation() {
	    return location;
	}

	public void setLocation(String location) {
	    this.location = location;
	}

	public String getRecommendedJobs() {
	    return recommendedJobs;
	}

	public void setRecommendedJobs(String recommendedJobs) {
	    this.recommendedJobs = recommendedJobs;
	}

}
