package com.subham.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.subham.entity.Product;
import com.subham.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping
    public List<Product> getProducts() {
        return service.getAllProducts();
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return service.addProduct(product);
    }
}

