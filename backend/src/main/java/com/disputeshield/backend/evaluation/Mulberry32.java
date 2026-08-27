package com.disputeshield.backend.evaluation;

/**
 * Deterministic PRNG (mulberry32). Given the same seed it always produces the same
 * sequence of doubles in [0, 1) — that's the entire reproducibility story for the
 * synthetic evaluation dataset and the train/test split: no java.util.Random, no
 * wall-clock seed, nothing that could make two runs disagree.
 */
public final class Mulberry32 {

    private int a;

    public Mulberry32(int seed) {
        this.a = seed;
    }

    public double next() {
        a += 0x6D2B79F5;
        int t = (a ^ (a >>> 15)) * (1 | a);
        t = (t + ((t ^ (t >>> 7)) * (61 | t))) ^ t;
        long unsigned = (t ^ (t >>> 14)) & 0xFFFFFFFFL;
        return unsigned / 4294967296.0;
    }

    /** Returns a uniformly random int in [0, bound). */
    public int nextInt(int bound) {
        return (int) Math.floor(next() * bound);
    }
}
