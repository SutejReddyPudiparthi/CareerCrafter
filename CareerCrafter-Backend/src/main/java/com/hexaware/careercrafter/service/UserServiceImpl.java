package com.hexaware.careercrafter.service;
import com.hexaware.careercrafter.dto.UserDTO;
import com.hexaware.careercrafter.entities.User;
import com.hexaware.careercrafter.entities.PasswordResetToken;
import com.hexaware.careercrafter.exception.*;
import com.hexaware.careercrafter.repository.UserRepository;
import com.hexaware.careercrafter.repository.PasswordResetTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/*
 * Implementation of IUserService.
 * Implements user-related operations.
 */
@Service
public class UserServiceImpl implements IUserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private PasswordResetTokenRepository resetTokenRepository;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        logger.debug("Attempting to create a user with email: {}", userDTO.getEmail());
        if (userDTO.getEmail() == null || userDTO.getPassword() == null || userDTO.getName() == null) {
            logger.error("Failed to create user - missing required fields");
            throw new InvalidRequestException("Name, Email, and Password are required.");
        }
        if (userRepository.findByEmail(userDTO.getEmail()) != null) {
            logger.error("Failed to create user - email {} already exists", userDTO.getEmail());
            throw new DuplicateResourceException("Email already exists.");
        }
        
        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        userDTO.setPassword(encodedPassword);
        User savedUser = userRepository.save(convertToEntity(userDTO));
        logger.info("User created successfully with ID: {}", savedUser.getUserId());
        return convertToDTO(savedUser);
    }
    @Override
    public List<UserDTO> getAllUsers() {
        logger.debug("Fetching all users from database");
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    @Override
    public UserDTO getUserById(int userId) {
        logger.debug("Fetching user with ID: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    logger.error("User with ID {} not found", userId);
                    return new ResourceNotFoundException("User with ID " + userId + " not found.");
                });
        return convertToDTO(user);
    }
    @Override
    public UserDTO updateUser(UserDTO userDTO) {
        logger.debug("Updating user with ID: {}", userDTO.getUserId());
        if (userDTO.getUserId() <= 0 || userDTO.getName() == null || userDTO.getEmail() == null) {
            logger.error("Invalid request for updating user - ID, Name, and Email are required");
            throw new InvalidRequestException("User ID, Name, and Email are required for update.");
        }
        userRepository.findById(userDTO.getUserId())
                .orElseThrow(() -> {
                    logger.error("Cannot update - User with ID {} not found", userDTO.getUserId());
                    return new ResourceNotFoundException("User with ID " + userDTO.getUserId() + " not found.");
                });
        User existingByEmail = userRepository.findByEmail(userDTO.getEmail());
        if (existingByEmail != null && existingByEmail.getUserId() != userDTO.getUserId()) {
            logger.error("Cannot update - Email {} is already used by another user", userDTO.getEmail());
            throw new DuplicateResourceException("Email already in use by another user.");
        }
        User updatedUser = userRepository.save(convertToEntity(userDTO));
        logger.info("User with ID {} updated successfully", updatedUser.getUserId());
        return convertToDTO(updatedUser);
    }
    
    @Override
    public void deleteUser(int userId) {
        logger.debug("Deleting user with ID: {}", userId);
        if (!userRepository.existsById(userId)) {
            logger.error("Cannot delete - User with ID {} not found", userId);
            throw new ResourceNotFoundException("User with ID " + userId + " not found.");
        }
        userRepository.deleteById(userId);
        logger.info("User with ID {} deleted successfully", userId);
    }
    
    public boolean verifyUserCredentials(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user == null) return false;
        return passwordEncoder.matches(password, user.getPassword());
    }

    @Override
    public void savePasswordResetToken(int userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        resetTokenRepository.save(resetToken);
        logger.info("Saved password reset token for user ID: {}", userId);
    }

    @Override
    public Integer getUserIdByResetToken(String token) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(token);
        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            logger.warn("Invalid or expired password reset token: {}", token);
            return null;
        }
        return resetToken.getUser().getUserId();
    }

    @Override
    public void invalidateResetToken(String token) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(token);
        if (resetToken != null) {
            resetTokenRepository.delete(resetToken);
            logger.info("Invalidated password reset token: {}", token);
        }
    }

    @Override
    public void updatePassword(Integer userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        logger.info("Password updated for user ID: {}", userId);
    }

    private User convertToEntity(UserDTO dto) {
        User user = new User();
        user.setUserId(dto.getUserId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setUserType(dto.getUserType());
        return user;
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPassword(user.getPassword());
        dto.setUserType(user.getUserType());
        return dto;
    }
}
