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

var xhr1 = new XMLHttpRequest();
xhr1.open('GET', 'https://drivepanel.tes286.top/LICENSE', true);
xhr1.onload = function() {
    document.querySelector("#license-tes286").innerText = xhr1.responseText;
};
xhr1.send();

var xhr2 = new XMLHttpRequest();
xhr2.open('GET', 'https://raw.fastgit.org/digitalbazaar/forge/v1.2.1/LICENSE', true);
xhr2.onload = function() {
    document.querySelector("#license-forge").innerText = xhr2.responseText;
}
xhr2.send();