package com.example.taskmanager.controller;

import com.example.taskmanager.dto.request.TaskCreateRequest;
import com.example.taskmanager.dto.request.TaskStatusUpdateRequest;
import com.example.taskmanager.dto.request.TaskUpdateRequest;
import com.example.taskmanager.dto.response.DashboardResponse;
import com.example.taskmanager.dto.response.PageResponse;
import com.example.taskmanager.dto.response.TaskResponse;
import com.example.taskmanager.service.TaskService;
import com.example.taskmanager.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/tasks")
@Tag(name = "Tasks", description = "Task management endpoints")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get tasks with filtering and pagination")
    public ResponseEntity<PageResponse<TaskResponse>> getTasks(
            @Parameter(description = "Filter by status") @RequestParam(required = false) String status,
            @Parameter(description = "Filter by priority") @RequestParam(required = false) String priority,
            @Parameter(description = "Filter by category ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Search in title and description") @RequestParam(required = false) String search,
            @Parameter(description = "Due date from") @RequestParam(required = false) String dueFrom,
            @Parameter(description = "Due date to") @RequestParam(required = false) String dueTo,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable,
            Authentication authentication) {

        Long currentUserId = getCurrentUserId(authentication);
        boolean isAdmin = isAdmin(authentication);

        OffsetDateTime dueDateFrom = dueFrom != null ? OffsetDateTime.parse(dueFrom) : null;
        OffsetDateTime dueDateTo = dueTo != null ? OffsetDateTime.parse(dueTo) : null;

        Page<TaskResponse> tasks = taskService.getTasks(
            currentUserId, status, priority, categoryId, search, 
            dueDateFrom, dueDateTo, pageable, isAdmin);

        return ResponseEntity.ok(new PageResponse<>(tasks));
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get dashboard statistics")
    public ResponseEntity<DashboardResponse> getDashboard(Authentication authentication) {
        Long currentUserId = getCurrentUserId(authentication);
        boolean isAdmin = isAdmin(authentication);

        DashboardResponse dashboard = taskService.getDashboardStats(currentUserId, isAdmin);
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get task by ID")
    public ResponseEntity<TaskResponse> getTask(@PathVariable Long id, Authentication authentication) {
        Long currentUserId = getCurrentUserId(authentication);
        boolean isAdmin = isAdmin(authentication);

        TaskResponse task = taskService.getTask(id, currentUserId, isAdmin);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    @Operation(summary = "Create a new task")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskCreateRequest request,
                                                  Authentication authentication) {
        Long currentUserId = getCurrentUserId(authentication);
        TaskResponse task = taskService.createTask(currentUserId, request);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update task")
    public ResponseEntity<TaskResponse> updateTask(@PathVariable Long id,
                                                  @RequestBody TaskUpdateRequest request,
                                                  Authentication authentication) {
        Long currentUserId = getCurrentUserId(authentication);
        boolean isAdmin = isAdmin(authentication);

        TaskResponse task = taskService.updateTask(id, currentUserId, request, isAdmin);
        return ResponseEntity.ok(task);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update task status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id,
                                                        @Valid @RequestBody TaskStatusUpdateRequest request,
                                                        Authentication authentication) {
        Long currentUserId = getCurrentUserId(authentication);
        boolean isAdmin = isAdmin(authentication);

        TaskResponse task = taskService.updateTaskStatus(id, currentUserId, request, isAdmin);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        Long currentUserId = getCurrentUserId(authentication);
        boolean isAdmin = isAdmin(authentication);

        taskService.deleteTask(id, currentUserId, isAdmin);
        return ResponseEntity.noContent().build();
    }

    private Long getCurrentUserId(Authentication authentication) {
        String username = authentication.getName();
        return userService.getCurrentUser(username).getId();
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }
}