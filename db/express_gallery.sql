DROP USER IF EXISTS gallery_user;
DROP DATABASE IF EXISTS gallery_database;

CREATE USER  gallery_user WITH PASSWORD 'password';
CREATE DATABASE gallery_database WITH OWNER  gallery_user;

\c gallery_database gallery_user