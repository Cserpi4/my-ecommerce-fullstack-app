MyStore – Full-Stack E-commerce App

A full-stack e-commerce application built with React, Node.js, Express, PostgreSQL and Stripe.

This project is part of my developer portfolio and focuses on real-world full-stack architecture, secure authentication, and production-style backend patterns including Stripe payments, webhooks, and state-driven order processing.

Features

<<<<<<< HEAD
Features

- User authentication (JWT)
=======
Core:
- JWT-based authentication (access + refresh tokens)
>>>>>>> d341742 (Readme.md)
- Product catalog
- Shopping cart (anonymous + user carts)
- Order creation with immutable order snapshot
- REST API with Express
- PostgreSQL database

Payments:
- Stripe PaymentIntent integration
- Webhook as source of truth for payment status
- Order / payment state machine
- Stripe idempotency keys
- Cart cleanup after successful payment
- Refund flow (provider + service + controller layers)

<<<<<<< HEAD
Tech Stack
=======
Architecture & Security:
- Layered backend structure (Controller / Service / Provider / Model)
- Centralized environment configuration & required env validation
- Webhook signature verification
- Separation of runtime DB user vs migration user (least privilege mindset)
- The project consistently uses an object-based module pattern across both frontend and backend. Instead of class-based OOP, each module exposes a responsibility-focused object, aligning well with a layered architecture and a functional-first approach.
>>>>>>> d341742 (Readme.md)

Tech Stack

Frontend:
- React
- Redux Toolkit 

Backend:
- Node.js
- Express
- Stripe SDK

Database:
- PostgreSQL

Infrastructure:
- Render (back+database)
- Netlify (frontend)

Author
Your Name Dániel Cserpák
Portfolio: https://daniel-cserpak-portfolio.netlify.app/
LinkedIn: https://www.linkedin.com/in/d%C3%A1niel-cserp%C3%A1k-109057283/
