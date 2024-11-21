#!/bin/bash
# 用法 ./restore.sh -f 参数1 -a 参数2 -d 需要重建的数据库 -U 数据库用户名 -h 数据库host -p 数据库端口
# 简单用法除前三个参数外可以省略 默认用户名micl 默认ip localhost:5342
# 例如 ./restore.sh -f ~/02300004-1c48-4336-95a3-aeacd99fb700.tar.gz -a ~/apps -d mgedata -U cfy_dev
# 参数位置不能改变
# 参数1：从线上服务器nmdms.ustb.edu.cn/admin下载的postgresql备份文件（.tar.gz）格式
# 参数2：从线上服务器nmdms.ustb.edu.cn/admin下载的migrations备份文件（.zip）格式，用于调用auto-sync-migrations同步迁移文件

OPT_SRT=":f:d:U:h:p"
while getopts $OPT_SRT opt; do
  case $opt in
  f)
    TAR_FILE=$OPTARG
    ;;
  d)
    DATABASE=$OPTARG
    ;;
  U)
    DATABASE_USER=$OPTARG
    ;;
  h)
    HOST=$OPTARG
    ;;
  p)
    PORT=$OPTARG
    ;;
  ?)
    echo "there is unrecognized parameter."
    break
    ;;
  esac
done

if [ ! -f "$TAR_FILE" ]; then
  echo 文件不存在或为空
  exit 1
fi
echo "postgre.tar.gz path is $TAR_FILE"
if [ ! "$DATABASE" ]; then
  DATABASE="mgedata"
fi
echo "database is $DATABASE"
if [ ! "$DATABASE_USER" ]; then
  DATABASE_USER="micl"
fi
echo "access user is $DATABASE_USER"
if [ ! "$HOST" ]; then
  HOST="localhost"
fi
echo "database host $HOST"
if [ ! "$PORT" ]; then
  PORT="5432"
fi
echo "database port $PORT"

if [ -d "restore" ]; then
  echo 清理旧restore目录
  rm -r restore
fi
echo 创建临时解压目录restore
mkdir restore
tar -zxf "$TAR_FILE" -C ./restore
echo 解压压缩包完毕
cd restore/tmp/*/pg-dump || exit
echo "$PWD"
cd ..
echo "开始重建数据库(*0 0 *)"
psql -d postgres -h "$HOST" -p "$PORT" -U "$DATABASE_USER" <<EOF
drop database $DATABASE;
create database $DATABASE owner $DATABASE_USER;
GRANT ALL PRIVILEGES ON DATABASE $DATABASE to $DATABASE_USER;
EOF
echo 重建数据库完毕
echo 开始恢复数据
pg_restore -j 8 -U "$DATABASE_USER" -W -h "$HOST" -p "$PORT" -d "$DATABASE" pg-dump
echo 数据恢复完毕
cd ../../..
rm -r restore
echo 删除临时解压文件
