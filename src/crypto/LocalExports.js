//Needed to get sjcl to work correctly
import sjcl from 'sjcl';
export {default as sjcl} from 'sjcl';
window.sjcl = sjcl;