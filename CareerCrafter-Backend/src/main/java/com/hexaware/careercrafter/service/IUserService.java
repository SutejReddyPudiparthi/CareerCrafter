package com.hexaware.careercrafter.service;

import com.hexaware.careercrafter.dto.UserDTO;

import java.util.List;

/*
 * service interface for business operations related to users.
 */

public interface IUserService {
	
    UserDTO createUser(UserDTO userDTO);
    UserDTO getUserById(int userId);
    List<UserDTO> getAllUsers();
    UserDTO updateUser(UserDTO userDTO);
    void deleteUser(int userId);
    boolean verifyUserCredentials(String email, String password);
    
    void savePasswordResetToken(int userId, String token);
    Integer getUserIdByResetToken(String token);
    void invalidateResetToken(String token);
    void updatePassword(Integer userId, String newPassword);

}
