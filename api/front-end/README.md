This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Available Scripts
============

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!


!!! Don't use `npm run eject` !!!


Development hints
============
Some hints for front end UI development should be listed here.

Development api url
-----
By default front end tries to connect to current serving address to look
for api. You can override this default behavior by creating 
`.env` file on root of `front-end` react project and fill this inside:

```.dotenv
REACT_APP_API_BASE_URL=http://x.x.x.x:4300/
```

Replace `x.x.x.x` with your server address running Open Intelligence api.


Adding new translations
-----
1. Go to `./api/front-end/src/translations` folder.
2. Clone some translations file like `en.json` and name it with target language short name.
3. Replace strings to have target translation.
4. Make pull request and repository maintainer|author does rest or you can add navbar button if you want.
5. Rest of the work happens via pull request -> review.


Learn More
============

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
