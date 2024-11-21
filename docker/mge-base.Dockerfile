FROM python:3.10
RUN pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/ && pip install -U setuptools wheel pip
RUN pip install poetry ipython
RUN mkdir -p /mgedata/
COPY pyproject.toml /mgedata/
WORKDIR /mgedata
RUN poetry install --no-interaction --no-ansi
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list.d/debian.sources
RUN apt-get update && apt-get install dos2unix
RUN apt-get install -y vim tmux zsh wget
RUN wget https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh
RUN chmod +x install.sh
# replace "REPO:-ohmyzsh/ohmyzsh" with "REPO:-mirrors/oh-my-zsh"
RUN sed -i s/REPO:-ohmyzsh\\/ohmyzsh/REPO:-mirrors\\/oh-my-zsh/g install.sh
# replace "github.com" with "gitee.com"
RUN sed -i s/github.com/gitee.com/g install.sh
#RUN apt-get update && apt-get install -y vim chrome
RUN sh install.sh
COPY . /mgedata
RUN cp docker/local_settings.py mgedata/local_settings.py

