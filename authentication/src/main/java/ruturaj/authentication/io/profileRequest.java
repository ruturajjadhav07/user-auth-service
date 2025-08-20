package ruturaj.authentication.io;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class profileRequest {
    // DTOs
    // client send details such as name email and password
    @NotBlank(message = "Name should not be empty")
    private String name;
    @Email(message = "Enter a valid email address")
    @NotNull(message = "Email should not be empty")
    private String email;
    @NotBlank(message = "Password should not be empty")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
