package com.disputeshield.backend.web;

import com.disputeshield.backend.dto.SettingsDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping("/api/settings")
@Tag(name = "Settings", description = "Platform and payment gateway security settings (ADMIN only)")
@SecurityRequirement(name = "BearerAuth")
public class SettingsController {

    private final AtomicReference<SettingsDto> currentSettings = new AtomicReference<>(
            new SettingsDto(
                    "Razorpay Payments India (Live Demo Stream)",
                    "https://api.disputeshield.ai/api/webhooks/disputes",
                    true,
                    true,
                    10000L
            )
    );

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get platform settings", description = "Returns active gateway and risk threshold configurations. Restricted to ADMIN role.")
    public SettingsDto getSettings() {
        return currentSettings.get();
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update platform settings", description = "Updates platform gateway and risk thresholds. Restricted to ADMIN role.")
    public SettingsDto updateSettings(@RequestBody SettingsDto newSettings) {
        currentSettings.set(newSettings);
        return currentSettings.get();
    }
}
