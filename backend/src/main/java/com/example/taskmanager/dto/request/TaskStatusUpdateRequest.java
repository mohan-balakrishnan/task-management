package com.example.taskmanager.dto.request;

import com.example.taskmanager.enums.Status;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private Status status;
}