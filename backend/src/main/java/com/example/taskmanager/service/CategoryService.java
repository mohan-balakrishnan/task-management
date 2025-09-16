package com.example.taskmanager.service;

import com.example.taskmanager.dto.request.CategoryRequest;
import com.example.taskmanager.dto.response.CategoryResponse;
import com.example.taskmanager.entity.Category;
import com.example.taskmanager.exception.ApiException;
import com.example.taskmanager.exception.NotFoundException;
import com.example.taskmanager.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new ApiException("Category with name '" + request.getName() + "' already exists");
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setColor(request.getColor() != null ? request.getColor() : "#3498db");

        category = categoryRepository.save(category);
        return toResponse(category);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));

        if (request.getName() != null && !request.getName().equals(category.getName())) {
            if (categoryRepository.existsByName(request.getName())) {
                throw new ApiException("Category with name '" + request.getName() + "' already exists");
            }
            category.setName(request.getName());
        }

        if (request.getColor() != null) {
            category.setColor(request.getColor());
        }

        category = categoryRepository.save(category);
        return toResponse(category);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new NotFoundException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .color(category.getColor())
                .createdAt(category.getCreatedAt())
                .build();
    }
}