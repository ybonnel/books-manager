import {firebaseStorage} from './firebase';


export class Storage {
    constructor(child = null) {
        this._child = child;
    }

    get child() {
        return this._child;
    }

    set child(value) {
        this._child = value;
    }

    /**
     *
     * @param cover the cover object with a File or Blob attribute and a name
     * @returns {Promise}
     */
    upload(cover) {
        return new Promise((resolve, reject) => {
            const newRef = firebaseStorage.ref()
                .child(`${this._child}/${cover.name}`)
                .put(cover.file, error => error ? reject(error) : resolve(newRef.fullPath));
        });
    }

    remove(cover) {
        return new Promise((resolve, reject) => {
            firebaseStorage.ref()
                .child(`${this._child}/${cover.name}`)
                .delete(error => error ? reject(error) : resolve());
        });
    }
}
