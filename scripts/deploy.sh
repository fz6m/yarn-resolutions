
rm -rf deploy
mkdir deploy

cp src/template/deploy.html deploy/index.html
cp -r src/template/css deploy/css
cp src/template/favicon.ico deploy/favicon.ico