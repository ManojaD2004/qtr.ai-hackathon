# build
docker compose build

# run
docker compose up

# get postgres cli
docker run -it --rm --network host postgres psql -h localhost -U postgres -d qtr