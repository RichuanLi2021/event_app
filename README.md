## Before you go
locate the .env.sample in both frontend and backend
create a .env for both frontend and backend at their root level
copy and paste everything from .env.sample to your .env and save 

## Installation & Start web server
```bash -- install dependencies and setup node version at the same time from project root.
$ ./dev.sh
```
or

```bash -- To setup node version manually by going into each sub folder: 
$ nvm use
$ cd frontend & nvm use & npm install
$ cd ../backend & nvm use & npm install
$ cd .. & npm run dev
```

or start frontend and backend separately

```bash
$ npm run client -- (frontend only)
$ npm run server -- (backend only)
```

## Node environment
Node version: 20.19.2
```bash
$ nvm use
```
Make sure to set your project's node version as required.

### Node.js version

We use node 20+ (20.19.2), set up your local or gloabl node version to 20+ using nvm: 
`https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating`.

### Project Structure

The routing strategy used in this project is react-router Framework mode:
`https://reactrouter.com/start/framework/routing`

frontend
```
├── app/
├── features/
|   ├── components/    # All page related components
|   ├── services/         # All app page
|   ├── theme/         # All const types go here
|   ├── types/         # Global state management
│   └── utils/         # helper functions can be saved here
├── pages/  
├── redux/             # Global state management
|   ├── actions/       # Action creators categorized by feature
|       ├── auth/      
|       ├── other feature action folders/
|   ├── middleware/     
|   ├── reducers/       # All feature reducers go here
|       ├── authReducer/
|   ├── hooks.ts         # 
│   └── store.ts         # 
├── root.tsx           # The entry point of the whole app.
├── rootes.ts          # The route map for all pages, including layout and pages.
```

backend
```
├── app/
├── features/
|   ├── auth/ 
|       ├── controllers/
|       ├── routes/
|       ├── service/
|       ├── middleware/
|   ├── other service foler/     
├── global_middleware/  
├── global_types/
├── index.ts
├── server.ts
```

## Building for Production

Create a production build:

```bash
npm run build
```