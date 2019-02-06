export const projectUtils = {
    convertFiles: (files: any, path: string) => {
        return new Promise((resolve, reject) => {
            if (!files) {
                reject("Can't pass an empty list of files");
            }

            const parts = path.split('/');
            let folder = files['/'];
            for (let index = 0; index < parts.length - 1; index++) {
                const folder2 = folder.children[parts[index]];
                if (!folder2) {
                    // TODO - What is this magic number?
                    reject(2);
                    return;
                }
                folder = folder2;
            }
            const fileArray = [];
            const dirArray = [];
            const keys = Object.keys(folder.children);

            // tslint:disable-next-line: prefer-for-of
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                const file = folder.children[key];
                if (file.type === 'f') { fileArray.push({ name: key, type: file.type }); }
                if (file.type === 'd') { dirArray.push({ name: key, type: file.type }); }
            }

            resolve(dirArray.concat(files));
        });
    }
};
