package com.disputeshield.backend.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "audit_entries")
public class AuditEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String disputeId;

    @Column(nullable = false)
    private String label;

    /** Human-readable display timestamp, matching the style already used in the UI. */
    @Column(nullable = false)
    private String timestamp;

    /** Real instant, kept separately so entries can always be sorted correctly regardless of display format. */
    @Column(nullable = false)
    private Instant occurredAt;

    protected AuditEntryEntity() {
        // JPA
    }

    public AuditEntryEntity(String disputeId, String label, String timestamp, Instant occurredAt) {
        this.disputeId = disputeId;
        this.label = label;
        this.timestamp = timestamp;
        this.occurredAt = occurredAt;
    }

    public Long getId() { return id; }
    public String getDisputeId() { return disputeId; }
    public String getLabel() { return label; }
    public String getTimestamp() { return timestamp; }
    public Instant getOccurredAt() { return occurredAt; }
}
