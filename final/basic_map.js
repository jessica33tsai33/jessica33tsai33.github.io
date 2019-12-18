//Step 0: set up containers for the map  + panel
var mapContainer = document.getElementById('map'),
    routeInstructionsContainer = document.getElementById('panel');

//Step 1: initialize communication with the platform
var platform = new H.service.Platform({
    app_id: app_id,
    app_code: app_code,
    useCIT: true,
    useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();


//Step 2: initialize a map - this map is centered over Taiwan
var map = new H.Map(document.getElementById('map'),
    defaultLayers.normal.map, {
        center: { lat: 25, lng: 121 },
        zoom: 6
    });
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

var locationsContainer = document.getElementById('panel');


//Step 3: make the map interactive
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);


//切換語言
function setBaseLayer(map, platform) {
    var mapTileService = platform.getMapTileService({
        type: 'base'
    });
    var parameters = {
        lg: 'cht'
    };
    var tileLayer = mapTileService.createTileLayer(
        'maptile',
        'normal.day',
        256,
        'png8',
        parameters
    );
    map.setBaseLayer(tileLayer);
}

setBaseLayer(map, platform)


//泡泡資訊窗
var bubble;

function openBubble(position, text) {
    if (!bubble) {
        bubble = new H.ui.InfoBubble(
            position, { content: text });
        ui.addBubble(bubble);
    } else {
        bubble.setPosition(position);
        bubble.setContent(text);
        bubble.open();
    }
}

//路徑規劃
function calculateRouteFromAtoB(platform, sequences) {
    var router = platform.getRoutingService(),
        routeRequestParams = {
            mode: 'fastest;car',
            representation: 'display',
            routeattributes: 'waypoints,summary,shape,legs',
            maneuverattributes: 'direction,action',
        };

    waypoints = [];
    for (j = 0; j <= varCount; j++) {
        waypoint = 'waypoint' + j;
        waypoints.push(waypoint)
    }

    for (k = 0; k <= varCount; k++) {
        routeRequestParams[waypoints[k]] = sequences[k];
    }

    router.calculateRoute(
        routeRequestParams,
        onSuccess,
        onError
    );
}

function onSuccess(result) {
    var route = result.response.route[0];

    addWaypointsMapMarker(route.waypoint);
    addRouteShapeToMap(route);
    addManueversToMap(route);
    addWaypointsToPanel(route.waypoint);
    addManueversToPanel(route);
    addSummaryToPanel(route.summary);
}

function onError(error) {
    alert('Can\'t reach the remote server');
}

//在地圖上標記每個停留點 Waypoints
function addWaypointsMapMarker(waypoints) {
    var truckIcons = [];
    for (j = 0; j <= 99; j += 1) {
        var svgMarkup = '<svg width="24" height="24" ' +
            'xmlns="http://www.w3.org/2000/svg">' +
            '<rect stroke="white" fill="#ed3434" x="1" y="1" width="22" ' +
            'height="22" /><text x="12" y="18" font-size="12pt" ' +
            'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
            'fill="white">' + j + '</text></svg>';

        var truckIcon = new H.map.Icon(svgMarkup);
        truckIcons.push(truckIcon)
    }
    var waypointsgroup = new H.map.Group(),
        i;

    for (i = 0; i < waypoints.length; i += 1) {
        // Get the next waypoint.
        var waypointslat = waypoints[i].mappedPosition.latitude;
        var waypointslng = waypoints[i].mappedPosition.longitude;
        // Add a marker to the waypoints group
        var waypointsMarker;
        var Icon = new H.map.Icon('img/driver.png');

        if (i == 0) {
            waypointsMarker = new H.map.Marker({
                lat: waypointslat,
                lng: waypointslng
            }, { icon: Icon });
            waypointsMarker.waypointinfo = window.Origin;
        } else {
            waypointsMarker = new H.map.Marker({
                lat: waypointslat,
                lng: waypointslng
            }, { icon: truckIcons[i] });
            waypointsMarker.waypointinfo = window.waypointinfo[i - 1][0];
        }

        waypointsgroup.addObject(waypointsMarker);
    }

    waypointsgroup.addEventListener('tap', function(evt) {
        map.setCenter(evt.target.getPosition());
        openBubble(
            evt.target.getPosition(), evt.target.waypointinfo);
    }, false);

    map.addObject(waypointsgroup);
}


//路徑規劃的線畫在地圖上 H.map.Polyline
function addRouteShapeToMap(route) {
    var lineString = new H.geo.LineString(),
        routeShape = route.shape,
        polyline;

    routeShape.forEach(function(point) {
        var parts = point.split(',');
        lineString.pushLatLngAlt(parts[0], parts[1]);
    });

    polyline = new H.map.Polyline(lineString, {
        style: {
            lineWidth: 10,
            strokeColor: 'rgba(0, 128, 255, 0.7)'
        },
        arrows: { fillColor: 'white', frequency: 2, width: 0.8, length: 0.7 }
    });
    // Add the polyline to the map
    map.addObject(polyline);
    // And zoom to its bounding rectangle
    map.setViewBounds(polyline.getBounds(), true);
}

//路徑規劃上的點(中途幾個點) Manuevers 畫在地圖上 H.map.Marker points on Map
function addManueversToMap(route) {
    var svgMarkup = '<svg width="18" height="18" ' +
        'xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="8" cy="8" r="4" ' +
        'fill="#1b468d" stroke="white" stroke-width="1"  />' +
        '</svg>',
        dotIcon = new H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } }),
        group = new H.map.Group(),
        i,
        j;

    // Add a marker for each maneuver
    for (i = 0; i < route.leg.length; i += 1) {
        for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
            // Get the next maneuver.
            maneuver = route.leg[i].maneuver[j];
            // Add a marker to the maneuvers group
            var marker = new H.map.Marker({
                lat: maneuver.position.latitude,
                lng: maneuver.position.longitude
            }, { icon: dotIcon });
            marker.instruction = maneuver.instruction;
            group.addObject(marker);
        }
    }

    group.addEventListener('tap', function(evt) {
        map.setCenter(evt.target.getPosition());
        openBubble(
            evt.target.getPosition(), evt.target.instruction);
    }, false);

    // Add the maneuvers group to the map
    map.addObject(group);
}

//每個停留點 waypoints 顯示在Panel上
function addWaypointsToPanel(waypoints) {

    var nodeH3 = document.createElement('h3'),
        waypointLabels = [],
        i;


    for (i = 0; i < waypoints.length; i += 1) {
        waypointLabels.push(waypoints[i].label)
    }

    nodeH3.textContent = waypointLabels.join(' - ');

    //routeInstructionsContainer.innerHTML = '';
    routeInstructionsContainer.appendChild(nodeH3);
}

//路徑規劃的總里程、預估旅行時間顯示在Panel上
function addSummaryToPanel(summary) {
    var summaryDiv = document.createElement('div'),
        content = '';
    content += '<b>Total distance</b>: ' + summary.distance + 'm. <br/>';
    content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';


    summaryDiv.style.fontSize = 'small';
    summaryDiv.style.marginLeft = '5%';
    summaryDiv.style.marginRight = '5%';
    summaryDiv.innerHTML = content;
    routeInstructionsContainer.appendChild(summaryDiv);
}

//路徑規劃上的點(中途幾個點) Manuevers 顯示在Panel上
function addManueversToPanel(route) {

    var nodeOL = document.createElement('ol'),
        i,
        j;

    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft = '5%';
    nodeOL.style.marginRight = '5%';
    nodeOL.className = 'directions';

    // Add a marker for each maneuver
    for (i = 0; i < route.leg.length; i += 1) {
        for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
            // Get the next maneuver.
            maneuver = route.leg[i].maneuver[j];

            var li = document.createElement('li'),
                spanArrow = document.createElement('span'),
                spanInstruction = document.createElement('span');

            spanArrow.className = 'arrow ' + maneuver.action;
            spanInstruction.innerHTML = maneuver.instruction;
            li.appendChild(spanArrow);
            li.appendChild(spanInstruction);

            nodeOL.appendChild(li);
        }
    }

    routeInstructionsContainer.appendChild(nodeOL);
}

//旅行時間顯示方式
Number.prototype.toMMSS = function() {
    return Math.floor(this / 60) + ' minutes ' + (this % 60) + ' seconds.';
}

//初始參數個數
var varCount = 2;

$(function() {
    //新增按鈕點擊
    $('#addVar').on('click', function() {
        varCount++;
        $node = '<p><label for="waypoint' + varCount + '">旅次 ' + varCount + '： </label>' +
            '<input type="text" name="waypoint' + varCount + '" id="waypoint' + varCount + '">' +
            ' 時間範圍：' + '<input type="text" name="waypointStartTime' + varCount + '" id="waypointStartTime' + varCount + '">' +
            ' - ' + '<input type="text" name="waypointEndTime' + varCount + '" id="waypointEndTime' + varCount + '">' +
            ' 停留時間：' + '<input type="text" name="waypointDuration' + varCount + '" id="waypointDuration' + varCount + '">' +
            ' ' + '<span class="removeVar">删除</span></p>';
        //新表單向添加到"新增"按鈕前面
        $(this).parent().before($node);
    });

    //刪除按鈕點擊
    $('form').on('click', '.removeVar', function() {
        $(this).parent().remove();
        varCount--;
    });
});


//取得html表單輸入值(起迄點、中途各點、時間範圍、停留時間)
function processFormData() {
    const OriginElement = document.getElementById("Origin");
    window.Origin = OriginElement.value;
    const OriginTimeElement = document.getElementById("OriginTime");
    window.OriginTime = OriginTimeElement.value;

    window.waypointinfo = [];
    for (i = 1; i <= varCount; i++) {
        var waypoint = [document.getElementById("waypoint" + i).value, document.getElementById("waypointStartTime" + i).value, document.getElementById("waypointEndTime" + i).value, window.waypointDuration = document.getElementById("waypointDuration" + i).value];
        window.waypointinfo.push(waypoint);
    }

    alert_string = '';
    alert_string += "你輸入的出發點是:" + window.Origin + '，\n' + "出發時間為:" + window.OriginTime + '；\n';
    for (j = 0; j < varCount; j++) {
        alert_string += "你輸入的第" + (j + 1) + "點是:" + window.waypointinfo[j][0] + '，\n' + "時間範圍:" + window.waypointinfo[j][1] + " - " + window.waypointinfo[j][2] + "，停留時間:" + window.waypointinfo[j][3] + "秒" + '；\n';
    }


    alert(alert_string)
    HEREwaypointSequenceTimeFrameAPI();
}

//Here waypoints sequence API 呼叫
function HEREwaypointSequenceTimeFrameAPI() {

    waypointsURL = '';
    for (j = 0; j < varCount; j++) {
        waypointsURL += "&destination" + (j + 1) + "=" + window.waypointinfo[j][0] + ";acc:mo" + window.waypointinfo[j][1] + "%2b01:00%7cmo" + window.waypointinfo[j][2] + "%2b01:00;st:" + window.waypointinfo[j][3]
    }
    var waypointSequenceURL = "https://wse.api.here.com/2/findsequence.json?departure=" + window.OriginTime + "%2b01:00" +
        "&mode=fastest;car;traffic:disabled&app_id=" + app_id + "&app_code=" + app_code + "&start=" + window.Origin +
        waypointsURL +
        "&improveFor=TIME"

    var sequenceRequest = new XMLHttpRequest();
    sequenceRequest.open('GET', waypointSequenceURL);
    sequenceRequest.responseType = 'json';
    sequenceRequest.send();

    sequenceRequest.onload = function() {
        window.waypointSequence = sequenceRequest.response;
        showSequence(window.waypointSequence);
    }
}

//Here waypoints sequence API 傳回之json檔，反序列化，顯示出旅次順序
function showSequence(jsonObj) {
    var sequenceID = document.createElement('div'),
        content = '';
    content += "旅次順序與預計抵達時間：" + '<br/>';
    content += "第0點(出發點)：" + jsonObj['results'][0]['waypoints'][0]['id'] + "，預計出發時間：" + jsonObj['results'][0]['waypoints'][0]['estimatedDeparture'] + '<br/>';
    for (j = 1; j <= varCount; j++) {
        content += "第" + (j - 1) + "點-第" + j + "點，" + jsonObj['results'][0]['waypoints'][j - 1]['id'] + " - " + jsonObj['results'][0]['waypoints'][j]['id'] + "，距離：" + jsonObj['results'][0]["interconnections"][j - 1]["distance"] + "公尺，行駛所需時間：" + jsonObj['results'][0]["interconnections"][j - 1]["time"] + '秒<br/>';
        content += "第" + j + "點：" + jsonObj['results'][0]['waypoints'][j]['id'] + "，預計停留時間：" + jsonObj['results'][0]['waypoints'][j]['estimatedArrival'] + " - " + jsonObj['results'][0]['waypoints'][j]['estimatedDeparture'] + '<br/>';
    }

    sequenceID.style.fontSize = 'small';
    sequenceID.style.marginLeft = '5%';
    sequenceID.style.marginRight = '5%';
    sequenceID.innerHTML = content;

    routeInstructionsContainer.appendChild(sequenceID);
}


//將here API jsonObj，反序列化找出經緯度，使用calculateRouteFromAtoB畫圖在map、顯示資訊在panel上
function RoutingOnMapButton() {
    sequenceToRouting(window.waypointSequence);
}

function sequenceToRouting(jsonObj) {

    var sequences = [];
    for (k = 0; k <= varCount; k++) {
        sequence = jsonObj['results'][0]['waypoints'][k]['lat'] + ',' + jsonObj['results'][0]['waypoints'][k]['lng'];
        sequences.push(sequence)
    }

    calculateRouteFromAtoB(platform, sequences);
}