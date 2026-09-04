package com.disputeshield.backend.service;

import com.disputeshield.backend.domain.AuditEntryEntity;
import com.disputeshield.backend.domain.Dispute;
import com.disputeshield.backend.domain.DisputeReason;
import com.disputeshield.backend.domain.DisputeStatus;
import com.disputeshield.backend.domain.Role;
import com.disputeshield.backend.domain.User;
import com.disputeshield.backend.repository.AuditEntryRepository;
import com.disputeshield.backend.repository.DisputeRepository;
import com.disputeshield.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

/**
 * Seeds:
 * 1. The 8 demo disputes shown in the frontend (DSP-48291..DSP-48298) with audit trail.
 * 2. Deterministic demo accounts with BCrypt passwords for ADMIN, INVESTIGATOR, and REVIEWER.
 * Idempotent: safe to run repeatedly across restarts.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final DisputeRepository disputeRepository;
    private final AuditEntryRepository auditEntryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            DisputeRepository disputeRepository,
            AuditEntryRepository auditEntryRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.disputeRepository = disputeRepository;
        this.auditEntryRepository = auditEntryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedDisputes();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }

        List<User> demoUsers = List.of(
                new User("Sarah Connor (Admin)", "admin@disputeshield.ai", passwordEncoder.encode("Admin@1234"), Role.ADMIN),
                new User("Alex Rivera (Lead Investigator)", "investigator@disputeshield.ai", passwordEncoder.encode("Investigator@1234"), Role.INVESTIGATOR),
                new User("Elena Rostova (Compliance Reviewer)", "reviewer@disputeshield.ai", passwordEncoder.encode("Reviewer@1234"), Role.REVIEWER)
        );

        userRepository.saveAll(demoUsers);
    }

    private void seedDisputes() {
        if (disputeRepository.count() > 0) {
            return;
        }

        List<Dispute> demoDisputes = List.of(
                new Dispute("DSP-48291", "Priya Sharma", 4999, DisputeReason.PRODUCT_NOT_RECEIVED, 3,
                        DisputeStatus.NEW, "24 Aug 2026, 09:12 AM", List.of("signedProofOfDelivery")),
                new Dispute("DSP-48292", "Rahul Kumar", 12500, DisputeReason.FRAUDULENT_TRANSACTION, 5,
                        DisputeStatus.NEW, "22 Aug 2026, 04:47 PM", List.of("paymentAuthSignal")),
                new Dispute("DSP-48293", "Ananya Reddy", 2999, DisputeReason.PRODUCT_NOT_AS_DESCRIBED, 2,
                        DisputeStatus.INVESTIGATING, "25 Aug 2026, 11:03 AM", List.of("customerSupportMessages")),
                new Dispute("DSP-48294", "Arjun Patel", 7499, DisputeReason.DUPLICATE_CHARGE, 4,
                        DisputeStatus.NEW, "23 Aug 2026, 02:20 PM", List.of("refundHistory")),
                new Dispute("DSP-48295", "Vikram Singh", 15999, DisputeReason.PRODUCT_NOT_RECEIVED, 1,
                        DisputeStatus.NEW, "26 Aug 2026, 08:55 AM", List.of()),
                new Dispute("DSP-48296", "Sneha Iyer", 3499, DisputeReason.FRAUDULENT_TRANSACTION, 6,
                        DisputeStatus.INVESTIGATING, "21 Aug 2026, 06:31 PM", List.of("deviceConsistency", "ipConsistency")),
                new Dispute("DSP-48297", "Karan Mehta", 6250, DisputeReason.DUPLICATE_CHARGE, 2,
                        DisputeStatus.NEW, "25 Aug 2026, 01:15 PM", List.of("duplicateDetectionFlag")),
                new Dispute("DSP-48298", "Divya Nair", 8999, DisputeReason.PRODUCT_NOT_AS_DESCRIBED, 5,
                        DisputeStatus.RESOLVED, "19 Aug 2026, 10:40 AM", List.of("returnRefundPolicy"))
        );

        disputeRepository.saveAll(demoDisputes);

        for (Dispute d : demoDisputes) {
            auditEntryRepository.save(new AuditEntryEntity(d.getId(), "Dispute opened", d.getOpenedAt(), Instant.now()));
        }
    }
}
