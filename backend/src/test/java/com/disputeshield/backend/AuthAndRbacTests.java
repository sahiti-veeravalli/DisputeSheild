package com.disputeshield.backend;

import com.disputeshield.backend.config.JwtService;
import com.disputeshield.backend.domain.Role;
import com.disputeshield.backend.domain.User;
import com.disputeshield.backend.dto.AuthResponseDto;
import com.disputeshield.backend.dto.LoginRequestDto;
import com.disputeshield.backend.dto.RegisterRequestDto;
import com.disputeshield.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthAndRbacTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private String getAuthToken(String email, String password) throws Exception {
        LoginRequestDto login = new LoginRequestDto(email, password);
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn();
        AuthResponseDto resp = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponseDto.class);
        return resp.token();
    }

    @Test
    void userRegistrationSuccess() throws Exception {
        String testEmail = "newuser" + System.currentTimeMillis() + "@disputeshield.ai";
        RegisterRequestDto reg = new RegisterRequestDto(
                "Jane Doe",
                testEmail,
                "Password@123",
                Role.INVESTIGATOR
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.name").value("Jane Doe"))
                .andExpect(jsonPath("$.user.email").value(testEmail.toLowerCase()))
                .andExpect(jsonPath("$.user.role").value("INVESTIGATOR"));
    }

    @Test
    void duplicateRegistrationReturns409() throws Exception {
        RegisterRequestDto reg = new RegisterRequestDto(
                "Duplicate Admin",
                "admin@disputeshield.ai",
                "Password@123",
                Role.ADMIN
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value(containsString("already exists")));
    }

    @Test
    void invalidRegistrationPayloadReturns400() throws Exception {
        RegisterRequestDto reg = new RegisterRequestDto(
                "",
                "invalid-email",
                "123",
                Role.INVESTIGATOR
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").isString());
    }

    @Test
    void successfulLoginReturnsJwtAndUser() throws Exception {
        LoginRequestDto login = new LoginRequestDto("investigator@disputeshield.ai", "Investigator@1234");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.role").value("INVESTIGATOR"))
                .andExpect(jsonPath("$.user.name").value("Alex Rivera (Lead Investigator)"))
                .andReturn();

        AuthResponseDto resp = objectMapper.readValue(result.getResponse().getContentAsString(), AuthResponseDto.class);
        assertThat(jwtService.isTokenValid(resp.token())).isTrue();
        assertThat(jwtService.extractEmail(resp.token())).isEqualTo("investigator@disputeshield.ai");
        assertThat(jwtService.extractRole(resp.token())).isEqualTo(Role.INVESTIGATOR);
    }

    @Test
    void loginWithWrongPasswordReturns401() throws Exception {
        LoginRequestDto login = new LoginRequestDto("admin@disputeshield.ai", "WrongPassword!99");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password."));
    }

    @Test
    void loginWithUnknownUserReturns401() throws Exception {
        LoginRequestDto login = new LoginRequestDto("nonexistent@disputeshield.ai", "AnyPassword@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password."));
    }

    @Test
    void passwordIsHashedWithBcrypt() {
        User admin = userRepository.findByEmailIgnoreCase("admin@disputeshield.ai").orElseThrow();
        assertThat(admin.getPasswordHash()).startsWith("$2a$").doesNotContain("Admin@1234");
        assertThat(passwordEncoder.matches("Admin@1234", admin.getPasswordHash())).isTrue();
    }

    @Test
    void protectedEndpointWithoutJwtReturns401() throws Exception {
        mockMvc.perform(get("/api/disputes"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value(containsString("Unauthorized")));
    }

    @Test
    void protectedEndpointWithInvalidJwtReturns401() throws Exception {
        mockMvc.perform(get("/api/disputes")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer invalid.jwt.token.string"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value(containsString("Unauthorized")));
    }

    @Test
    void getCurrentUserProfileWithJwt() throws Exception {
        String token = getAuthToken("reviewer@disputeshield.ai", "Reviewer@1234");

        mockMvc.perform(get("/api/auth/me")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("reviewer@disputeshield.ai"))
                .andExpect(jsonPath("$.role").value("REVIEWER"))
                .andExpect(jsonPath("$.name").value("Elena Rostova (Compliance Reviewer)"));
    }

    @Test
    void adminCanAccessSettingsAndAllWorkflows() throws Exception {
        String adminToken = getAuthToken("admin@disputeshield.ai", "Admin@1234");

        // Can access disputes
        mockMvc.perform(get("/api/disputes")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isOk());

        // Can access admin settings
        mockMvc.perform(get("/api/settings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activePaymentGateway").isString());

        // Can run analyze
        mockMvc.perform(post("/api/disputes/DSP-48291/analyze")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isOk());

        // Can approve
        mockMvc.perform(post("/api/disputes/DSP-48291/approve")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }

    @Test
    void investigatorCanAnalyzeDisputesButCannotAccessSettingsOrApprovePackets() throws Exception {
        String investigatorToken = getAuthToken("investigator@disputeshield.ai", "Investigator@1234");

        // Can access disputes
        mockMvc.perform(get("/api/disputes")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + investigatorToken))
                .andExpect(status().isOk());

        // Can run analyze
        mockMvc.perform(post("/api/disputes/DSP-48292/analyze")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + investigatorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completeness").isNumber());

        // Cannot access admin settings -> 403 Forbidden
        mockMvc.perform(get("/api/settings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + investigatorToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value(containsString("Forbidden")));

        // Cannot approve packets -> 403 Forbidden
        mockMvc.perform(post("/api/disputes/DSP-48292/approve")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + investigatorToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value(containsString("Forbidden")));
    }

    @Test
    void reviewerCanApprovePacketsButCannotAnalyzeDisputesOrAccessSettings() throws Exception {
        String reviewerToken = getAuthToken("reviewer@disputeshield.ai", "Reviewer@1234");
        String adminToken = getAuthToken("admin@disputeshield.ai", "Admin@1234");

        // Ensure dispute has been analyzed first by admin/investigator
        mockMvc.perform(post("/api/disputes/DSP-48295/analyze")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + adminToken))
                .andExpect(status().isOk());

        // Reviewer can view disputes
        mockMvc.perform(get("/api/disputes")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + reviewerToken))
                .andExpect(status().isOk());

        // Reviewer can view analysis
        mockMvc.perform(get("/api/disputes/DSP-48295/analysis")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + reviewerToken))
                .andExpect(status().isOk());

        // Reviewer can approve packet
        mockMvc.perform(post("/api/disputes/DSP-48295/approve")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + reviewerToken))
                .andExpect(status().isNoContent());

        // Reviewer cannot run analyze -> 403 Forbidden
        mockMvc.perform(post("/api/disputes/DSP-48294/analyze")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + reviewerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value(containsString("Forbidden")));

        // Reviewer cannot access settings -> 403 Forbidden
        mockMvc.perform(get("/api/settings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + reviewerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value(containsString("Forbidden")));
    }
}
