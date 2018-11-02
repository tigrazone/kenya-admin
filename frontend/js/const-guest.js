var eml_regexp=/^([a-zA-Z0-9_\.\-])+@([a-zA-Z0-9\-]+\.?)*\.([a-zA-Z]){2,5}$/;

const BASEserver = 'https://' + window.location.host + '/api';
//const BASEserver = 'http://kmdev.us-west-2.elasticbeanstalk.com/api';

//const S3server = 'http://trm-kenya.s3-accelerate.amazonaws.com/';
const S3server = 'http://kenyam-dev.s3-accelerate.amazonaws.com/'; 

const access_only_email = 'guest@guest.com';


const BASEaddr = '/users';
const BASEaddr1 = BASEaddr.replace('\/','');

/*
console.log('BASEaddr1')
console.log(BASEaddr1)
*/


const storageUSRkey = 'cur_user';
