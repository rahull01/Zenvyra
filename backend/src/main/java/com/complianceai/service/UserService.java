package com.complianceai.service;

import com.complianceai.model.User;
import com.complianceai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(String email, User updates) {
        User user = getUserByEmail(email);

        if (updates.getFullName() != null)
            user.setFullName(updates.getFullName());
        if (updates.getCompanyName() != null)
            user.setCompanyName(updates.getCompanyName());
        if (updates.getIndustry() != null)
            user.setIndustry(updates.getIndustry());
        if (updates.getEmployeeCount() != null)
            user.setEmployeeCount(updates.getEmployeeCount());

        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public void deleteUser(String email) {
        User user = getUserByEmail(email);
        userRepository.delete(user);
    }
}
