package ruturaj.authentication.filter;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import ruturaj.authentication.service.AppUserDetailService;
import ruturaj.authentication.util.JwtUtil;

@RequiredArgsConstructor
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final AppUserDetailService appUserDetailService;

    private final JwtUtil jwtUtil;

    // it is added in securityConfig file in securityFilterChain

    private static final List<String> PUBLIC_URLS = List.of("/login", "/register", "/send-reset-otp", "/reset-password",
            "/logout");

    // creating utility method to validate toen
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        if (PUBLIC_URLS.contains(path)) {
            filterChain.doFilter(request, response);
            return;
        }
        String jwt = null;
        String email = null;

        // 1 check authorization header
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
        }

        // 2 if authorization header not found, check cookie
        if (jwt == null) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("jwt".equals(cookie.getName())) {
                        jwt = cookie.getValue();
                        break;
                    }
                }
            }
        }

        // 3 validate token and set security context
        if (jwt != null) {
            email = jwtUtil.extractEmail(jwt);
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userdetail = appUserDetailService.loadUserByUsername(email);
                if (jwtUtil.validateToken(jwt, userdetail)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userdetail, null, userdetail.getAuthorities());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                }
            }
        }

        filterChain.doFilter(request, response);
    }

}

// A cookie is stored in the browser and sent with every HTTP request to the
// server.
// In authentication flows, instead of sending a JWT in the Authorization
// header, you can also send/store it in a cookie.

// Inside OncePerRequestFilter, you can read cookies from the
// HttpServletRequest.
// You might store a JWT/session token in a cookie and extract it in your
// filter.