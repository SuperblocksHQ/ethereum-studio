const path = require('path');
const fs = require('fs');

// This script generates JSON of templates from folder/file structure

// Directory which contains unmodified templates
const templatesDirectory = path.join(__dirname, '../', 'templates');

// Directory in which should be exported the templates in final format
const exportPath = path.join(__dirname, '../', 'src', 'assets', 'static', 'json', 'templates');

// Root JSON which gets repeated amongst all templates
const json = {
    'name': '',
    'files': {
        'id': '123',
        'name': 'Files',
        'type': 'FOLDER',
        'opened': true,
        'mutable': false,
        'isRoot': true,
        'children': []
    }
}

/* Helper Functions */
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 16);
}

// Check if file should be mutable
function isMutable(fileName) {
    return fileName !== 'dappfile.json';
}

// Sort files alphabetically
function sortFiles(files) {
    files.sort(function(a, b) {
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
    
        return a < b ? -1 : a > b ? 1 : 0;
    });

    return files;
}

/* Main Functions */
// Navigate through templates folder and pick up each template folder
function readAllTemplates() {
    fs.readdir(templatesDirectory, (err, files) => {
        if (err) {  throw err };

        files.forEach(fileName => {
            const filePath = path.join(templatesDirectory, fileName);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                const templateJSON = generateTemplateJSON(filePath);
                saveTemplateAsJSON(fileName, templateJSON);
            }
        })
    })
}

// Navigates through template's folder and generates JSON from the files
function generateTemplateJSON(filePath) {
    const stats = fs.lstatSync(filePath);
    let newItem = {
        id: generateUniqueId(),
        name: path.basename(filePath),
        mutable: isMutable(path.basename(filePath)),
        opened: false,
    };

    if (stats.isDirectory()) {
        newItem.type = 'FOLDER';
        newItem.children = fs.readdirSync(filePath).map(function(child) {
            return generateTemplateJSON(path.join(filePath, child));
        });
    } else {
        // Add file content into file object
        newItem.code = fs.readFileSync(filePath, { encoding: 'utf8' });
        newItem.type = 'FILE';
        newItem.opened = false;
        newItem.children = [];
    }

    return newItem;
}

// Saves generated JSON to 'exportPath' folder
function saveTemplateAsJSON(templateName, templateJSON) {
    const filePath = path.join(exportPath, `${templateName.replace(/ /g, '').toLowerCase()}.json`);
    const finalJSON = {
        ...json,
        name: templateName,
        files: {
            ...json.files,
            children: sortFiles(templateJSON.children)
        }
    }

    fs.mkdir(exportPath, { recursive: true }, (err) => {
        fs.writeFile(filePath, JSON.stringify(finalJSON, null, 4), 'utf8', function (err) {
            if (err) throw err;
            console.log(`Template ${templateName} has been successfully generated.`);
        });
    });
}

readAllTemplates();
