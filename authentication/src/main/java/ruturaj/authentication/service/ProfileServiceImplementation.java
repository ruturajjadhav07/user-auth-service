package ruturaj.authentication.service;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    private final EmailService emailService;

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

    // get profile
    @Override
    public profileResponse getProfile(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        // once we get existing user we need to call convertTouser method
        return convertToProfileResponse(existingUser);
    }

    // send reset otp
    @Override
    public void sendResetOtp(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // generating otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        // calculate expiry time (i.e. current time + 15 minutes in milliseconds)
        long expiry = System.currentTimeMillis() + (15 * 10 * 1000);

        existingUser.setResetOtp(otp);
        existingUser.setResetOtpExpireAt(expiry);

        // save to database
        userRepository.save(existingUser);

        try {
            // send reset otp email
            emailService.sendResetOtpEmail(existingUser.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Unable to send email");
        }
    }

    // reset password
    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        // to check otp
        if (existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // check otp expiration time
        if (existingUser.getResetOtpExpireAt() < System.currentTimeMillis()) {
            throw new RuntimeException("Otp expired");
        }

        // set password
        existingUser.setPassword(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpireAt(0L);

        userRepository.save(existingUser);
    }

    // 2 send otp for verify email when user is logged in
    @Override
    public void sendOtp(String email) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (existingUser.getIsAccountVerified() != null && existingUser.getIsAccountVerified()) {
            return;
        }

        // if not verified then generate otp
        // generating otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
        // calculate expiry time (i.e. current time + 24 hours in milliseconds)
        long expiry = System.currentTimeMillis() + (24 * 60 * 60 * 1000);

        // update usr ENtity
        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpExpireAt(expiry);

        // save to db
        userRepository.save(existingUser);
        try {
            emailService.sendOtpEmail(existingUser.getEmail(), otp);
        } catch (Exception e) {
            throw new RuntimeException("Unable to send email");
        }
    }

    // 3 verify otp for email verification
    @Override
    public void verifyOtp(String email, String otp) {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        if (existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (existingUser.getVerifyOtpExpireAt() < System.currentTimeMillis()) {
            throw new RuntimeException("OTP Expired");
        }

        existingUser.setIsAccountVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpExpireAt(0L);

        userRepository.save(existingUser);
    }

    // // 1 get details of logged in user for sending otp
    // @Override
    // public String getLoggedInUserId(String email) {
    // // get loggedIn userId
    // UserEntity existingUser = userRepository.findByEmail(email)
    // .orElseThrow(() -> new UsernameNotFoundException("User not found: " +
    // email));

    // return existingUser.getUserId();
    // }

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
