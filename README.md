# Phonebook

This repository is embeded as a submodule of [github.com/bapturp/fullstackopen](https://github.com/bapturp/fullstackopen.git) within `part3/phonebook`.

## Developement

Build the container

```sh
docker-buildx build -t bapturp/phonebook:$(git log --pretty=format:'%h' -n 1) .
```

Run the container

```sh
docker run -p 8080:8080 bapturp/phonebook:4ca4d0c
```
