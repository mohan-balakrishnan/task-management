package com.example.taskmanager.util;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import java.time.OffsetDateTime;
import java.util.Arrays;

public class SpecificationBuilder {

    public static <T> Specification<T> eq(String field, Object value) {
        if (value == null) return null;
        return (root, query, criteriaBuilder) -> 
            criteriaBuilder.equal(getPath(root, field), value);
    }

    public static <T, E extends Enum<E>> Specification<T> eqEnum(String field, Class<E> enumClass, String value) {
        if (value == null || value.isBlank()) return null;
        try {
            E enumValue = Enum.valueOf(enumClass, value.toUpperCase());
            return (root, query, criteriaBuilder) -> 
                criteriaBuilder.equal(getPath(root, field), enumValue);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public static <T> Specification<T> likeAny(String value, String... fields) {
        if (value == null || value.isBlank() || fields.length == 0) return null;

        String pattern = "%" + value.toLowerCase() + "%";
        return (root, query, criteriaBuilder) -> {
            Predicate[] predicates = Arrays.stream(fields)
                .map(field -> criteriaBuilder.like(
                    criteriaBuilder.lower(getPath(root, field)), 
                    pattern
                ))
                .toArray(Predicate[]::new);
            return criteriaBuilder.or(predicates);
        };
    }

    public static <T> Specification<T> between(String field, OffsetDateTime from, OffsetDateTime to) {
        if (from == null && to == null) return null;

        return (root, query, criteriaBuilder) -> {
            Path<OffsetDateTime> path = getPath(root, field);
            if (from != null && to != null) {
                return criteriaBuilder.between(path, from, to);
            } else if (from != null) {
                return criteriaBuilder.greaterThanOrEqualTo(path, from);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(path, to);
            }
        };
    }

    @SuppressWarnings("unchecked")
    private static <T> Path<T> getPath(Path<?> root, String field) {
        Path<?> current = root;
        String[] parts = field.contains(".") ? field.split("[.]") : new String[]{field};
        for (String part : parts) {
            current = current.get(part);
        }
        return (Path<T>) current;
    }
}