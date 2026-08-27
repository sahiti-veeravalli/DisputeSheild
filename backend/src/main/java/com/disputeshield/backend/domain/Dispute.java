package com.disputeshield.backend.domain;

import com.disputeshield.backend.dto.AnalysisResultDto;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "disputes")
public class Dispute {

    @Id
    @Column(length = 32)
    private String id;

    @Column(nullable = false)
    private String customer;

    @Column(nullable = false)
    private long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeReason reason;

    @Column(nullable = false)
    private int deadlineDays;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DisputeStatus status;

    @Column(nullable = false)
    private String openedAt;

    @ElementCollection
    @CollectionTable(name = "dispute_missing_keys", joinColumns = @JoinColumn(name = "dispute_id"))
    @Column(name = "evidence_key")
    private List<String> missingKeys = new ArrayList<>();

    @Lob
    @Convert(converter = AnalysisResultConverter.class)
    @Column(columnDefinition = "TEXT")
    private AnalysisResultDto analysis;

    private boolean packetGenerated = false;
    private boolean packetApproved = false;
    private boolean submitted = false;
    private String submissionRef;

    protected Dispute() {
        // JPA
    }

    public Dispute(String id, String customer, long amount, DisputeReason reason, int deadlineDays,
                    DisputeStatus status, String openedAt, List<String> missingKeys) {
        this.id = id;
        this.customer = customer;
        this.amount = amount;
        this.reason = reason;
        this.deadlineDays = deadlineDays;
        this.status = status;
        this.openedAt = openedAt;
        this.missingKeys = missingKeys;
    }

    public String getId() { return id; }
    public String getCustomer() { return customer; }
    public long getAmount() { return amount; }
    public DisputeReason getReason() { return reason; }
    public int getDeadlineDays() { return deadlineDays; }
    public DisputeStatus getStatus() { return status; }
    public void setStatus(DisputeStatus status) { this.status = status; }
    public String getOpenedAt() { return openedAt; }
    public List<String> getMissingKeys() { return missingKeys; }
    public AnalysisResultDto getAnalysis() { return analysis; }
    public void setAnalysis(AnalysisResultDto analysis) { this.analysis = analysis; }
    public boolean isPacketGenerated() { return packetGenerated; }
    public void setPacketGenerated(boolean packetGenerated) { this.packetGenerated = packetGenerated; }
    public boolean isPacketApproved() { return packetApproved; }
    public void setPacketApproved(boolean packetApproved) { this.packetApproved = packetApproved; }
    public boolean isSubmitted() { return submitted; }
    public void setSubmitted(boolean submitted) { this.submitted = submitted; }
    public String getSubmissionRef() { return submissionRef; }
    public void setSubmissionRef(String submissionRef) { this.submissionRef = submissionRef; }
}
