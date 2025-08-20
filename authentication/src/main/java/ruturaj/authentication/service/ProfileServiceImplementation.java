package ruturaj.authentication.service;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import ruturaj.authentication.entity.UserEntity;
import ruturaj.authentication.io.profileRequest;
import ruturaj.authentication.io.profileResponse;
import ruturaj.authentication.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ProfileServiceImplementation implements ProfileService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    /**
     * This method creates a new user profile.
     * It takes user input (name, email, password), creates a UserEntity, saves it
     * in the database,
     * and then returns a response object back to the client.
     */
    @Override
    public profileResponse createProfile(profileRequest request) {
        // request DTO
        UserEntity newProfile = convertToUserEntity(request);
        if (!userRepository.existsByEmail(request.getEmail())) {
            // check email is already registered or not
            newProfile = userRepository.save(newProfile);
            return convertToProfileResponse(newProfile);
        }
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already Exists");
    }

    // Converts a UserEntity object (from DB) into a profileResponse (to be sent to
    // the client)
    private profileResponse convertToProfileResponse(UserEntity newProfile) {
        return profileResponse.builder()
                .name(newProfile.getName())
                .email(newProfile.getEmail())
                .userId(newProfile.getUserId())
                .isAccountVerified(newProfile.getIsAccountVerified())
                .build();
    }

    // Converts a UserEntity object (from DB) into a profileResponse (to be sent to
    // the client)
    private UserEntity convertToUserEntity(profileRequest request) {
        // here we are going to encrypt the password and store it
        return UserEntity.builder()
                .email(request.getEmail())
                .userId(UUID.randomUUID()
                        .toString())
                .name(request.getName())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAccountVerified(false)
                .resetOtpExpireAt(0L)
                .verifyOtp(null)
                .verifyOtpExpireAt(0L)
                .resetOtp(null)
                .build();
    }

}
