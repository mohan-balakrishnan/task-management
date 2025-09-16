package com.example.taskmanager.service;

import com.example.taskmanager.dto.request.TaskCreateRequest;
import com.example.taskmanager.dto.request.TaskStatusUpdateRequest;
import com.example.taskmanager.dto.request.TaskUpdateRequest;
import com.example.taskmanager.dto.response.DashboardResponse;
import com.example.taskmanager.dto.response.TaskResponse;
import com.example.taskmanager.entity.Category;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.User;
import com.example.taskmanager.enums.Priority;
import com.example.taskmanager.enums.Status;
import com.example.taskmanager.exception.NotFoundException;
import com.example.taskmanager.repository.CategoryRepository;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;
import com.example.taskmanager.util.SpecificationBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TaskService(TaskRepository taskRepository,
                      UserRepository userRepository,
                      CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasks(Long currentUserId, 
                                     String status, 
                                     String priority, 
                                     Long categoryId, 
                                     String search,
                                     OffsetDateTime dueFrom,
                                     OffsetDateTime dueTo,
                                     Pageable pageable,
                                     boolean isAdmin) {

        Specification<Task> spec = Specification.where(null);

        // Filter by user if not admin
        if (!isAdmin) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("user").get("id"), currentUserId));
        }

        // Add filters
        spec = spec.and(SpecificationBuilder.eqEnum("status", Status.class, status))
                  .and(SpecificationBuilder.eqEnum("priority", Priority.class, priority))
                  .and(SpecificationBuilder.eq("category.id", categoryId))
                  .and(SpecificationBuilder.likeAny(search, "title", "description"))
                  .and(SpecificationBuilder.between("dueDate", dueFrom, dueTo));

        return taskRepository.findAll(spec, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(Long id, Long currentUserId, boolean isAdmin) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        if (!isAdmin && !task.getUser().getId().equals(currentUserId)) {
            throw new NotFoundException("Task not found");
        }

        return toResponse(task);
    }

    public TaskResponse createTask(Long currentUserId, TaskCreateRequest request) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Task task = new Task();
        task.setUser(user);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setReminderDate(request.getReminderDate());
        task.setCreatedBy(user);
        task.setUpdatedBy(user);

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found"));
            task.setCategory(category);
        }

        task = taskRepository.save(task);
        return toResponse(task);
    }

    public TaskResponse updateTask(Long id, Long currentUserId, TaskUpdateRequest request, boolean isAdmin) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        if (!isAdmin && !task.getUser().getId().equals(currentUserId)) {
            throw new NotFoundException("Task not found");
        }

        User updater = userRepository.findById(currentUserId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
            if (request.getStatus() == Status.COMPLETED && task.getCompletedAt() == null) {
                task.setCompletedAt(OffsetDateTime.now());
            } else if (request.getStatus() != Status.COMPLETED) {
                task.setCompletedAt(null);
            }
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }
        if (request.getReminderDate() != null) {
            task.setReminderDate(request.getReminderDate());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new NotFoundException("Category not found"));
            task.setCategory(category);
        }

        task.setUpdatedBy(updater);
        task = taskRepository.save(task);

        return toResponse(task);
    }

    public TaskResponse updateTaskStatus(Long id, Long currentUserId, TaskStatusUpdateRequest request, boolean isAdmin) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        if (!isAdmin && !task.getUser().getId().equals(currentUserId)) {
            throw new NotFoundException("Task not found");
        }

        User updater = userRepository.findById(currentUserId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        task.setStatus(request.getStatus());
        if (request.getStatus() == Status.COMPLETED && task.getCompletedAt() == null) {
            task.setCompletedAt(OffsetDateTime.now());
        } else if (request.getStatus() != Status.COMPLETED) {
            task.setCompletedAt(null);
        }

        task.setUpdatedBy(updater);
        task = taskRepository.save(task);

        return toResponse(task);
    }

    public void deleteTask(Long id, Long currentUserId, boolean isAdmin) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Task not found"));

        if (!isAdmin && !task.getUser().getId().equals(currentUserId)) {
            throw new NotFoundException("Task not found");
        }

        taskRepository.delete(task);
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardStats(Long currentUserId, boolean isAdmin) {
        long totalTasks;
        long pendingTasks;
        long inProgressTasks;
        long completedTasks;
        long overdueTasks;

        OffsetDateTime now = OffsetDateTime.now();

        if (isAdmin) {
            totalTasks = taskRepository.countAllTasks();
            pendingTasks = taskRepository.countByStatus(Status.PENDING);
            inProgressTasks = taskRepository.countByStatus(Status.IN_PROGRESS);
            completedTasks = taskRepository.countByStatus(Status.COMPLETED);
            overdueTasks = taskRepository.countAllOverdue(now);
        } else {
            totalTasks = taskRepository.countByUserId(currentUserId);
            pendingTasks = taskRepository.countByUserIdAndStatus(currentUserId, Status.PENDING);
            inProgressTasks = taskRepository.countByUserIdAndStatus(currentUserId, Status.IN_PROGRESS);
            completedTasks = taskRepository.countByUserIdAndStatus(currentUserId, Status.COMPLETED);
            overdueTasks = taskRepository.countOverdueByUserId(currentUserId, now);
        }

        double completionRate = totalTasks > 0 ? (double) completedTasks / totalTasks * 100 : 0.0;

        return DashboardResponse.builder()
                .totalTasks(totalTasks)
                .pendingTasks(pendingTasks)
                .inProgressTasks(inProgressTasks)
                .completedTasks(completedTasks)
                .overdueTasks(overdueTasks)
                .completionRate(Math.round(completionRate * 100.0) / 100.0)
                .build();
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .categoryId(task.getCategory() != null ? task.getCategory().getId() : null)
                .categoryName(task.getCategory() != null ? task.getCategory().getName() : null)
                .categoryColor(task.getCategory() != null ? task.getCategory().getColor() : null)
                .dueDate(task.getDueDate())
                .reminderDate(task.getReminderDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .completedAt(task.getCompletedAt())
                .createdByName(task.getCreatedBy().getFirstName() + " " + task.getCreatedBy().getLastName())
                .updatedByName(task.getUpdatedBy().getFirstName() + " " + task.getUpdatedBy().getLastName())
                .build();
    }
}