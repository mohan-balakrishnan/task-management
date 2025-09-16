package com.example.taskmanager.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardResponse {
    private long totalTasks;
    private long pendingTasks;
    private long inProgressTasks;
    private long completedTasks;
    private long overdueTasks;
    private double completionRate;
}