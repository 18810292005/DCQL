FROM python:3.8
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list
RUN apt-get update && apt-get install dos2unix
#RUN apt-get update && apt-get install -y vim chrome
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple && pip install -U setuptools wheel pip
RUN pip install poetry
RUN mkdir /mgedata

COPY pyproject.toml /mgedata/
WORKDIR /mgedata
RUN poetry update --lock -vvv
RUN poetry install --no-interaction --no-ansi
COPY . /mgedata
RUN poetry run python docker_prepare.py
RUN dos2unix entrypoint.sh
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]


