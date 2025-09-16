package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Task;
import com.example.taskmanager.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.OffsetDateTime;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") Status status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.id = :userId AND t.status != 'COMPLETED' AND t.dueDate < :now")
    long countOverdueByUserId(@Param("userId") Long userId, @Param("now") OffsetDateTime now);

    // Admin queries
    @Query("SELECT COUNT(t) FROM Task t")
    long countAllTasks();

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status = :status")
    long countByStatus(@Param("status") Status status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.status != 'COMPLETED' AND t.dueDate < :now")
    long countAllOverdue(@Param("now") OffsetDateTime now);
}