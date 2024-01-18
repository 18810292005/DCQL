#!/usr/bin/env bash

git pull

pip install -r ./requirements.txt

export PYTHONPATH=.
sphinx-build /opt/www/sites/mgedata/docs /opt/www/_docs

python manage.py makemigrations
python manage.py migrate

python manage.py collectstatic

python manage.py compilemessages

touch manage.py

#while true; do
#    read -p "compress js/css files?(y/n)" yn
#    case $yn in
#        [Yy]* )
#            echo "compressing js files..."
#            java -jar /opt/extra/tools/closure-compiler.jar static/js/storage/storage.js > /opt/www/_static/mgedata/js/storage/storage.js
#            java -jar /opt/extra/tools/closure-compiler.jar static/js/storage/template.js > /opt/www/_static/mgedata/js/storage/template.js
#            java -jar /opt/extra/tools/closure-compiler.jar static/js/storage/add_data.js > /opt/www/_static/mgedata/js/storage/add_data.js
#            echo "compressing css fiels..."
#            java -jar /opt/extra/tools/closure-stylesheets.jar static/css/storage/data.css > /opt/www/_static/mgedata/css/storage/data.css
#            java -jar /opt/extra/tools/closure-stylesheets.jar static/css/main.css > /opt/www/_static/mgedata/css/main.css
#            break;;
#        [Nn]* ) exit;;
#        * ) echo "Please answer yes or no.";;
#    esac
#done
