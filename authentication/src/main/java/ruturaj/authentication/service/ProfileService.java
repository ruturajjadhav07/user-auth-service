package ruturaj.authentication.service;

import ruturaj.authentication.io.profileRequest;
import ruturaj.authentication.io.profileResponse;

public interface ProfileService {
    profileResponse createProfile(profileRequest request);

    profileResponse getProfile(String email);
}
