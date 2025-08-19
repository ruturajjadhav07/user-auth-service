package ruturaj.authentication.io;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class profileResponse {
    // DTOs
    // server sends back user profile information to the client, usually after
    // registration, login, or profile fetch.
    private String userId;
    private String name;
    private String email;
    private Boolean isAccountVerified;

}
