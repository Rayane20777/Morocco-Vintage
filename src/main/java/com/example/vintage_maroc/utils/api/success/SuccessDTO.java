package com.example.vintage_maroc.utils.api.success;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.example.vintage_maroc.utils.api.ApiResponse;

import java.io.Serializable;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SuccessDTO<RES>(
        ApiResponse apiResponse,
        boolean success,
        String message,
        RES data
) implements Serializable {

    public SuccessDTO(int httpStatus, String message, RES data) {
        this(new ApiResponse(httpStatus), true, message, data);
    }
}

