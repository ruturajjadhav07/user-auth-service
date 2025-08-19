package ruturaj.authentication.io;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class profileRequest {
    // DTOs
    // client send details such as name email and password
    private String name;
    private String email;
    private String password;
}
