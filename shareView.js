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

var _hmt = _hmt || [];
var DL_ROOT = "https://1drv.tes286.top/";

window.dataLayer = window.dataLayer || [];

function gtag() { dataLayer.push(arguments); }
window.gtag = gtag;
gtag('js', new Date());
gtag('config', 'G-P0D0K5QM78');

function load_date() {
    if (location.hash) {
        var hash = location.hash.substring(1);
        // 支持: url=***&path=***
        // 解析
        var theRequest = {};
        strs = hash.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
        // 设置值
        window.test_flag = false
        if (theRequest['path']) {
            $("#Path").val(theRequest['path']);
        }
        if (theRequest['url']) {
            $("#ShareLink").val(theRequest['url']);
        }
        if (theRequest['dl_root']) {
            window.DL_ROOT = theRequest['dl_root'];
        }
        if (theRequest['test']) {
            window.test_flag = true;
        }
    }
}

function main() {
    load_date();
    if ($("#ShareLink").val() != "") {
        start();
    }
    if (window.test_flag) {
        test(1);
    }
    window.paypalAlreadySetup = false;
    var clipboard = new ClipboardJS('#copy');
    clipboard.on('success', function(e) {
        console.log('Copy', e);
    });
    clipboard.on('error', function(e) {
        console.log('Copy Error', e);
    });
    show_wechat();
    links = document.getElementsByTagName("link");
    // 如果media为asyncload，则改成all加载
    for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute("media") == "asyncload") {
            links[i].setAttribute("media", "all");
        }
    }
}

function build_dl_url(token, id) {
    return DL_ROOT + "u/s!" + token + "/" + id;
}

function start() {
    // 设置hash
    hash = "url=" + encodeURIComponent($("#ShareLink").val()) + "&path=" + encodeURIComponent($("#Path").val());
    if (DL_ROOT != "https://1drv.tes286.top/") {
        hash += "&dl_root=" + encodeURIComponent(DL_ROOT);
    }
    if (window.test_flag) {
        hash += "&test=1";
    }
    location.href = location.href.split("#")[0] + "#" + hash;
    gtag('event', 'start', { url: $("#ShareLink").val(), path: $("#Path").val() });
    // 检查链接
    if ($("#ShareLink").val() == "") {
        console.error("ShareLink is empty");
        error("链接为空");
        return;
    }
    try {
        var urlOBJ = new URL($("#ShareLink").val());
        var url = urlOBJ.origin + urlOBJ.pathname;
    } catch (e) {
        gtag('event', 'error', { error: "url error" });
        console.error("ShareLink is invalid");
        error("链接无效");
        return;
    }
    // 格式: https://1drv.ms/{ch}/s!{token}

    // 提取出token
    var token = url.substring(url.indexOf("!") + 1);

    // url: https://api.onedrive.com/v1.0/shares/s!{token}/driveItem
    // 拼接url
    if ($("#Path").val() == "") {
        var api = "https://api.onedrive.com/v1.0/shares/s!" + token + "/driveItem/children";
    } else {
        var _p = $("#Path").val().split("/");
        var p = "";
        for (var i = 0; i < _p.length; i++) {
            if (_p[i] != "") {
                p += "/" + _p[i];
            }
        }
        $("#Path").val(p);
        var api = "https://api.onedrive.com/v1.0/shares/s!" + token + "/driveItem:" + $("#Path").val() + ":/children";
    }
    // 清理 #ShareTable
    $("#ShareTable").empty();
    // 发送请求
    $.ajax({
        url: api,
        type: "GET",
        success: function(data) {
            // 检查是否成功
            if (data.error) {
                console.error(data.error.message);
                error(data.error.message);
                return;
            }

            value = data.value; // 数组
            // 循环数组
            for (var i = 0; i < value.length; i++) {
                // 判断是否是文件夹 (有folder就是文件夹, 否则就是文件)
                if (value[i].folder != undefined) {
                    // 是文件夹
                    // 添加到文件夹列表 (#ShareTable)
                    $('#ShareTable').append('<tr id="' + i + '"></tr>');
                    // 图标
                    $('#' + i).append('<td><span class="iconfont icon-folderopen-fill"></i></td>');
                    // 添加文件夹名称
                    $('#' + i).append('<td>' + value[i].name + '</td>');
                    // 添加文件夹ID
                    $('#' + i).append('<td>' + value[i].id + '</td>');
                    // 添加文件夹链接
                    $('#' + i).append('<td><buton class="btn btn-link btn-xs" onclick="javascript:update(\'' + value[i].name + '\')">进入</button></td>');
                } else {
                    // 是文件
                    // 添加到文件列表 (#ShareTable)
                    $('#ShareTable').append('<tr id="' + i + '"></tr>');
                    // 图标
                    $('#' + i).append('<td><span class="iconfont icon-file-fill"></i></td>');
                    // 添加文件名称
                    $('#' + i).append('<td>' + value[i].name + '</td>');
                    // 添加文件ID
                    $('#' + i).append('<td>' + value[i].id + '</td>');
                    // 添加文件链接
                    $('#' + i).append('<td><a href="' + build_dl_url(token, value[i].id) + '">' + build_dl_url(token, value[i].id) + '</a></td>');
                }
            }
            $("#Error").empty();
            $("#ErrorZone").hide();
        },
        error: function(e) {
            h
            gtag('event', 'error', { error: "ajax error: " + e.responseText });
            console.error('Request failed: ', e);
            error("请求失败: " + e.responseText);
        }
    });
    update_path_title()
}

function test() {
    window.test_flag = true;
    $("#ShareLink").val("https://1drv.ms/u/s!Anf3w9LYLCm3aq7TqzEUPdHXQW4?e=KTemKq");
    $("#Path").val("");
    $("#test").show();
    DL_ROOT = "http://localhost:5000/";
    if (arguments[0] != 1) {
        start();
    }
}

function update(path) {
    var _path = $("#Path").val();
    if (_path == "") {
        $("#Path").val(path);
    } else {
        $("#Path").val(_path + "/" + path);
    }
    start();
}

function update_path_title() {
    var _path = $("#Path").val();
    p = _path.split("/");
    $("#PathTitle").empty();
    $("#PathTitle").append('<li><a onclick="javascript:cd(\'/\')">root</li>');
    for (var i = 0; i < p.length; i++) {
        if (p[i] == "") {
            continue;
        }
        $("#PathTitle").append('<li><a onclick="javascript:cd(\'/' + join(p, '/', true, i + 1) + '\')" id="p-' + i + '"></li>');
        $("#PathTitle").find("#p-" + i).text(p[i]);
    }
}

function error(msg) {
    $("#Error").empty();
    $("#Error").append(msg);
    $("#ErrorZone").show();
}

function join(date, spliter, skip_empty, n) {
    if (skip_empty == undefined) {
        skip_empty = true;
    }
    if (spliter == undefined) {
        spliter = " ";
    }
    if (n == undefined) {
        n = date.length;
    }
    var result = "";
    for (var i = 0; i < n; i++) {
        if (skip_empty && date[i] == "") {
            continue;
        }
        result += spliter + date[i];
    }
    return result;
}

function share(url) {
    $("#link").val(url);
    $('#qrcode').empty();
    $('#qrcode').qrcode({
        text: url,
        colorDark: "#000000",
        colorLight: "#ffffff"
    });
    $("#share").show();
}

function cd(path) {
    $("#Path").val(path);
    start();
}

function show_wechat() {
    $("#donate-alipay").hide();
    $('#donate-paypal').hide();
    $("#donate-wechat").show();
    $("#d_wx").addClass("active");
    $("#d_ap").removeClass("active");
    $("#d_pp").removeClass("active");
    $("#qrcode-wechat").empty();
    $('#qrcode-wechat').qrcode({
        render: "canvas",
        width: 200,
        height: 200,
        text: "wxp://f2f00gd_B-CYN4Q_2i4W2KcwUPZTA8LZHn0TButK77N3hAQ"
    });
}

function show_alipay() {
    $("#donate-wechat").hide();
    $('#donate-paypal').hide();
    $("#donate-alipay").show();
    $("#d_wx").removeClass("active");
    $("#d_ap").addClass("active");
    $("#d_pp").removeClass("active");
    $('#qrcode-alipay').empty();
    $('#qrcode-alipay').qrcode({
        render: "canvas",
        width: 200,
        height: 200,
        text: "https://qr.alipay.com/fkx11387gtiblxh4um1l593"
    });
}