package ruturaj.authentication.service;

import java.util.ArrayList;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ruturaj.authentication.entity.UserEntity;
import ruturaj.authentication.repository.UserRepository;

@Service
@RequiredArgsConstructor

public class AppUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    // this userdetail service in implemented in security config check that
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity existingUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Email not found for email: " + email));

        return new User(existingUser.getEmail(), existingUser.getPassword(), new ArrayList<>());
        // pass email,password and arraylist because we are not dealing with other roles

    }

}
