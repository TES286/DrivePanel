/*****License*********************************************************************
 **  TES286 Drive Panel                                                         **
 **  Copyright (C) 2016-2022  TES286                                            **
 **  This program is free software: you can redistribute it and/or modify       **
 **  it under the terms of the GNU General Public License as published by       **
 **  the Free Software Foundation, either version 3 of the License, or          **
 **  (at your option) any later version.                                        **
 **                                                                             **
 **  This program is distributed in the hope that it will be useful,            **
 **  but WITHOUT ANY WARRANTY; without even the implied warranty of             **
 **  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the              **
 **  GNU General Public License for more details.                               **
 ********************************************************************************/
function parseQueryString(url) {
    var queryString = url.split('?')[1];
    var result = {};
    if (queryString) {
        var queryStringList = queryString.split('&');
        for (var i = 0; i < queryStringList.length; i++) {
            var pair = queryStringList[i].split('=');
            result[pair[0]] = pair[1];
        }
    }
    return result;
}

function localDBwrite(key, value) {
    localStorage.setItem(key, value);
}

function localDBread(key) {
    return localStorage.getItem(key);
}

function main() {
    var url = location.href;
    var queryString = parseQueryString(url);
    var code = queryString['code'];
    localDBwrite('code', code);
    var last_url = localDBread('last_url')
    if (last_url === null) {
        last_url = '/';
    }
    last_url.indexOf('?') == -1 ? last_url += '?' : last_url += '&';
    last_url += 'login=True';
    $('#go-back').attr('href', last_url);
    $('#go-back').show();
    location.href = last_url;
}