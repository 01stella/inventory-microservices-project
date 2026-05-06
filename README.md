# Inventory Microservices Project

A containerized full-stack application featuring a coffee shop inventory system. This project demonstrates the integration of multiple databases within a microservices architecture.

## Technologies Used
* **Frontend:** React + Vite
* **Backend:** FastAPI
* **Databases:** 
  * **PostgreSQL:** Inventory management (SQLAlchemy/Psycopg2)
  * **MongoDB:** API system logging (Pymongo)
* **Infrastructure:** Docker & Docker Compose

## Setup and Execution
1. Ensure Docker Desktop is running.
2. Clone the repository and navigate to the project root.
3. Run the services:
   ```bash
   docker-compose up --build
4. How to access database:
    ```bash
    chmod +x db.sh
    ./db.sh postgres
    ./db.sh mongo