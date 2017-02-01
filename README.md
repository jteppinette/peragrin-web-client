# Peragrin Client *an Angular front end to the Peragrin application*

# Initialize Development Environment

1. Install Node
2. `git clone <repo-url>`
3. `cd <repo-name>`
4. `npm install`
5. `npm run bower -- install`
6. `npm run gulp`
7. `npm start`
8. Open `localhost:8080`

## Docker

1. `docker build . -t peragrin-client`

2. Run the api and db servers defined in `github.com/jteppinette/peragrin-api`

3. `docker run -it -p 8080:8080 -l peragrin-api:upstream \
      --rm --name peragrin-client peragrin-client`
