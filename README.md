# @engine/api

## Overview

This API is build on top of Node.js, aiming to be to be highly scalable and reliable.

## Prerequisites

- Yarn package manager
- Docker

## Getting Started

### Local Setup

1. Clone the repository and navigate to the project directory.

   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. Install the required dependencies.

   ```bash
   yarn bootstrap
   ```

3. To start the development server:

   ```bash
   docker-compose up
   ```

---

## Available Scripts

- `yarn tsc`: Run TypeScript compiler
- `yarn test`: Run Jest tests in silent mode
- `yarn test:ci`: Run tests specifically configured for CI/CD environments
- `yarn test:debug`: Run Jest tests with debugging enabled
- `yarn test:coverage`: Generate test coverage report
- `yarn dev`: Start development server
- `yarn build`: Compile TypeScript code into JavaScript
- `yarn update:shared-deps`: Update shared dependencies
- `yarn lint`: Lint the codebase using ESLint
- `yarn format`: Format code with Prettier
- `yarn check-formatting`: Check for code formatting issues
- `yarn bootstrap`: Initialize the project (pull latest, install dependencies, configure environment)
- `yarn env:switch:[env]`: Switch between different environments (`dev`, `prod`, `prod:test`)
- `yarn configure`: Run configuration script
- `yarn db:*`: Database related scripts (`export`, `import`, `download`)

---

## Features

Given the dependencies listed in the `package.json`, the API is expected to have a rich set of features aimed at functionality, security, and performance. Here's a breakdown:

## Core Functionalities

### Web Server and Routing (Express)

With Express as a dependency, the API will serve as a robust web server that can handle HTTP requests and responses. It is the framework that enables the API to define RESTful routes, middleware, and handlers for the incoming requests.

### Data Modeling and Database Integration (Mongoose)

Mongoose serves as the Object Data Modeling (ODM) library for MongoDB, making it easier to define schemas, perform validations, and handle database operations. This suggests that the API will be able to execute complex queries, aggregations, and transactions with MongoDB as the datastore.

### Caching (Redis)

The API employs Redis for caching purposes, which means that frequently accessed data can be stored in-memory to speed up retrieval times. This would result in lower latency and reduce the load on the primary datastore. Redis could also be used for session management, queuing systems, and real-time analytics.

### Transactional Emails

The API has integrated capabilities to send transactional emails for a variety of use-cases like user registration, password resets, and notifications. Transactional emails are essential for enhancing user engagement and providing timely updates.

### Push Notifications

Push notifications are integrated into the API to allow real-time updates to be sent to client devices. This could be used for notifying users about new features, updates, or other important events directly to their devices, improving user engagement and retention.

### OAuth Authentication

OAuth is implemented to allow secure sign-in via third-party services like Google, Facebook, or Twitter. It simplifies the login process for users while ensuring that the API does not handle or store passwords for these third-party services, increasing both security and usability.

## Advanced Features

### WebSocket Support (Socket.io)

The API incorporates real-time capabilities through Socket.io, which allows for bi-directional communication between the server and client. This feature enables real-time updates, collaborative features, and much more, thus elevating the interactivity of your application.

### Analytics (Amplitude, Sentry, Mixpanel, New Relic)

#### Amplitude

Amplitude is integrated for product analytics, helping to track user interactions and funnel performance, thereby enabling data-driven decisions.

#### Sentry

Sentry is used for real-time error tracking, giving you the insight into production deployments and allowing for immediate resolution of issues affecting the end-users.

#### Mixpanel

Mixpanel is another analytics service that is employed for tracking user engagement and behavior, focusing on event tracking to help optimize user conversion and retention.

#### New Relic

New Relic is used for application performance monitoring, giving real-time insight into the API's operational health, thereby aiding in performance tuning and troubleshooting.

### Scalability

#### PM2

PM2 is employed as a process manager for Node.js applications, allowing for features like load balancing, auto-restarts, and zero-downtime deployments, thus increasing the API's scalability and reliability.

#### Docker Swarm

The API uses Docker Swarm for orchestration, enabling it to be scaled across multiple machines effortlessly. This provides high availability and ensures that the system can handle increased loads without manual intervention.
