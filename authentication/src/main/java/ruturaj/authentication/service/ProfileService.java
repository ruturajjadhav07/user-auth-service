package ruturaj.authentication.service;

import ruturaj.authentication.io.profileRequest;
import ruturaj.authentication.io.profileResponse;

public interface ProfileService {
    profileResponse createProfile(profileRequest request);

    profileResponse getProfile(String email);

    void sendResetOtp(String email);

    void resetPassword(String email,String otp,String newPassword);
}
