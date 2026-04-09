import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class ValidationHelper {

    email_RegEx = '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$';
    email_RegEx2 = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
    phoneNb_RegEx = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    checkUrl_RegEx = '^[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)';
    //  Emoji_RegEx = '(\\u00a9|\\u00ae|[\\u2000-\\u3300]|\\ud83c[\\ud000-\\udfff]|\\ud83d[\\ud000-\\udfff]|\\ud83e[\\ud000-\\udfff])';
    // Emoji_RegEx = '<a?:.+?:\d{18}>|\p{Extended_Pictographic}';
    // Emoji_RegEx = '[^\\x00-\\x7F]+\\ *(?:[^\\x00-\\x7F]| )*';
    Emoji_RegEx = '(?!:\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff])$'
    // Emoji_RegEx= '(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])';

    CheckSpecialChar(event:any) {
        let charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 32 || (charCode >= 48 && charCode <= 57))
            return true;
        return false;
    }


    allowCertainSpecChar(event:any) {
        let charCode = (event.which) ? event.which : event.keyCode;
        if (((charCode >= 64 && charCode <= 91) || (charCode > 96 && charCode <= 123) || charCode == 13 || charCode == 32 || charCode == 93 || charCode == 125 || (charCode >= 48 && charCode <= 59) || (charCode >= 35 && charCode <= 44) || charCode == 33 || charCode == 61 || charCode == 91 || charCode == 93 || charCode == 47))
            return true;
        return false;
    }

    CR_TecketID_HASH_NB_CharAllow(event:any) {
        let charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8 || charCode == 35 || (charCode >= 48 && charCode <= 57))
            return true;
        return false;
    }

    // /^[a-z0-9]+([-_\s]{1}[a-z0-9]+)*$/i
    alfaNumricwithSpace(event: any) {
        if (event.charCode != 0) {
            var regex = new RegExp("^[A-Za-z0-9? ,_-]+$");
            var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
            if (!regex.test(key)) {
                event.preventDefault();
                return false;
            }
        }
        return true;
    }


    onlyAlfabetic(event: any) {
        var regex = new RegExp('^[a-zA-Z \-\']+');
        var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
        return true;
    }


    validatePhone(event: any) {
        var regex = new RegExp("^[0-9]+$");
        var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
        return true;
    }



    OnlyNumber(event: any) {
        let charCode = (event.which) ? event.which : event.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }

    // [\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]




    //  CheckURL(event){
    //     var regex = new RegExp('[(http(s)?):\\/\\/(www\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)');
    //     var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
    //     if (!regex.test(key)) {
    //         event.preventDefault();
    //         return false;
    //     }

    // }

    validateEmoji(event: any) {
        var regex = new RegExp("(?!:\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff])$");
        var key = String.fromCharCode(event.charCode ? event.which : event.charCode);
        if (!regex.test(key)) {
            event.preventDefault();
            return false;
        }
        return true;

    }

}