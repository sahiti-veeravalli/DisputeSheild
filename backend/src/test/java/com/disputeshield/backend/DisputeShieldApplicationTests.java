package com.disputeshield.backend;

import com.disputeshield.backend.domain.DisputeReason;
import com.disputeshield.backend.domain.EvaluationDispute;
import com.disputeshield.backend.domain.Outcome;
import com.disputeshield.backend.domain.ReadinessLevel;
import com.disputeshield.backend.dto.AnalysisResultDto;
import com.disputeshield.backend.engine.EvidenceRules;
import com.disputeshield.backend.evaluation.EvaluationService;
import com.disputeshield.backend.evaluation.LogisticRegressionModel;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.*;
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

    @Autowired
    private EvaluationService evaluationService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void analyzeReturnsCompletenessScoreAndReadinessLevelAndMLProbability() throws Exception {
        mockMvc.perform(post("/api/disputes/DSP-48291/analyze")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.completeness").value(83))
                .andExpect(jsonPath("$.readiness").value("MEDIUM"))
                .andExpect(jsonPath("$.missing.length()").value(1))
                .andExpect(jsonPath("$.missing[0].key").value("signedProofOfDelivery"))
                .andExpect(jsonPath("$.evidenceSufficiencyProbability").isNumber())
                .andExpect(jsonPath("$.evidenceSufficiencyProbability").value(greaterThanOrEqualTo(0.0)))
                .andExpect(jsonPath("$.evidenceSufficiencyProbability").value(lessThanOrEqualTo(1.0)))
                .andExpect(jsonPath("$.topPositiveFactors").isArray())
                .andExpect(jsonPath("$.topPositiveFactors.length()").value(greaterThan(0)))
                .andExpect(jsonPath("$.decisionSupportDisclaimer").isString())
                .andExpect(jsonPath("$.decisionSupportDisclaimer").value(containsString("Evidence Sufficiency Probability is an AI decision-support estimate")));
    }

    @Test
    void mlProbabilityRangeAndOrderingAcrossDisputes() throws Exception {
        // DSP-48295 has 0 missing keys (complete evidence on file)
        MvcResult resComplete = mockMvc.perform(post("/api/disputes/DSP-48295/analyze")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andReturn();
        AnalysisResultDto dtoComplete = objectMapper.readValue(
                resComplete.getResponse().getContentAsString(), AnalysisResultDto.class);

        // DSP-48296 has 2 missing critical keys (device and ip consistency)
        MvcResult resGaps = mockMvc.perform(post("/api/disputes/DSP-48296/analyze")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andReturn();
        AnalysisResultDto dtoGaps = objectMapper.readValue(
                resGaps.getResponse().getContentAsString(), AnalysisResultDto.class);

        assertThat(dtoComplete.evidenceSufficiencyProbability()).isNotNull();
        assertThat(dtoComplete.evidenceSufficiencyProbability()).isBetween(0.0, 1.0);

        assertThat(dtoGaps.evidenceSufficiencyProbability()).isNotNull();
        assertThat(dtoGaps.evidenceSufficiencyProbability()).isBetween(0.0, 1.0);

        // A case with complete evidence must have higher sufficiency probability than one with multiple critical gaps
        assertThat(dtoComplete.evidenceSufficiencyProbability())
                .isGreaterThan(dtoGaps.evidenceSufficiencyProbability());
    }

    @Test
    void mlPredictionIsDeterministicAndReproducible() throws Exception {
        MvcResult res1 = mockMvc.perform(post("/api/disputes/DSP-48292/analyze")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andReturn();
        AnalysisResultDto dto1 = objectMapper.readValue(
                res1.getResponse().getContentAsString(), AnalysisResultDto.class);

        MvcResult res2 = mockMvc.perform(post("/api/disputes/DSP-48292/analyze")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andReturn();
        AnalysisResultDto dto2 = objectMapper.readValue(
                res2.getResponse().getContentAsString(), AnalysisResultDto.class);

        assertThat(dto1.evidenceSufficiencyProbability())
                .isEqualTo(dto2.evidenceSufficiencyProbability());
        assertThat(dto1.completeness()).isEqualTo(dto2.completeness());
        assertThat(dto1.readiness()).isEqualTo(dto2.readiness());
    }

    @Test
    void featureExtractionConsistencyBetweenEvaluationAndLiveAnalysis() {
        int completeness = 83;
        int foundCount = 6;
        int totalRules = EvidenceRules.RULES.get(DisputeReason.PRODUCT_NOT_RECEIVED).size(); // 7
        int missingCritical = 1;

        double[] liveFeatures = LogisticRegressionModel.extractFeatures(
                completeness, foundCount, totalRules, missingCritical);

        EvaluationDispute evalRow = new EvaluationDispute(
                "SYN-TEST", DisputeReason.PRODUCT_NOT_RECEIVED, 4999,
                completeness, foundCount, totalRules, missingCritical,
                ReadinessLevel.MEDIUM, Outcome.WON, false
        );
        double[] evalFeatures = LogisticRegressionModel.featuresOf(evalRow);

        assertThat(liveFeatures).isEqualTo(evalFeatures);

        double liveScore = evaluationService.predictSufficiency(
                completeness, foundCount, totalRules, missingCritical);
        double evalScore = evaluationService.getTrainedModel().predictProbability(evalRow);

        assertThat(liveScore).isEqualTo(evalScore);
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
        mockMvc.perform(post("/api/disputes/DSP-48293/analyze")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/disputes/DSP-48293/packet")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/disputes/DSP-48293/approve")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isNoContent());

        mockMvc.perform(post("/api/disputes/DSP-48293/submit")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.submissionRef").value("RZP-DEMO-DSP-48293"));

        // Second submit should fail with 409 Conflict
        mockMvc.perform(post("/api/disputes/DSP-48293/submit")
                        .header(API_KEY_HEADER, VALID_API_KEY))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("Dispute DSP-48293 has already been submitted."));
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
