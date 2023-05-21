# Document Q&A

### Aire Logic's AI chatbot which can answer questions on company documents

#### Current document sets supported
* Company policy
* Tender docs

### Run locally with Docker Compose
1. `./run.sh`
2. View the backend Swagger API on port `8000`, endpoint `/docs`
3. Before running a query onthe frontend do a GET request on `8000/load` to instantiate the database
3. View the frontend UI on port `3000`
