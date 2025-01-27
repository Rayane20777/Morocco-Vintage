package com.example.vintage_maroc.utils.repository;

public interface SoftDeletable {
    void setDeleted(boolean deleted);
    boolean isDeleted();
} 