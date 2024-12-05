package com.desarrollo.criminal.user;

import com.desarrollo.criminal.entity.Activity;
import com.desarrollo.criminal.entity.Package;
import com.desarrollo.criminal.entity.PackageActivity;
import com.desarrollo.criminal.entity.user.User;
import com.desarrollo.criminal.repository.UserRepository;
import com.desarrollo.criminal.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.hibernate.validator.internal.util.Contracts.assertNotNull;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void testGetActivitiesUser_Success() {
        // Given
        String email = "ejemplo@ejemlo.com";

        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setId(1L);

        Activity mockActivity1 = new Activity();
        mockActivity1.setName("Ejemplo");

        Activity mockActivity2 = new Activity();
        mockActivity2.setName("Ejemplo2");

        PackageActivity mockPackageActivity1 = new PackageActivity();
        mockPackageActivity1.setActivity(mockActivity1);
        mockPackageActivity1.setQuantity(1);

        PackageActivity mockPackageActivity2 = new PackageActivity();
        mockPackageActivity2.setActivity(mockActivity2);
        mockPackageActivity2.setQuantity(2);

        Package mockPackage = new Package();
        mockPackage.setUser(mockUser);
        mockPackage.setPackageActivities(Set.of(mockPackageActivity1, mockPackageActivity2));

        // When
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));
        when(userRepository.findActivePackagesByUserId(mockUser.getId())).thenReturn(Optional.of(mockPackage));

        ResponseEntity<List<String>> response = userService.getActivitiesUser(email);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertEquals("Ejemplo", response.getBody().get(0));
        assertEquals("Ejemplo2", response.getBody().get(1));
    }

    @Test
    void testGetActivitiesUser_UserNotFound() {
        // Given
        String email = "ejemplo@ejemlo.com";

        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setId(1L);

        // When
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        ResponseEntity<List<String>> response = userService.getActivitiesUser(email);


        EntityNotFoundException entityNotFoundException = assertThrows(EntityNotFoundException.class, () -> {
            throw new EntityNotFoundException("User not found with email: " + email);
        });

    }
}
