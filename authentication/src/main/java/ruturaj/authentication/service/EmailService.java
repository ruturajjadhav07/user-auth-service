package ruturaj.authentication.service;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    // send welcome message
    public void sendWelcome(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to our platform");
        message.setText("Hello " + name + ", \n\nThanks for registering to our platform !\n\n Regards, \nOur team");
        mailSender.send(message);
    }

    // send reset otp email
    public void sendResetOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset Otp");
        message.setText("Otp for resetting password is " + otp);
        mailSender.send(message);
    }

    // send verify otp for email and use this in profileserviceimpl method
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Email verification OTP");
        message.setText("Your OTP for email verification is " + otp);
        mailSender.send(message);
    }
}
