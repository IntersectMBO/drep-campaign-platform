# 🚀 Voltaire DRep Campaign Platform 🚀

The DRep Campaign platform was funded by Intersect MBO and originally developed by the Lido Nation team.
The platform is a web3/web2 system that allows DReps to create a profile to facilitate their campaigns,
communicate with prospective and current delegators, and showcase their onchain and off chain activities.

## Table of content:

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Running locally](#running-locally)
- [Running using docker compose](#running-using-docker-compose)

## Introduction

This document serves as a comprehensive guide for setting up the full stack of our application, which includes the backend, frontend, and database components.

## Prerequisites

- Docker installed - [Download link](https://docs.docker.com/engine/install/).


## Tech stack:

**Server:** [Node](https://nodejs.org/en/about/), [Nest.js](https://nestjs.com/)

**Database:** [PostgreSQL](https://www.postgresql.org/)

**Frontend:** [Next.js](https://nextjs.org/)

**Container:** [Docker](https://docs.docker.com/get-started/)

### API Backend

The api backend is powered by nest.js, A progressive Node.js framework for building efficient, reliable and scalable server-side applications.

### Database

For data persistence, we utilize PostgreSQL, known for its robustness, scalability, and reliability. This choice ensures that our application's data layer is secure, efficient, and capable of handling growth.

### Frontend
The frontend is developed with Next.js, a React framework that allows for server-side rendering and static site generation. This choice enables us to create fast, SEO-friendly web pages that integrate seamlessly with our Strapi backend.

The instructions that follow will guide you through setting up each component of our application stack, ensuring a cohesive development and deployment process.

## Getting started

Before you begin setting up the application, you'll need to clone the repository from GitHub to get a local copy of the code. Follow these steps to clone the repository and start setting up the application components:

1. **Clone the Repository:**

    - Open a terminal on your computer.
    - Navigate to the directory where you want to store the project.
    - Run the following command to clone the repository:
      ```
      git clone https://github.com/IntersectMBO/drep-campaign-platform.git
      ```

2. **Navigate to the Project Directory:**
    - After cloning, change into the project's root directory:
      ```
      cd drep-campaign-platform
      ```
      This directory contains all the files you need to set up the application, including the Docker Compose files and the separate directories for the backend and frontend components.

By cloning the repository, you ensure that you have the latest version of the code and all the necessary files to get started with the application setup.

## Running locally

The app, all of it's dependencies including dev server with hot module reloading all run in docker environments. The only dependency you need on your machine is the docker engine.
ollow these steps:

### Backend setup

1. From the root, run `make backend-install`

### Database configuration

1. **Nothing to do** as both postgres instances, one for the app and one for dbsync is already configure in the docker-compose file.

### Frontend setup

1.  From the root, run `make frontend-install`


### Running the application
**The Next.js server, nest.js backend, cardano node, and postgres databases** are automatically started when you run `make up.`
This shortcut runs `docker-compose up -d`. To view the Next.js server during development you can follow the logs from the **frontend** container
or run `make logs`.


### Accessing the application:**
- With all services running, your application components should be accessible at the following URLs:
    - **Backend:** `http://localhost:8080` – This is  will mostly be called by Next.js server side code, not much to see as it is just an api.
    - **Frontend:** `http://localhost:4000` – Your Next.js frontend application will be available here, ready to serve your site's visitors.
    - **Database:** While the database itself won't be directly accessible via a simple URL (since it's meant to be accessed by your backend service), it's running on a mapped port `5434` on your host machine. This setup is specified in your `docker-compose.yaml` file, allowing secure and straightforward connections from your backend service.

### Overview of services in docker compose:

- **Backend service:** Configured to run Nest.js on port `8080`, this service automatically connects to the PostgreSQL database, ensuring the api has all the data it needs to operate.

- **Database service:** This service runs PostgreSQL and is set to be accessible on port `5434` from the host machine. It's crucial for storing all your application's data securely and efficiently.

- **Frontend service:** Your Next.js application will be served on port `4000`, connecting to the Strapi backend to fetch content and data. This setup provides a seamless experience for developers and users alike.