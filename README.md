# blog-editor-platform

# Blog Editor Platform

**Full Stack Assignment for Internship Hiring**

---

## Overview

This project is a full-stack Blog Editor application that enables users to write, edit, save drafts, and publish blog posts with an auto-save draft feature.

The app includes:

- A rich Blog Editor frontend built with React.js  
- A backend REST API server using Node.js and Express.js  
- JWT token-based authentication for protected API endpoints  
- Auto-save drafts with debounce and user notification  
- Persistent storage with MongoDB  

---

## Features

### Frontend

- Blog Editor page with:  
  - Title input field  
  - Content field (rich text editor)  
  - Tags input (optional, comma-separated)  
- Save as Draft and Publish buttons  
- Auto-save drafts every 30 seconds or after 5 seconds of inactivity (debouncing)  
- Visual notifications for auto-save events  
- List view for all blogs, showing drafts and published posts separately  
- Edit and update existing drafts/posts  

### Backend

- Node.js with Express.js REST API  
- MongoDB database with a Blog schema/model:  
  - `id`  
  - `title`  
  - `content`  
  - `tags`  
  - `status` (draft or published)  
  - `created_at`  
  - `updated_at`  
- API endpoints:  
  - `POST /api/blogs/save-draft` — save or update a draft  
  - `POST /api/blogs/publish` — save and publish an article  
  - `GET /api/blogs` — retrieve all blogs  
  - `GET /api/blogs/:id` — retrieve a blog by ID  
- JWT token authentication protecting API endpoints  

---

## Tech Stack

| Layer    | Technology      |
| -------- | --------------- |
| Frontend | React.js        |
| Backend  | Node.js, Express|
| Database | MongoDB         |
| Auth     | JWT Token       |

---

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone https://github.com/Tushar-1745/blog-editor-platform.git
   cd blog-editor-platform
   
Backend Setup:
cd backend
npm install
node server.js

Frontend setup:
cd frontend
npm install
npm start
