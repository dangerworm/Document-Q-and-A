import psycopg2


class MetadataStore:
    def __init__(self):
        self.conn = psycopg2.connect(
            host="localhost",
            database="postgres",
            user="postgres",
            password="postgres",
            port="5433"
        )
        self.conn.autocommit = True
        self.cursor = self.conn.cursor()

    def write(self, fileHash: str, path: str, tags: str, data: dict):
        insert_source = "INSERT INTO public.sources(sourceHash, sourcePath, tags) "
        insert_source += "VALUES (%s, %s, %s) RETURNING id;"
        self.cursor.execute(insert_source, (fileHash, path, tags))
        sourceId = self.cursor.fetchone()[0]

        insert_chunk = "INSERT INTO public.chunks(sourceId, chunk, score) "
        insert_chunk += "VALUES (%s, %s, %s);"
        for item in data:
            self.cursor.execute(insert_chunk, (sourceId, item['chunk'], item['score']))

        self.conn.commit()

        return {"status": "Metadata saved"}
