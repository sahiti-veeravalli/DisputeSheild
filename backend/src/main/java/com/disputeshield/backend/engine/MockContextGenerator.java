package com.disputeshield.backend.engine;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

/**
 * Direct port of the frontend's src/data/mock.ts. Given a dispute id, deterministically
 * derives display-only context fields (payment id, tracking id, courier, IP, etc.) used to
 * populate evidence detail rows. Purely cosmetic/demo data — no real customer or payment
 * information is involved.
 */
@Component
public class MockContextGenerator {

    private static final String ID_CHARS = "abcdefghjkmnpqrstuvwxyz0123456789";
    private static final List<String> COURIERS = List.of("BlueDart", "Delhivery", "Ekart Logistics", "XpressBees", "DTDC");
    private static final List<String> PRODUCTS = List.of(
            "Wireless Earbuds Pro", "Smart Fitness Band", "Ceramic Cookware Set", "Bluetooth Speaker Mini",
            "Leather Laptop Sleeve", "Compact Air Purifier", "Premium Yoga Mat", "Electric Kettle 1.5L"
    );
    private static final List<String> CITIES = List.of(
            "Bengaluru, KA", "Mumbai, MH", "Hyderabad, TS", "Pune, MH",
            "Chennai, TN", "New Delhi, DL", "Kolkata, WB", "Ahmedabad, GJ"
    );

    /** Fixed reference "today" so the demo reads consistently: 27 Aug 2026. */
    private static final LocalDateTime TODAY = LocalDateTime.of(2026, 8, 27, 0, 0);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a", Locale.ENGLISH);

    public static int hashStr(String s) {
        int h = 0;
        for (int i = 0; i < s.length(); i++) {
            h = (h << 5) - h + s.charAt(i);
        }
        return Math.abs(h);
    }

    private static <T> T seededPick(List<T> arr, long seed, long salt) {
        long idx = Math.floorMod(seed + salt * 31, arr.size());
        return arr.get((int) idx);
    }

    private static String seededId(long seed, long salt, int len) {
        long n = seed + salt * 7919L + 104729L;
        StringBuilder out = new StringBuilder();
        int base = ID_CHARS.length();
        for (int i = 0; i < len; i++) {
            int idx = (int) Math.floorMod(n, base);
            out.append(ID_CHARS.charAt(idx));
            n = Math.floorDiv(n, base) + (Math.floorMod(n, 97) + 13) * (i + 3);
        }
        return out.toString();
    }

    private static String formatDate(int daysAgo, int hour, int minute) {
        LocalDateTime d = TODAY.minusDays(daysAgo).withHour(hour).withMinute(minute).withSecond(0);
        return d.format(DATE_FMT);
    }

    public DisputeContext contextFor(String disputeId) {
        long seed = hashStr(disputeId);
        long ipA = 100 + (seed % 50);
        long ipB = (seed * 3) % 255;
        long ipC = (seed * 7) % 255;
        long ipD = (seed * 11) % 255;

        return new DisputeContext(
                "pay_" + seededId(seed, 1, 9),
                "order_" + seededId(seed, 2, 9),
                seededId(seed, 3, 12).toUpperCase(Locale.ROOT),
                seededPick(COURIERS, seed, 4),
                seededPick(PRODUCTS, seed, 5),
                seededPick(CITIES, seed, 6),
                "dev_" + seededId(seed, 7, 10),
                ipA + "." + ipB + "." + ipC + "." + ipD,
                formatDate(7, 10, 14),
                formatDate(7, 10, 15),
                formatDate(6, 9, 30),
                formatDate(4, 16, 42),
                formatDate(2, 11, 5)
        );
    }

    public static String formatINR(long amount) {
        java.text.NumberFormat fmt = java.text.NumberFormat.getIntegerInstance(new Locale("en", "IN"));
        return "\u20B9" + fmt.format(amount);
    }
}
