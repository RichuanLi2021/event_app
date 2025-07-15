## Mongoose
commands to start mongodb server:
```
mongosh "mongodb://127.0.0.1:27017/event-booking"
```

## .env
Create a .env file and paste everything inside .env.sample.

## Key generation
```bash -- For HMAC (HS256): the one this project is using.
$ openssl rand -hex 32
```

```bash -- For RSA key pairs: Future improvement.
$ openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out rs256.key.pem

$ openssl rsa -in rs256.key.pem -pubout -out rs256.pub.pem
```
!!! DO NOT COMMIT YOUR PRIVATE KEY TO THE REPO, STORE IT SAFELY.

