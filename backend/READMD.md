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

## events and role workflow
(https://lrcc1996.atlassian.net/wiki/pages/resumedraft.action?draftId=9961473&draftShareId=d06d6a42-bc57-4ebd-8081-536a8d63ebfe)

User, Organizer, and Admin

1. An Event starts in status of 'Pending' when it is created by Organizer.

2. Admin will audit all created events to decide either 'Approve' or 'Reject':

PENDING  →  APPROVED  (or)  REJECTED
               │
               ▼
           CANCELLED   (if organiser calls it off later)

3. Only events in 'Approved' can be returned back to public Api.

