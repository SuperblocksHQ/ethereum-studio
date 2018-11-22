'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');


const path = require('path');
const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const bfj = require('bfj');
const config = require('../config/webpack.config.prod');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');

const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

// Process CLI arguments
const argv = process.argv.slice(2);
const writeStatsJson = argv.indexOf('--stats') !== -1;

// We require that you explictly set browsers and do not fall back to
// browserslist defaults.
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    return measureFileSizesBeforeBuild(paths.appBuild);
  })
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }

      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(
        stats,
        previousFileSizes,
        paths.appBuild,
        WARN_AFTER_BUNDLE_GZIP_SIZE,
        WARN_AFTER_CHUNK_GZIP_SIZE
      );
      console.log();

      const appPackage = require(paths.appPackageJson);
      const publicUrl = paths.publicUrl;
      const publicPath = config.output.publicPath;
      const buildFolder = path.relative(process.cwd(), paths.appBuild);
      printHostingInstructions(
        appPackage,
        publicUrl,
        publicPath,
        buildFolder,
        useYarn
      );
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    }
  )
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');

  let compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }
        messages = formatWebpackMessages({
          errors: [err.message],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true })
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      const resolveArgs = {
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      };
      if (writeStatsJson) {
        return bfj
          .write(paths.appBuild + '/bundle-stats.json', stats.toJson())
          .then(() => resolve(resolveArgs))
          .catch(error => reject(new Error(error)));
      }

      return resolve(resolveArgs);
    });
  });
}

function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

// Generate OpenZeppelin file structure

// Directory, where smart contracts are stored
const contractsDirectory = path.join(__dirname, '../', 'node_modules', 'openzeppelin-solidity', 'contracts');

// Directory, where json contract files are stored
const jsonDirectory = path.join(__dirname, '../', 'node_modules', 'openzeppelin-solidity', 'build', 'contracts');

// Path of the resulting file
const jsonFilePath = path.join(__dirname, '../', 'src', 'assets', 'static', 'json', 'openzeppelin.json');

// Read all Solidity files from directory
const getAllSolidityFiles = dir =>
    fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        const isSolidityFile = path.extname(name) === '.sol';

        const trimmedPath = name.split("openzeppelin-solidity/")[1];
        return isDirectory
            ? [...files, ...getAllSolidityFiles(name)]
            : isSolidityFile
                ? [...files, trimmedPath ]
                : [...files]
    }, []);

// Build file tree from path
function buildTree(paths) {

    let currentPath, lastPath, node, parent, map = {
            "": {
                children: []
            }
        },
        stack = [""];

    let counter = 0;
    for (let path of paths) {
        let nodes = path.split("/");
        for (let i = 0; i < nodes.length; i++) {
            currentPath = "/" + nodes.slice(1, i + 1).join("/");
            lastPath = stack[stack.length - 1];
            parent = map[lastPath];
            if (!map[currentPath]) {
                let nameSlice = currentPath.split('/');
                let name = nameSlice[nameSlice.length-1];
                if (currentPath.endsWith('.sol')){
                    // if it is a file
                    let json = getFileJSON(jsonDirectory, name);
                    let relativePath = getLocalPath(json.sourcePath);
                    // using a dictionary to avoid duplicates
                    let dict = {};
                    let dependencies = getDependencies(json, relativePath, dict);
                    dependencies = trimDependencies(dependencies);
                    node = {
                        name: name,
                        id: counter,
                        source: json.source,
                        path: relativePath,
                        dependencies: dependencies
                    }
                } else {
                    // if it is a folder
                    node = {
                        name: i === 0 ? "contracts" : name,
                        toggled: i === 0 && true,
                        id: counter,
                        children: []
                    }
                }
                parent.children.push(node);
                map[currentPath] = node;
                counter ++
            }
            stack.push(currentPath)
        }
        stack = stack.slice(0, 1)
    }
    return map[""].children[0];
}

// Read .json file
function getFileJSON(jsonFolderPath, fileName) {
    fileName = path.parse(fileName).name.concat('.json');
    let filePath = path.join(jsonFolderPath, fileName);

    try {
        const raw = fs.readFileSync(filePath);
        return JSON.parse(raw);
    }
    catch (err) {
        try {
            // fix for one of the contracts
            fileName = "ERC20".concat(fileName);
            filePath = path.join(jsonFolderPath, fileName);
            const raw = fs.readFileSync(filePath);
            return JSON.parse(raw);
        } catch (err) {
            console.error(err)
        }
    }
}

// Get ID and dependencies from JSON
function getDependencies(json, relativePath, dict) {
    let dependenciesArray = [];
    let fileName, path;

    const importString = "import ";
    json.source.split('\n').map(line => {
        if (line.indexOf(importString) !== -1) {
            path = line.split('"')[1];
            let absolutePath = getAbsoluteDependencyPath(path, relativePath);
            let fileNameArray = path.split('/');
            fileName = fileNameArray[fileNameArray.length-1];
            // don't push the same entry twice
            if (!dict[absolutePath]) {
                dict[absolutePath] = true;
                dependenciesArray.push({ fileName, absolutePath });
            }
        }
    });

    // if no dependency, return
    if (dependenciesArray.length === 0) {
        return dependenciesArray
    }

    // Check dependencies of dependencies
    dependenciesArray.map(dependency => {
        let json = getFileJSON(jsonDirectory, dependency.fileName);
        let relativePath = getLocalPath(json.sourcePath);
        dependenciesArray = dependenciesArray.concat(getDependencies(json,relativePath, dict))
    });

    return dependenciesArray
}

// get local path after openzeppelin directory
function getLocalPath(absolutePath) {
    return absolutePath.split('openzeppelin-solidity/')[1]
}

function getAbsoluteDependencyPath(filePath, relativePath) {
    // remove contracts folder and file from end of path
    let relative = removeLastSlash(relativePath);

    filePath.split('/').map(splitPath => {
        switch (splitPath) {
            case "..":
                relative = removeLastSlash(relative);
                break;
            case ".":
                // same directory
                break;
            default:
                // reached file
                relative = path.join(relative, splitPath);
                break;
        }
    });

    return relative;
}

// remove "contracts/"
function trimPath(path) {
    return path.substr(10);
}

// run trimPath on each dependencies
function trimDependencies(dependencies) {
    let dependenciesArray = [];

    dependencies && dependencies.map(dependency => {
        const fileName = dependency.fileName;
        const absolutePath =trimPath(dependency.absolutePath);
        dependenciesArray.push({ fileName, absolutePath });
    });

    return dependenciesArray;
}

function removeLastSlash(path) {
    return path.substring(0, path.lastIndexOf("/"));
}

let tree = buildTree(getAllSolidityFiles(contractsDirectory));

fs.writeFile(jsonFilePath, JSON.stringify(tree), 'utf8', function (err) {
    if (err) throw err;
    console.log('OpenZeppelin .json successfully created.');
});
