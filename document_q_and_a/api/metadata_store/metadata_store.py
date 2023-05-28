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

    def write(self, fileHash: str, path: str, tags: list[str], data: dict):
        insert_source = "INSERT INTO public.sources(sourceHash, sourcePath, tags) "
        insert_source += f"VALUES ({fileHash}, {path}, {';'.join(tags)})"
        sourceId = self.cursor.execute(f"{insert_source};")

        insert_chunk_prefix = f"INSERT INTO public.chunks(sourceId, chunk, score) "
        for item in data.items():
            self.cursor.execute(
                f"{insert_chunk_prefix} VALUES ({sourceId}, {item['chunk']}, {item['score']});")

        self.conn.commit()

        return {"status": "Metadata saved"}
