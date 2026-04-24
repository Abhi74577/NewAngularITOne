import { FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

const { AES, enc, mode, pad } = CryptoJS;       


export const strKey = enc.Utf8.parse('7061737323313233');
export const strIv = enc.Utf8.parse('7061737323313233');
export const strKeyAES256ECB = enc.Utf8.parse('12345678901234567890123456789012');
export const apiVersion = '1.0';
export const defaultPageNo = 1;
export const defaultPageSize = 10;
export const defaultPageSizeRole = 50;
export let menuPermissionObj = { isView: true, isAdd: true, isEdit: true, isDelete: true };
export const toasterTimeout = 7000;
export const maxVisible = 2;
// export const userRole = 1;
export const pickerFormat = 'dd-mmm-yyyy';
export const modulesId = { OviBovi: 11, Milking: 3, IncomeExpense: 6, News: 14, Alert: 8, HealthTransaction: 16 };
export const currentESTDateTime = new Date(new Date().getTime() - 300 * 60000);
export const currentCSTDateTime = new Date(new Date().getTime() - 300 * 60000);
export const invalidMsg = [];
export const DeviationAttachmentURL = localStorage.getItem("DeviationAttachmentURL");


const s4 = Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)     
  .substring(1);
// Local
// export const apiUrl = localStorage.getItem("url") + "api";
// console.log("BaseUrlCommon",apiUrl)
// export const appUrl = localStorage.getItem("url");

// export const apiUrl = `https://localhost:44329/api`; 
// export const appUrl = `https://localhost:44329/`;

// //Staging  
// export const apiUrl = `http://10.10.4.37:880/api`;
// export const appUrl = `http://10.10.4.37:880/`;

export const apiUrl = `https://10.10.4.35:10443/api`; 
export const appUrl = `https://10.10.4.35:10443/`;

// export const apiUrl = `https://itonestg.etechtexas.com/api`;
// export const appUrl = `https://itonestg.etechtexas.com/`;




// export const apiUrl = window.location.hostname == 'localhost' ? `https://localhost:44329/api` : window.location.hostname == 'itoneportal.etechtexas.com' ? `https://itoneportal.etechtexas.com/api`: `https://10.10.4.37:880/api`;

// export const appUrl = window.location.hostname == 'localhost' ? `https://localhost:44329/`: window.location.hostname == 'itoneportal.etechtexas.com' ? `https://itoneportal.etechtexas.com/`: `https://10.10.4.37:880/`;

// export const apiUrl = `https://itoneportal.etechtexas.com/api`;
// export const appUrl = `https://itoneportal.etechtexas.com/`;

//  export const apiUrl = `https://et10grupodev01.etechcti.com/ITOnePortalAPI/api`;
//  export const appUrl = `https://et10grupodev01.etechcti.com/ITOnePortalAPI/`;


//export const apiUrl = `http://10.10.171.135:18003/api`;

// export const apiUrl = window.location.href.indexOf('4200') < 0 ? `${window.location.protocol}//${window.location.host}/api` :
// `http://configuat.farm365.in/api`;

export const paginator = { pageNo: 1, recordsPerPage: 10, sortBy: '', totalPage: 0, seachBy: '', totalRecords: 0 };
export let portNo = '';
export let pageName = '';
export let currentMenu = 0;

export let layoutPanelConst = {
  leftAsideOpen: true, rightAsideOpen: false
};

export const projectDetails = {
  name: 'IT One', version: '1.0.0.0', logo: 'assets/images/n_logo (1).png', loginLogo: 'assets/images/n_logo (1).png'
};

export const projectFacility = {
  socialLog: false, forgotPassword: true, registration: false, contentHeader: false
};

export const storageConst = {
  userProfile: 'UserProfile', menuPermission: 'MenuPermission',
  lookupValue: 'ddldata', type: 'typeList', value: 'ValueList',
  systemSettingValue: 'systemSettingList', breedMilkLactationData: 'breedMilkLactationDataId',
  breedBodyWeightData: 'breedBodyWeightDataId', animalfilter: 'AnimalFilter'
  , cultureKeys: 'cultureKeys', ProjectVersion: 'version'
};


export const emailType = {
  Create: 1,
  Comment: 2,
  ReviewerUpdateStatus: 3,
  Extended: 4,
  ApproverUpdateStatus: 5,
  Inactive: 6,
  Evaluation: 7
}

export class SetComp {
  static ComPort(str:any) {
    portNo = str;
  }
}

export class FormErrorStateMatcher {
  static isErrorState(control: any | null, form: FormGroup ) {
    const value = 'value';
    const required = 'required';
    let error = ((form.controls[control].dirty || form.controls[control].touched)
      && form.controls[control].invalid) ? form.controls[control].errors : null;
    if (((form.controls[control].dirty || form.controls[control].touched)
      && form.controls[control].valid)) {

      if (typeof (form.controls[control][value]) === 'string' && form.controls[control].validator) {
        const validator = form.controls[control].validator({} as AbstractControl);
        if (validator && validator['required']) {
          if ((form.controls[control][value] || '').trim().length === 0) {
            if (error === null || error === undefined) {
              error = { required: true };
            } else {
              error[required] = true;
            }
          }
        }
      }
    }
    return error;
  }
  static noWhitespace(control: AbstractControl): ValidationErrors | null {
    return (control.value || '').trim().length !== 0 ? null : { required: true };
  }
}

export class Encryption {
  static encrypt(str:any) {
    if (!StringExtension.IsNullOrWhiteSpace(str)) {
      const encrypted = AES.encrypt(enc.Utf8.parse(str), strKey, {
        keySize: 128 / 8,
        iv: strIv,
        mode: mode.CBC,
        padding: pad.Pkcs7
      });
      return encrypted.toString();
    } else {
      return '';
    }
  }

  static encryptAES256ECB(str:any) {
    if (!StringExtension.IsNullOrWhiteSpace(str)) {
      const encrypted = AES.encrypt(enc.Utf8.parse(str), strKeyAES256ECB, {
        keySize: 256 / 8,
        iv: strIv,
        mode: mode.ECB,
        padding: pad.Pkcs7
      });
      return encrypted.toString();
    } else {
      return '';
    }
  }
 static decryptfunction(encryptedData: string) {

  // 1. Base64 decode the ciphertext
  const ciphertext = CryptoJS.enc.Base64.parse(encryptedData);

  // 2. Prepare key and IV (UTF-8)
  const key = CryptoJS.enc.Utf8.parse("tracker8534b48w951b9287d492b256x");
  const iv = CryptoJS.enc.Utf8.parse("1230007980000456");

  // 3. AES decrypt
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext } as any,
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );

  // 4. Convert decrypted bytes to UTF-8 string
  return decrypted.toString(CryptoJS.enc.Utf8);
}

  static decryptAES256ECB(str: any) {
    if (!StringExtension.IsNullOrWhiteSpace(str)) {
      const decrypted = AES.decrypt(str, strKeyAES256ECB, {
        keySize: 256 / 8,
        iv: strIv,
        mode: mode.ECB,
        padding: pad.Pkcs7
      });
      return decrypted.toString(enc.Utf8);
    } else {
      return '';
    }
  }

  static decrypt(str:any) {
    if (!StringExtension.IsNullOrWhiteSpace(str)) {
      const decrypted = AES.decrypt(str, strKey,
        {
          keySize: 128 / 8,
          iv: strIv,
          mode: mode.CBC,
          padding: pad.Pkcs7
        });
      return decrypted.toString(enc.Utf8);
    } else {
      return '';
    }
  }
}

export class StringExtension {
  static IsNullOrWhiteSpace(s:any) {
    return ((s !== undefined && s != null && s.trim() !== '') ? false : true);
  }
  static Guid() {
    return s4 + s4 + '-' + s4 + '-' + s4 + '-' + s4 + '-' + s4 + s4 + s4;
  }

  static ToInt(s:any) {
    return parseInt(s, 10);
  }
  static ToFloat(s:any) {
    return parseFloat(s);
  }
  static ToFixedDecimal(s:any, digit:any) {
    // let a = parseFloat('7.' + (s).toString().split('.')[1]) - 7;
    return parseFloat(s.toFixed(digit));
  }
  static ToFixed(a:any, d:any) {
    // var a = parseFloat('7.' + (s).toString().split('.')[1]) - 7;
    // return Math.floor(s) + parseFloat(a.toFixed(digit));

    //let t = a.toString().split('.')[1]; /// 17.9456
    //if (t === undefined) {
    //  t = '00';
    //}
    ////debugger;
    ////t = t.substring(0, d + 1);
    //while (t.length > d) {

    //  t = parseInt(t[t.length - 1], 10) < 5 ? t.substring(0, t.length - 1) : (parseInt(t.substring(0, t.length - 1), 10) + 1).toString();
    //}
    //return parseFloat(a.toString().split('.')[0] + '.' + t);
    return Math.round((a + 0.00001) * 100) / 100;
  }
  static preventSpecialChar(evt: any) {
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)
      || charCode === 8 || charCode === 32 || (charCode >= 48 && charCode <= 57))) {
      return true;
    } else {
      return false;
    }
  }
  static allowSomeSpecialChar(evt: any) {
    evt = (evt) ? evt : window.event;
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode === 40 || charCode === 46 || charCode === 41 || charCode === 44
      || charCode === 34 || ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123)
        || charCode === 8 || charCode === 32 || (charCode >= 48 && charCode <= 57))) {
      return true;
    } else {
      return false;
    }
  }

}


