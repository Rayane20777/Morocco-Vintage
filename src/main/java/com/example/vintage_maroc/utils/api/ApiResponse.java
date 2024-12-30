package com.example.vintage_maroc.utils.api;

import java.io.Serializable;
import java.time.LocalDateTime;

public record ApiResponse(
        int httpStatus,
        LocalDateTime timestamp
) implements Serializable {

    public ApiResponse(int httpStatus) {
        this(httpStatus, LocalDateTime.now());
    }
}

