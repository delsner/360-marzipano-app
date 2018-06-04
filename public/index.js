'use strict';

(function () {
    var Marzipano = window.Marzipano;
    var bowser = window.bowser;
    var screenfull = window.screenfull;
    var data = window.APP_DATA;

    // get dom elements
    var panoElement = document.querySelector('#pano');
    var sceneListElement = document.querySelector("#sceneList");
    var sceneNameElement = document.querySelector('#titleBar .sceneName');
    var sceneElements = document.querySelectorAll('#sceneList .scene');
    var autorotateToggleElement = document.querySelector('#autorotateToggle');
    var fullscreenToggleElement = document.querySelector('#fullscreenToggle');

    // set meta information
    document.title = data.name;

    // test event listeners
    panoElement.addEventListener('mousedown', function (e) {
        var pressPosition = {x: e.clientX, y: e.clientY};
        console.log(pressPosition);
        var scene = viewer.scene(); // get the current scene
        var view = scene.view();    // get the scene's view

        var yaw = view.yaw();
        var pitch = view.pitch();
        var fov = view.fov();      // fov is horizontal
        console.log({yaw: yaw, pitch: pitch, fov: fov});

        var coordinates = view.screenToCoordinates(pressPosition);

        console.log(coordinates);

    });


    // Detect desktop or mobile mode.
    if (window.matchMedia) {
        var setMode = function () {
            if (mql.matches) {
                document.body.classList.remove('desktop');
                document.body.classList.add('mobile');
            } else {
                document.body.classList.remove('mobile');
                document.body.classList.add('desktop');
            }
        };
        var mql = matchMedia("(max-width: 500px), (max-height: 500px)");
        setMode();
        mql.addListener(setMode);
    } else {
        document.body.classList.add('desktop');
    }

    // Detect whether we are on a touch device.
    document.body.classList.add('no-touch');
    window.addEventListener('touchstart', function () {
        document.body.classList.remove('no-touch');
        document.body.classList.add('touch');
    });

    // Use tooltip fallback mode on IE < 11.
    if (bowser.msie && parseFloat(bowser.version) < 11) {
        document.body.classList.add('tooltip-fallback');
    }

    // Viewer options.
    var viewerOpts = {
        controls: {
            mouseViewMode: data.settings.mouseViewMode
        }
    };

    // Initialize viewer.
    var viewer = new Marzipano.Viewer(panoElement, viewerOpts);

    // Create scenes.
    var scenes = data.scenes.map(function (sc) {

        // Create source.
        var source = Marzipano.ImageUrlSource.fromString(sc.src);

// Create geometry.
        var geometry = new Marzipano.EquirectGeometry([{width: 4000}]);

// Create view.
        var limiter = Marzipano.RectilinearView.limit.traditional(1024, 100 * Math.PI / 180);
        var view = new Marzipano.RectilinearView({yaw: Math.PI}, limiter);

        var scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
        });

        // Create link hotspots.
        sc.linkHotspots.forEach(function (hotspot) {
            var element = createLinkHotspotElement(hotspot);
            scene.hotspotContainer().createHotspot(element, {yaw: hotspot.yaw, pitch: hotspot.pitch});
        });

        // Create info hotspots.
        sc.infoHotspots.forEach(function (hotspot) {
            var element = createInfoHotspotElement(hotspot);
            scene.hotspotContainer().createHotspot(element, {yaw: hotspot.yaw, pitch: hotspot.pitch});
        });

        // add sceneListElements for list
        sceneListElement.insertAdjacentHTML('beforeend', '<li class="mdl-menu__item scene" data-id="' + sc.id + '">' + sc.name + '</li>');
        sceneElements = document.querySelectorAll('#sceneList .scene');

        return {
            data: sc,
            scene: scene,
            view: view
        };
    });

    // Set up autorotate, if enabled.
    var autorotate = Marzipano.autorotate({
        yawSpeed: 0.03,
        targetPitch: 0,
        targetFov: Math.PI / 2
    });

    if (data.settings.autorotateEnabled) {
        autorotateToggleElement.classList.add('enabled');
    }

    // Set handler for autorotate toggle.
    autorotateToggleElement.addEventListener('click', toggleAutorotate);

    // Set up fullscreen mode, if supported.
    if (screenfull.enabled && data.settings.showFullscreen) {
        document.body.classList.add('fullscreen-enabled');
        fullscreenToggleElement.addEventListener('click', toggleFullscreen);
    } else {
        document.body.classList.add('fullscreen-disabled');
    }

    // Set handler for scene switch.
    scenes.forEach(function (scene) {
        var el = document.querySelector('#sceneList .scene[data-id="' + scene.data.id + '"]');
        el.addEventListener('click', function () {
            switchScene(scene);
        });
    });


    function sanitize(s) {
        return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
    }

    function switchScene(scene) {
        stopAutorotate();
        scene.view.setParameters(scene.data.initialViewParameters);
        scene.scene.switchTo();
        startAutorotate();
        updateSceneName(scene);
        updateSceneList(scene);
    }

    function updateSceneName(scene) {
        sceneNameElement.innerHTML = sanitize(scene.data.name);
    }

    function updateSceneList(scene) {
        for (var i = 0; i < sceneElements.length; i++) {
            var el = sceneElements[i];
            el.style.display = el.getAttribute('data-id') === scene.data.id ? 'none' : 'block';
        }
    }

    function startAutorotate() {
        if (!autorotateToggleElement.classList.contains('mdl-button--colored')) {
            return;
        }
        viewer.startMovement(autorotate);
        viewer.setIdleMovement(3000, autorotate);
    }

    function stopAutorotate() {
        viewer.stopMovement();
        viewer.setIdleMovement(Infinity);
    }

    function toggleAutorotate() {
        if (autorotateToggleElement.classList.contains('mdl-button--colored')) {
            autorotateToggleElement.classList.remove('mdl-button--colored');
            stopAutorotate();
        } else {
            autorotateToggleElement.classList.add('mdl-button--colored');
            startAutorotate();
        }
    }

    function toggleFullscreen() {
        screenfull.toggle();
        if (screenfull.isFullscreen) {
            fullscreenToggleElement.classList.remove('mdl-button--colored');
        } else {
            fullscreenToggleElement.classList.add('mdl-button--colored');
        }
    }

    function createLinkHotspotElement(hotspot) {

        // Create wrapper element to hold icon and tooltip.
        var wrapper = document.createElement('div');
        wrapper.classList.add('hotspot');
        wrapper.classList.add('link-hotspot');

        // Create image element.
        var icon = document.createElement('img');
        icon.src = 'img/link.png';
        icon.classList.add('link-hotspot-icon');

        // Set rotation transform.
        var transformProperties = ['-ms-transform', '-webkit-transform', 'transform'];
        for (var i = 0; i < transformProperties.length; i++) {
            var property = transformProperties[i];
            icon.style[property] = 'rotate(' + hotspot.rotation + 'rad)';
        }

        // Add click event handler.
        wrapper.addEventListener('click', function () {
            switchScene(findSceneById(hotspot.target));
        });

        // Prevent touch and scroll events from reaching the parent element.
        // This prevents the view control logic from interfering with the hotspot.
        stopTouchAndScrollEventPropagation(wrapper);

        // Create tooltip element.
        var tooltip = document.createElement('div');
        tooltip.classList.add('hotspot-tooltip');
        tooltip.classList.add('link-hotspot-tooltip');
        tooltip.innerHTML = findSceneDataById(hotspot.target).name;

        wrapper.appendChild(icon);
        wrapper.appendChild(tooltip);

        return wrapper;
    }

    function createInfoHotspotElement(hotspot) {

        // Create wrapper element to hold icon and tooltip.
        var wrapper = document.createElement('div');
        wrapper.classList.add('hotspot');
        wrapper.classList.add('info-hotspot');

        // Create hotspot/tooltip header.
        var header = document.createElement('div');
        header.classList.add('info-hotspot-header');

        // Create image element.
        var iconWrapper = document.createElement('div');
        iconWrapper.classList.add('info-hotspot-icon-wrapper');
        var icon = document.createElement('img');
        icon.src = 'img/info.png';
        icon.classList.add('info-hotspot-icon');
        iconWrapper.appendChild(icon);

        // Create title element.
        var titleWrapper = document.createElement('div');
        titleWrapper.classList.add('info-hotspot-title-wrapper');
        var title = document.createElement('div');
        title.classList.add('info-hotspot-title');
        title.innerHTML = hotspot.title;
        titleWrapper.appendChild(title);

        // Create close element.
        var closeWrapper = document.createElement('div');
        closeWrapper.classList.add('info-hotspot-close-wrapper');
        var closeIcon = document.createElement('img');
        closeIcon.src = 'img/close.png';
        closeIcon.classList.add('info-hotspot-close-icon');
        closeWrapper.appendChild(closeIcon);

        // Construct header element.
        header.appendChild(iconWrapper);
        header.appendChild(titleWrapper);
        header.appendChild(closeWrapper);

        // Create text element.
        var text = document.createElement('div');
        text.classList.add('info-hotspot-text');
        text.innerHTML = hotspot.text;

        // Place header and text into wrapper element.
        wrapper.appendChild(header);
        wrapper.appendChild(text);

        // Create a modal for the hotspot content to appear on mobile mode.
        var modal = document.createElement('div');
        modal.innerHTML = wrapper.innerHTML;
        modal.classList.add('info-hotspot-modal');
        document.body.appendChild(modal);

        var toggle = function () {
            wrapper.classList.toggle('visible');
            modal.classList.toggle('visible');
        };

        // Show content when hotspot is clicked.
        wrapper.querySelector('.info-hotspot-header').addEventListener('click', toggle);

        // Hide content when close icon is clicked.
        modal.querySelector('.info-hotspot-close-wrapper').addEventListener('click', toggle);

        // Prevent touch and scroll events from reaching the parent element.
        // This prevents the view control logic from interfering with the hotspot.
        stopTouchAndScrollEventPropagation(wrapper);

        return wrapper;
    }

    // Prevent touch and scroll events from reaching the parent element.
    function stopTouchAndScrollEventPropagation(element, eventList) {
        var eventList = ['touchstart', 'touchmove', 'touchend', 'touchcancel',
            'wheel', 'mousewheel'];
        for (var i = 0; i < eventList.length; i++) {
            element.addEventListener(eventList[i], function (event) {
                event.stopPropagation();
            });
        }
    }

    function findSceneById(id) {
        for (var i = 0; i < scenes.length; i++) {
            if (scenes[i].data.id === id) {
                return scenes[i];
            }
        }
        return null;
    }

    function findSceneDataById(id) {
        for (var i = 0; i < data.scenes.length; i++) {
            if (data.scenes[i].id === id) {
                return data.scenes[i];
            }
        }
        return null;
    }

    // Display the initial scene.
    switchScene(scenes[0]);

})();
