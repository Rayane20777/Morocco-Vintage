package com.example.vintage_maroc.utils.validator;

import com.google.i18n.phonenumbers.NumberParseException;
import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.Phonenumber;

public class PhoneValidator {

    private static final PhoneNumberUtil phoneNumberUtil = PhoneNumberUtil.getInstance();

    public static boolean isValidPhoneNumber(String phoneNumber, String regionCode) {
        try {
            Phonenumber.PhoneNumber number = phoneNumberUtil.parse(phoneNumber, regionCode);
            return phoneNumberUtil.isValidNumber(number);
        } catch (NumberParseException e) {
            return false;
        }
    }

    public static boolean isValidPhoneNumberPrefix(String phoneNumber, String regionCode) {
        try {
            Phonenumber.PhoneNumber number = phoneNumberUtil.parse(phoneNumber, regionCode);
            return phoneNumberUtil.isPossibleNumber(number);
        } catch (NumberParseException e) {
            return false;
        }
    }
}

