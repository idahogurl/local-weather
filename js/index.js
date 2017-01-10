/*
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0
 
THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.
 
See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
"use strict";
var weatherWidget;
var WeatherWidget = (function () {
    function WeatherWidget(lat, lon) {
        this.lat = lat;
        this.lon = lon;
        this.apiKey = "1f7ef9a00df2431a91a50322163011";
        this.lat = lat;
        this.lon = lon;
    }
    WeatherWidget.prototype.fetch = function (units) {
        this.units = units;
        var requestString = "https://api.apixu.com/v1/current.json?" +
            "key=" + this.apiKey + "&" +
            "q=" + this.lat + "," + this.lon;
        $.getJSON(requestString, function (data) {
            //console.log(data);
            weatherWidget.city = data.location.name;
            weatherWidget.setCityDisplay();
            weatherWidget.degrees = data["current"]["temp_" + weatherWidget.units];
            weatherWidget.setTempDisplay();
            weatherWidget.conditions = data["current"]["condition"]["text"];
            weatherWidget.setConditionsDisplay();
            weatherWidget.iconUrl = data.current.condition.icon;
            weatherWidget.setWeatherIcon();
        });
    };
    WeatherWidget.prototype.setWeatherIcon = function () {
        $("#icon").attr("src", "https:" + this.iconUrl);
        $(".well").css("display", "block");
    };
    WeatherWidget.prototype.setConditionsDisplay = function () {
        $("#conditions").html(this.conditions);
    };
    WeatherWidget.prototype.setTempDisplay = function () {
        $("#temp").html(this.degrees);
        if (this.units == "c") {
            $("#units").html("C");
            $("#units").click(function () {
                weatherWidget.fetch("f");
            });
        }
        else {
            $("#units").html("F");
            $("#units").click(function () {
                weatherWidget.fetch("c");
            });
        }
    };
    WeatherWidget.prototype.setCityDisplay = function () {
        $("#city").html(this.city);
    };
    return WeatherWidget;
}());
var geoSuccess = function (position) {
    var lat = encodeURI(position.coords.latitude);
    var lon = encodeURI(position.coords.longitude);
    weatherWidget = new WeatherWidget(lat, lon);
    weatherWidget.fetch("f");
};
$(document).ready(function () {
    navigator.geolocation.getCurrentPosition(geoSuccess);
});