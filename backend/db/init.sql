CREATE TABLE IF NOT EXISTS ping (
    pong VARCHAR(255)
);


DELETE FROM ping WHERE TRUE;
INSERT INTO ping VALUES ("Yes, DB is connected, and is Working!");