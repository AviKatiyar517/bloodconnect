# 🩸 BloodConnect — Blood Donor Finder App

A full-stack web application to find blood donors in emergencies.

## Tech Stack
- **Backend:** Java Spring Boot, Spring Data JPA, Hibernate
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript
- **Server:** Embedded Apache Tomcat

## Unique Feature
90-day cooldown filter that automatically hides donors who donated
within the last 90 days — enforcing medically safe donation intervals.

## Features
- Search donors by blood group and city
- Register as a donor
- Admin Dashboard with real-time donor management
- Toggle availability and delete donors
- Auto-generated cartoon avatars using DiceBear API

## How to Run
1. Create MySQL database: `CREATE DATABASE blooddonordb;`
2. Update `application.properties` with your MySQL password
3. Run: `mvn spring-boot:run`
4. Open: `http://localhost:8081`
