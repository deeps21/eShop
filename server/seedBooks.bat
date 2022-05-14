@echo off
echo Seeding products..
mongoimport --db productStore --collection products --file products.json
:finish
pause
