package ruturaj.authentication.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

    // for checking after loging
    // @GetMapping("/test")
    // public String test() {
    // return "Auth is working";
    // }

    @GetMapping("/profile")
    public profileResponse getProfile(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        // if user is not login and if CurrentSecurityContext did not able to find email
        // address then it will throw exception
        return profileService.getProfile(email);

    }
}
