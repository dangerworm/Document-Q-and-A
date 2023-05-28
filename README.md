# Document Q&A

### Aire Logic's AI chatbot which can answer questions on company documents

#### Current document sets supported
* Company policy
* Tender docs

### Run locally
1. Open a new terminal
1. cd document_q_and_a/api
1. python -m uvicorn main:app --host localhost --port 8000 --reload
1. Open a new terminal
1. cd document_q_and_a/client
1. npm start
1. View the frontend UI on port `3000`

### Run locally with Docker Compose
1. `./run.sh`
1. View the backend Swagger API on port `8000`, endpoint `/docs`
1. Before running a query onthe frontend do a GET request on `8000/load` to instantiate the database
1. View the frontend UI on port `3000`
