package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Short> {
    Optional<Role> findByRoleName(String roleName);
}