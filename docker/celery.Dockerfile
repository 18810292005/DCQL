FROM mge-base:latest
WORKDIR /mgedata
ENTRYPOINT ["poetry", "run", "celery", "worker", "-A", "mgedata", "-l", "info"]