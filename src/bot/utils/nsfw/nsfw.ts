import * as nsfw from 'nsfwjs';
import * as jpeg from 'jpeg-js';
import * as fs from 'fs';
import * as tf from '@tensorflow/tfjs-node';

let _model;
const convert = async (img) => {
  // Decoded image in UInt8 Byte array
  const image = await jpeg.decode(img, true);

  const numChannels = 3;
  const numPixels = image.width * image.height;
  const values = new Int32Array(numPixels * numChannels);

  for (let i = 0; i < numPixels; i++)
    for (let c = 0; c < numChannels; ++c)
      values[i * numChannels + c] = image.data[i * 4 + c];

  return tf.tensor3d(values, [image.height, image.width, numChannels], 'int32');
};

const nsfw_detect = async (img: string) => {
  await load_model();
  if (fs.existsSync(img)) {
    const pic = fs.readFileSync(img);
    const tensor = await convert(pic);
    const result = await _model.classify(tensor);
    tensor.dispose();
    console.log(result);
    const nsfw_result = {
      Drawing: result[0].probability,
      Hentai: result[1].probability,
      Porn: result[2].probability,
      Neutral: result[3].probability,
      Sexy: result[4].probability,
    };
    return nsfw_result;
  }
  return {};
};

const load_model = async () => {
  console.log(nsfw);
  _model = await nsfw.load('file://' + __dirname + '/model/', { size: 299 });
};

export default nsfw_detect;
