
# kannada-nudi

An Electron application with React

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

Before starting the project, make sure you have `Node.js` and `npm` installed.

1. Clone the repository:

   ```bash
   git clone https://github.com/kagapa-blr/kannada-nudi.git
   cd kannada-nudi
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

### Development

To run the application in development mode:

```bash
npm run dev
```

This will start the development server, and you can view the application by navigating to `http://localhost:3000` in your browser.

### Build

To create a build of the application for different operating systems, you can use the following commands:

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

After building for Linux, you will have a `.deb` package located in the `dist` folder (e.g., `dist/kannada-nudi_1.0.0_amd64.deb`).

## Install and Run the `.deb` Package

After building the `.deb` package for Linux, follow these steps to install and run it:

### 1. Install the `.deb` file

After you have the `.deb` file (e.g., `dist/kannada-nudi_1.0.0_amd64.deb`), you can install it using the following commands:

```bash
# Navigate to the directory containing the .deb file
cd dist

# Install the .deb file using dpkg
sudo dpkg -i kannada-nudi_1.0.0_amd64.deb

# If there are any missing dependencies, run the following command to fix them
sudo apt-get install -f
```

### 2. Run the Application

After the installation is complete, you can run the application:

- Open the terminal and type:

  ```bash
  kannada-nudi
  ```

  This should launch the application.

- Alternatively, you can search for **kannada-nudi** in your applications menu and click to open it.

## Additional Notes

- If you encounter any issues during installation or running the app, please check for missing dependencies or compatibility issues with your Linux distribution.
- For more advanced setup or troubleshooting, refer to the [Electron documentation](https://www.electronjs.org/docs) or the [React documentation](https://reactjs.org/docs/getting-started.html).