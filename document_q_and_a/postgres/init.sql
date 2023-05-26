CREATE TABLE public.sources (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sourceHash TEXT NOT NULL,
    sourcePath TEXT NOT NULL,
);

CREATE TABLE public.chunks (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sourceId INT NOT NULL REFERENCES public.sources(id)
    chunk TEXT NOT NULL,
    tags TEXT NOT NULL,
    score INTEGER NOT NULL
);