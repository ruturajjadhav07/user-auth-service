package ruturaj.authentication.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ruturaj.authentication.io.profileRequest;
import ruturaj.authentication.io.profileResponse;
import ruturaj.authentication.service.ProfileService;

@RestController
// @RequestMapping("/api") // no need of it as we have doe in app properties
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public profileResponse register(@Valid @RequestBody profileRequest request) {
        profileResponse response = profileService.createProfile(request);
        // sending welcome email
        return response;
    }
}
