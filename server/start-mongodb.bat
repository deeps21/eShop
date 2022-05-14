@echo off
echo Starting MongoDB...
mkdir ElectronicShop
mongod --dbpath=ElectronicShop
:finish
pause