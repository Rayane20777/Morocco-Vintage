package com.example.vintage.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender emailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String text, boolean isHtml) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(text, isHtml);
        
        emailSender.send(message);
    }

    public void sendWelcomeEmail(String to, String name) throws MessagingException {
        String subject = "Welcome to Vintage Maroc!";
        String htmlContent = String.format("""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50;">Welcome to Vintage Maroc, %s!</h2>
                        <p>Thank you for joining our community of vintage enthusiasts.</p>
                        <p>With your new account, you can:</p>
                        <ul>
                            <li>Browse our exclusive collection of vintage items</li>
                            <li>Track your orders</li>
                            <li>Save your favorite items</li>
                            <li>Receive updates on new arrivals</li>
                        </ul>
                        <p>If you have any questions, feel free to contact our support team.</p>
                        <div style="margin-top: 30px;">
                            <p>Best regards,</p>
                            <p><strong>The Vintage Maroc Team</strong></p>
                        </div>
                    </div>
                </body>
            </html>
            """, name);
        
        sendEmail(to, subject, htmlContent, true);
    }

    public void sendOrderConfirmation(String to, String name, String orderId, double totalAmount) throws MessagingException {
        String subject = "Order Confirmation - Vintage Maroc";
        String htmlContent = String.format("""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50;">Thank you for your order, %s!</h2>
                        <p>We're pleased to confirm your order:</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                            <p><strong>Order ID:</strong> %s</p>
                            <p><strong>Total Amount:</strong> %.2f MAD</p>
                        </div>
                        <p>We'll send you another email when your order ships.</p>
                        <p>You can track your order status in your account dashboard.</p>
                        <div style="margin-top: 30px;">
                            <p>Best regards,</p>
                            <p><strong>The Vintage Maroc Team</strong></p>
                        </div>
                    </div>
                </body>
            </html>
            """, name, orderId, totalAmount);
        
        sendEmail(to, subject, htmlContent, true);
    }

    public void sendShippingUpdate(String to, String name, String orderId, String trackingNumber, String status) throws MessagingException {
        String subject = "Shipping Update - Vintage Maroc";
        String htmlContent = String.format("""
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #2c3e50;">Shipping Update</h2>
                        <p>Dear %s,</p>
                        <p>There's an update to your order shipping status:</p>
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                            <p><strong>Order ID:</strong> %s</p>
                            <p><strong>Tracking Number:</strong> %s</p>
                            <p><strong>Status:</strong> %s</p>
                        </div>
                        <p>You can track your order using the tracking number above.</p>
                        <div style="margin-top: 30px;">
                            <p>Best regards,</p>
                            <p><strong>The Vintage Maroc Team</strong></p>
                        </div>
                    </div>
                </body>
            </html>
            """, name, orderId, trackingNumber, status);
        
        sendEmail(to, subject, htmlContent, true);
    }
} 