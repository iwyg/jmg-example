import loaded from 'image-loaded';
import {CONTEXT} from 'runtime/constants';

const loadImage = (src) => {
  let img = new CONTEXT.Image;
  img.src = src;

  let promise = new Promise((resolve, reject) => {
    loaded(img, (err, wasLoaded) => {
      if (null !== err) {
        return reject(err);
      }

      return resolve(src, wasLoaded);
    });
  });

  return promise;
};


export default loadImage;
