# Local Artist Database - Full Stack Portfolio
A FastAPI + React + Typescript application that allows users to explore music artists in their area.

## Live Demo

**Frontend**  
https://local-artist-database.vercel.app/

**Backend**  
Base URL:  
https://local-artist-db-production.up.railway.app  
API Docs:  
https://local-artist-db-production.up.railway.app/docs  

## How to use

* At the moment, please only enter a Boston/Cambridge/Somverville zip code if you want to see results.

## Tech Stack

* Backend: FastAPI, SQLAlchemy, PostgreSQL  
* Frontend: React, Typescript, Vite  
* Hosting: Vercel + Railway  

## Features (so far)

* Full-text search (genre, name, zip)
* Linked artist detail pages
* Pagination
* Input validation with Pydantic
* SQL indexes for performance
* Rate limiting with SlowAPI
* Monitoring endpoint (/stats)
* Centralized logs

  ## Endpoints

  * GET /artists - paginated search + filters
  * GET /artists/{id} - Detail page
  * GET /stats - Montitoring info
