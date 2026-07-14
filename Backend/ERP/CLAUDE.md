# Alamia Print ERP System

# Backend Development Guide

---

# Project Overview

Alamia Print ERP System is an internal ERP application for managing a printing company.

The backend is built using Java Spring Boot following Clean Architecture principles.

The goal of the backend is to provide a scalable, maintainable and production-ready REST API.

This project is developed incrementally.

Every new feature must integrate naturally with the existing architecture.

---

# Tech Stack

Java 21

Spring Boot 3

Spring Data JPA

Hibernate

MapStruct

Lombok

Jakarta Validation

PostgreSQL

Maven

---

# Architecture

The project follows a layered architecture.

Controller

↓

Service Interface

↓

Service Implementation

↓

Repository

↓

Database

DTOs are used between Controller and Service.

Entities never leave the Service layer.

---

# Package Structure

controller/

service/

service/interfaces/

service/impl/

repository/

dto/

mapper/

model/

exception/

config/

security/

---

# Layer Responsibilities

## Controller

Responsibilities

Receive requests.

Validate input.

Call services.

Return ResponseEntity.

Controllers must never contain business logic.

---

## Service

Responsibilities

Business logic.

Validation.

Entity manipulation.

Calling repositories.

Mapping DTOs.

Services should never access HTTP objects.

---

## Repository

Responsibilities

Database access only.

No business logic.

---

## Entity

Represents database tables.

Entities are not returned directly to clients.

Always use DTOs.

---

## DTO

Used for communication with the frontend.

Never expose Entity objects.

---

## Mapper

MapStruct is the only mapping solution.

Never manually map entities.

---

# Coding Rules

Use constructor injection.

Never use field injection.

Never use @Autowired on fields.

Keep methods small.

Keep classes focused.

Follow SOLID.

Avoid duplicated code.

---

# Naming

Entity

Company

Product

ProductionOrder

Material

Supplier

DTOs

CompanyRequest

CompanyResponse

Services

CompanyService

CompanyServiceImpl

Repositories

CompanyRepository

Controllers

CompanyController

---

# API Rules

RESTful endpoints.

Examples

GET

/api/companies

GET

/api/companies/{id}

POST

/api/companies

PUT

/api/companies/{id}

DELETE

/api/companies/{id}

Use ResponseEntity.

Return correct HTTP status codes.

---

# Validation

Use Jakarta Validation.

Examples

@NotBlank

@NotNull

@Positive

Validation belongs in DTOs whenever possible.

---

# Exceptions

Use GlobalExceptionHandler.

Throw

ResourceNotFoundException

BadRequestException

Never return null.

Never swallow exceptions.

---

# Logging

Use Lombok @Slf4j.

Log important business events.

Avoid unnecessary logging.

---

# Mapping

Always use MapStruct.

Never manually create DTOs.

Never manually create Entities from DTOs.

---

# Database Design

Database normalization is important.

Avoid duplicated data.

Use proper relationships.

---

# Relationship Rules

Use OneToMany only when necessary.

Use ManyToOne where appropriate.

For many-to-many business relationships,

prefer creating a junction entity.

Example

ProductionOrder

↓

ProductionOrderMaterial

↓

Material

instead of a direct ManyToMany.

The junction entity can store:

Quantity

Unit

Notes

Consumption

This design is preferred.

---

# Inventory Philosophy

Inventory is transaction-based.

Never update stock directly.

Every stock change must create an inventory transaction.

Examples

Purchase

Production Consumption

Manual Adjustment

Return

Future modules will calculate stock from transactions.

---

# Production Order Philosophy

Production Orders are NOT CRUD.

They represent a workflow.

Workflow

Pending

↓

Approved

↓

Montage

↓

Printing

↓

Finishing

↓

Completed

↓

Shipped

↓

Delivered

Cancelled

Only valid transitions are allowed.

Never skip workflow steps.

---

# Future Features

Inventory Engine

Reports

PDF Generator

Authentication

Authorization

Audit Logs

Notifications

Analytics

---

# Business Rules

Never invent business rules.

If something is unclear,

leave a TODO.

Do not guess.

---

# Code Generation Rules

Before generating code

Read existing Entities.

Read DTOs.

Read Mappers.

Read Services.

Read Repositories.

Read Controllers.

Reuse existing code.

Never regenerate existing architecture.

Never rename packages.

Never move files.

Only modify what is required.

---

# Before Every Task

Always ask yourself:

Am I following the current architecture?

Am I reusing existing code?

Am I breaking existing APIs?

Am I introducing duplicated logic?

Am I following Spring Boot best practices?

If the answer is No,

stop and rethink before writing code.
