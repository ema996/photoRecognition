CREATE TABLE photos(
    photoName VARCHAR (50) NOT NULL,
    description VARCHAR (255) ,
    photoUrl VARCHAR (1000) NOT NULL,
    photoTag1 VARCHAR (255),
    photoTag2 VARCHAR (255),
    photoStatus SMALLINT DEFAULT 0, 
    createdOn TIMESTAMP NOT NULL DEFAULT NOW(),
    lastLogin TIMESTAMP
   );
   
   ALTER TABLE photos DROP COLUMN lastLogin
   
   ALTER TABLE photos ADD COLUMN lastUpdated TIMESTAMP DEFAULT NOW()

   ALTER TABLE photos
    DROP COLUMN photoTag1

    ALTER TABLE photos
    DROP COLUMN photoTag2

    ALTER TABLE photos
    ADD COLUMN labels text[];