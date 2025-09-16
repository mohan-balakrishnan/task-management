package com.example.taskmanager.dto.response;

import com.example.taskmanager.enums.Priority;
import com.example.taskmanager.enums.Status;
import lombok.Builder;
import lombok.Getter;
import java.time.OffsetDateTime;

@Getter
@Builder
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Priority priority;
    private Status status;
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private OffsetDateTime dueDate;
    private OffsetDateTime reminderDate;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private OffsetDateTime completedAt;
    private String createdByName;
    private String updatedByName;
}