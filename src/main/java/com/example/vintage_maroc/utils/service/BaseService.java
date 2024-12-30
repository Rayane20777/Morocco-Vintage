package com.example.vintage_maroc.utils.service;

import com.example.vintage_maroc.utils.mapper.IGenericMapper;
import com.example.vintage_maroc.utils.repository.IGenericRepository;

public interface BaseService<T, ID, REQ, RES> {

    IGenericRepository<T, ID> getRepository();

    IGenericMapper<T, REQ, RES> getMapper();
}

