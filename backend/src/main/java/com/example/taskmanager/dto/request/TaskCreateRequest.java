package com.example.taskmanager.dto.request;

import com.example.taskmanager.enums.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.OffsetDateTime;

@Getter
@Setter
public class TaskCreateRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    private Priority priority = Priority.MEDIUM;
    private Long categoryId;
    private OffsetDateTime dueDate;
    private OffsetDateTime reminderDate;
}