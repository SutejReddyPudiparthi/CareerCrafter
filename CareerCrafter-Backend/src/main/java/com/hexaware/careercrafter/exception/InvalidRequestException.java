package com.hexaware.careercrafter.exception;

public class InvalidRequestException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	/*
	 * Exception thrown when an incoming request is invalid, missing.
	 */
	
	public InvalidRequestException(String message) {
        super(message);
    }

}
