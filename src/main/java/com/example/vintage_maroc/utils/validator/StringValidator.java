package com.example.vintage_maroc.utils.validator;

import java.util.UUID;

public class StringValidator {

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }

    public static String generateRandomUUID() {
        return UUID.randomUUID().toString();
    }
}

