package com.example.taskmanager.dto.response;

import lombok.Builder;
import lombok.Getter;
import java.time.OffsetDateTime;

@Getter
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String color;
    private OffsetDateTime createdAt;
    private long taskCount;
}