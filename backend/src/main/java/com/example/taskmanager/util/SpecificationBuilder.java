package com.example.taskmanager.util;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Path;

public class SpecificationBuilder {

    public static <T> Specification<T> eq(String field, Object value) {
        if (value == null) return null;
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(getPath(root, field), value);
    }

    @SuppressWarnings("unchecked")
    private static <T> Path<T> getPath(Path<?> root, String field) {
        Path<?> current = root;
        if (field.contains(".")) {
            String[] parts = field.split("\\.");
            for (String part : parts) {
                current = current.get(part);
            }
        } else {
            current = current.get(field);
        }
        return (Path<T>) current;
    }
}