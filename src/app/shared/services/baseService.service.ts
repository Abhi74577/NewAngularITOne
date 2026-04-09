import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { ToasterService } from './toaster.service';
import { enc, HmacSHA256, AES } from 'crypto-js';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

;
import { Router } from '@angular/router';
import { ProgressbarService } from './progressbar.service';
import { apiUrl, Encryption, storageConst, StringExtension } from '../common';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  Appversion = new BehaviorSubject<boolean>(false);
  AppVersion = new BehaviorSubject<string>("");

  constructor(
    private http: HttpClient, private router: Router, private toasterService: ToasterService,
    private progressBarService: ProgressbarService,
    private filehendling: HttpBackend) { }

  versionCheck() {
    this.http.get('assets/appSetting.json').subscribe(
      (res: any) => {
        let pversion = res.version;
        this.AppVersion.next(pversion);
      })
  }
 
  callAPI(type:any, url:any, body:any) {
    this.progressBarService.showProgress(10, true);
    if (type === 'POST' || type === 'PUT') {
      this.progressBarService.showProgressBlock(true);
    }
    if ((type === 'POST' || type === 'PUT') && body !== undefined) { this.trimObj(body); }
    return this.http.request(type, `${apiUrl}${url}`,
      { body, headers: this.getHeader(), observe: 'response', reportProgress: true })
      .pipe(
        catchError((error) => this.handleError(error))
      );
  }
 
    // this.progressBarService.showProgress(10, true);
  Export(type:any, url:any, body:any) {
   // this.progressBarService.showProgress(10, true);
    if (type === 'POST' || type === 'PUT') {
      this.progressBarService.showProgressBlock(true);
    }
    if ((type === 'POST' || type === 'PUT') && body !== undefined) { this.trimObj(body); }
    return this.http.request(type, `${apiUrl}${url}`,
      { body, headers: this.getHeader(), observe: 'response', reportProgress: true, responseType: 'arraybuffer' })
      .pipe(
        catchError(this.handleError));
  }


  callFormAPI(type:any, url:any, body:any) {
    this.http = new HttpClient(this.filehendling);
    this.progressBarService.showProgress(10, true);
    if (type === 'POST' || type === 'PUT') {
      this.progressBarService.showProgressBlock(true);
    }
    if ((type === 'POST' || type === 'PUT') && body !== undefined) { this.trimObj(body); }
    return this.http.request(type, `${apiUrl}${url}`,
      { body, headers: this.getHeader(true), observe: 'response', reportProgress: true })
      .pipe(
        catchError(this.handleError));
  }

  callAPTask(type:any, url:any, body:any) {
    this.progressBarService.showProgress(10, true);
    if (type === 'POST' || type === 'PUT') {
      this.progressBarService.showProgressBlock(true);
    }
    if ((type === 'POST' || type === 'PUT') && body !== undefined) { this.trimObj(body); }
    return this.http.request(type, `${'http://configqa.farm365.in/api/'}${url}`,
      { body, headers: this.getHeader(), observe: 'response', reportProgress: true })
      .pipe(
        catchError(this.handleError));
  }

  handleError = (error: HttpErrorResponse) => {
    this.progressBarService.showProgress(100, false);
    this.progressBarService.showProgressBlock(false);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    if (error.status === 403 || error.status === 401) {
      this.clearCache();
      this.router.navigate(['/login']);
    }
    this.toasterService.showMessage('error', error.error.message);
    if (error.error.statusCode === 403 || error.error.statusCode === 401) {
      this.clearCache();
      this.router.navigate(['/login']);
    }
    return throwError(errorMessage);
  }

  getHMAC(apiKey:any, secret:any, deviceId:any, nounce:any) {
    if (!StringExtension.IsNullOrWhiteSpace(apiKey) && !StringExtension.IsNullOrWhiteSpace(secret)) {
      apiKey = apiKey.replace(/-/g, '');
      const stringVal = (`${(apiKey)}:${(deviceId)}:${(nounce)}`);
      const hash = HmacSHA256(stringVal, secret);
      return enc.Base64.stringify(hash);
    } else {
      return '';
    }

  }
getHeader(FromForm?: boolean) {
    const userData = (this.getData(storageConst.userProfile));
    if (!StringExtension.IsNullOrWhiteSpace(userData)) {
      const user = JSON.parse(userData);
      if (user.systemUserId > 0) {
        // const nounce = (((new Date()).getTime() * 10000) + 621458118000000000);
        // const HMAC = this.getHMAC(user.apiKey, user.secret, user.deviceId, nounce);
        // const bearer = btoa(`${user.token}:${user.deviceId}:${nounce}:${HMAC}`);
        if (FromForm == null || !FromForm) {
          return new HttpHeaders({
            'X-APIKEY': user.aPIKey,
            'X-Frame-Options': 'SAMEORIGIN',
            'Content-Type': 'application/json',
            Authorization: `bearer ${atob(user.authToken)}`,
          });
        }
        else {
          return new HttpHeaders({
            'X-APIKEY': user.aPIKey,
            'X-Frame-Options': 'SAMEORIGIN',
            Authorization: `bearer ${atob(user.authToken)}`,
            // 'x-orgcode': this.getHeader('haderValue') == null ? '' : this.getDataHader('haderValue'),
            'enctype': 'multipart/form-data',
            'accept': '*/*',
          });
        }
      } else {
        return new HttpHeaders({
          'X-APIKEY': '',
          Authorization: '',
          'Content-Type': 'application/json',
          'X-Frame-Options': 'SAMEORIGIN',
        });
      }
    } else {
 
      return new HttpHeaders({
        'X-APIKEY': '',
        Authorization: '',
        'Content-Type': 'application/json'
      });
 
    }
  }

GetResponseVarify(data:any, toaster:any) {
    this.progressBarService.showProgress(100, false);
    this.progressBarService.showProgressBlock(false);
    if (data.body !== undefined) {
      if (data.body.statusCodes !== 400) {
        if (toaster) {
          this.toasterService.showMessage('success', 'Verify successfully');
        }
        const decryptedData = Encryption.decryptfunction(data.body.data)
        const decryptedMessage = Encryption.decryptfunction(data.body.message);
        const decryptedStatusCode = Encryption.decryptfunction(data.body.statusCodes); // Implement your decryption logic here
        return { data: decryptedData, message: decryptedMessage, statusCodes: decryptedStatusCode };
      }
      else{
        if (toaster) {
          this.toasterService.showMessage('warning', data.body.message);
        }
        const decryptedData = Encryption.decryptfunction(data.body.data); // Implement your decryption logic here
        return JSON.parse(decryptedData, function (prop, value) {
          var lower = prop.charAt(0).toLowerCase() + prop.substring(1);
          if (prop === lower) return value;
          else this[lower] = value;
        });
      }
    }
  }
 
GetResponse(data:any, toaster:any) {
    this.progressBarService.showProgress(100, false);
    this.progressBarService.showProgressBlock(false);
    if (data.body !== undefined) {
      if (data.body.statusCodes === 200) {
        if (toaster) {
          this.toasterService.showMessage('success', data.body.message);
        }
 
        const decryptedData = Encryption.decryptfunction(data.body.data); // Implement your decryption logic here
        return JSON.parse(decryptedData, function (prop, value) {
          var lower = prop.charAt(0).toLowerCase() + prop.substring(1);
          if (prop === lower) return value;
          else this[lower] = value;
        });
      } else if (data.body.statusCodes > 200 && data.body.statusCodes < 300) {
        if (toaster) {
          this.toasterService.showMessage('warning', data.body.message);
        }
 
        const decryptedData = Encryption.decryptfunction(data.body.data); // Implement your decryption logic here
        return JSON.parse(decryptedData, function (prop, value) {
          var lower = prop.charAt(0).toLowerCase() + prop.substring(1);
          if (prop === lower) return value;
          else this[lower] = value;
        });
      }
      else if (data.body.statusCodes > 400 && data.body.statusCodes < 499) {
        this.toasterService.showMessage('warning', data.body.message);
 
        const decryptedData = Encryption.decryptfunction(data.body.data); // Implement your decryption logic here
        return JSON.parse(decryptedData, function (prop, value) {
          var lower = prop.charAt(0).toLowerCase() + prop.substring(1);
          if (prop === lower) return value;
          else this[lower] = value;
        });
      }
      else {
        if (toaster) {
          this.toasterService.showMessage('warning', data.body.message);
        }
 
        const decryptedData = Encryption.decryptfunction(data.body.data); // Implement your decryption logic here
        return JSON.parse(decryptedData, function (prop, value) {
          var lower = prop.charAt(0).toLowerCase() + prop.substring(1);
          if (prop === lower) return value;
          else this[lower] = value;
        });
      }
    }
  }

  setData(id:any, data:any) {
    localStorage.setItem(id, Encryption.encrypt(data));
    // this.persistenceService.set(id, Encryption.encrypt(data), { type: StorageType.LOCAL });
  }
  getData(id:any) {
    return Encryption.decrypt(localStorage.getItem(id));
    // return Encryption.decrypt(this.persistenceService.get(id, StorageType.LOCAL));
  }

  setJSONData(id:any, data:any) {
    localStorage.setItem(id, Encryption.encrypt(JSON.stringify(data)));
    // this.persistenceService.set(id, Encryption.encrypt(JSON.stringify(data)), { type: StorageType.LOCAL });
  }
  getJSONData(id:any) {
    const data = Encryption.decrypt(localStorage.getItem(id));
    // const data = Encryption.decrypt(this.persistenceService.get(id, StorageType.LOCAL));
    if (!StringExtension.IsNullOrWhiteSpace(data)) {
      return JSON.parse(data);
    }
    return JSON.parse('{}');
  }
  removeData(id:any) {
    localStorage.removeItem(id)
    // this.persistenceService.remove(id, StorageType.LOCAL);
  }
  clearCache() {
    localStorage.clear();
    // this.persistenceService.remove(storageConst.lookupValue, StorageType.LOCAL);
    // this.persistenceService.remove(storageConst.menuPermission, StorageType.LOCAL);
    // this.persistenceService.remove(storageConst.userProfile, StorageType.LOCAL);
  }


  trimObj(obj:any) {
    if (obj === null) {
      return;
    }
    if (typeof (obj) === 'object' && obj.length === undefined) {
      (Object.keys(obj)).map(e => {
        obj[e] = (typeof (obj[e]) === 'string' && !StringExtension.IsNullOrWhiteSpace(obj[e])) ? obj[e].trim() : obj[e];
      });
    } else if (typeof (obj) === 'object' && obj.length >= 0) {
      obj.map((w:any) => {
        if (typeof (w) === 'object') {
          (Object.keys(w)).map(e => {
            w[e] = (typeof (w[e]) === 'string' && !StringExtension.IsNullOrWhiteSpace(w[e])) ? w[e].trim() : w[e];
          });
        }
      });
    }
  }

  lower(obj:any) {
    for (var prop in obj) {
      if (typeof obj[prop] === 'string') {
        obj[prop] = obj[prop].toLowerCase();
      }
      if (typeof obj[prop] === 'object') {
        this.lower(obj[prop]);
      }
    }
    return obj;
  }
}
