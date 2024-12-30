package com.example.vintage_maroc.utils.helper;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.Base64;
import java.util.HashMap;

import static com.example.vintage_maroc.utils.validator.StringValidator.generateRandomUUID;

public abstract class TokenHelper {

    public String generateToken() {
        byte[] randomBytes = new byte[64];
        new SecureRandom().nextBytes(randomBytes);

        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    public HashMap<String, String> generateTokenWithOtherInformation() {
        HashMap<String, String> tokenInfo = new HashMap<>();

        tokenInfo.put("Token", "Tk-" + generateToken());
        tokenInfo.put("Id", generateRandomUUID());
        tokenInfo.put("Date", LocalDate.now().toString());

        return tokenInfo;
    }
}

