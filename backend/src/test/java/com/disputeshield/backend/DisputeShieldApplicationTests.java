package com.disputeshield.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class DisputeShieldApplicationTests {

    private static final String API_KEY_HEADER = "X-API-Key";
    private static final String VALID_API_KEY = "disputeshield-demo-key-2026";

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
    }

    @Test
    void listDisputesReturnsAllEightSeededDisputes() throws Exception {
        mockMvc.perform(get("/api/disputes")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(8));
    }

    @Test
    void analyzeReturnsCompletenessScoreAndReadinessLevel() throws Exception {
        mockMvc.perform(post("/api/disputes/DSP-48291/analyze")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completeness").value(83))
                .andExpect(jsonPath("$.readiness").value("MEDIUM"))
                .andExpect(jsonPath("$.missing.length()").value(1))
                .andExpect(jsonPath("$.missing[0].key").value("signedProofOfDelivery"));
    }

    @Test
    void unknownDisputeReturns404() throws Exception {
        mockMvc.perform(get("/api/disputes/DSP-NOPE")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("No dispute found with id: DSP-NOPE"));
    }

    @Test
    void analysisBeforeAnalyzeReturns400() throws Exception {
        mockMvc.perform(get("/api/disputes/DSP-48294/analysis")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").isString());
    }

    @Test
    void packetBeforeAnalyzeReturns400() throws Exception {
        mockMvc.perform(post("/api/disputes/DSP-48294/packet")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").isString());
    }

    @Test
    void duplicateSubmitReturns409() throws Exception {
        // DSP-48298 is seeded with status RESOLVED and submitted = false initially in seeder?
        // Let's test analyze -> submit -> second submit on a dispute (e.g. DSP-48295)
        mockMvc.perform(post("/api/disputes/DSP-48295/analyze")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/disputes/DSP-48295/packet")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/disputes/DSP-48295/approve")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/disputes/DSP-48295/submit")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.submissionRef").value("RZP-DEMO-DSP-48295"));

        // Second submit should fail with 409 Conflict
        mockMvc.perform(post("/api/disputes/DSP-48295/submit")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Dispute DSP-48295 has already been submitted."));
    }

    @Test
    void auditTrailIsPopulatedAndOrdered() throws Exception {
        mockMvc.perform(get("/api/disputes/DSP-48291/audit")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].label").value("Dispute opened"));
    }

    @Test
    void missingApiKeyOnProtectedEndpointReturns401() throws Exception {
        mockMvc.perform(get("/api/disputes"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").isString());
    }

    @Test
    void invalidApiKeyOnProtectedEndpointReturns401() throws Exception {
        mockMvc.perform(get("/api/disputes")
                        .header(API_KEY_HEADER, "wrong-key"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").isString());
    }

    @Test
    void evaluationReportMatchesTheLoadBearingSeed42NumbersWithoutApiKey() throws Exception {
        // Public endpoint without X-API-Key
        mockMvc.perform(get("/api/evaluation/report"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.testSize").value(40))
                .andExpect(jsonPath("$.precision").value(0.556))
                .andExpect(jsonPath("$.recall").value(0.833))
                .andExpect(jsonPath("$.f1").value(0.667))
                .andExpect(jsonPath("$.falsePositiveCostInInr").value(85567))
                .andExpect(jsonPath("$.confusionMatrix.truePositive").isNumber())
                .andExpect(jsonPath("$.methodology").isString())
                .andExpect(jsonPath("$.guardrailNote").isString())
                .andExpect(jsonPath("$.exceptions.length()").value(5));
    }
}

