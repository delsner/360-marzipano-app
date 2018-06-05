var APP_DATA = {
    "scenes": [
        {
            "id": "01-bad",
            "name": "Badezimmer",
            "src": "01-bad.jpg",
            "initialViewParameters": {
                "pitch": 0,
                "yaw": 0,
                "fov": 1.5707963267948966
            },
            "linkHotspots": [
                {
                    "id": "1",
                    "yaw": 2.477661340721733,
                    "pitch": 0.07982691374305517,
                    "target": "02-balkon"
                }
            ],
            "infoHotspots": []
        },
        {
            "id": "02-balkon",
            "name": "Balkon 1",
            "src": "02-balkon.jpg",
            "initialViewParameters": {
                "yaw": 1.5356456397617206,
                "pitch": -0.009135926167793684,
                "fov": 1.421635812135959
            },
            "linkHotspots": [
                {
                    "id": "2",
                    "yaw": 0.4181248592740161,
                    "pitch": -0.06307958576166683,
                    "target": "03-balkon"
                }
            ],
            "infoHotspots": [
                {
                    "id": "1",
                    "yaw": 1.5356456397617206,
                    "pitch": -0.009135926167793684,
                    "title": "Title",
                    "text": "Text"
                }
            ]
        },
        {
            "id": "03-balkon",
            "name": "Balkon 2",
            "src": "03-balkon.jpg",
            "initialViewParameters": {
                "yaw": 1.5356456397617206,
                "pitch": -0.009135926167793684,
                "fov": 1.421635812135959
            },
            "linkHotspots": [
                {
                    "id": "3",
                    "yaw": 0.4181248592740161,
                    "pitch": -0.06307958576166683,
                    "target": "01-bad"
                }
            ],
            "infoHotspots": [
                {
                    "id": "2",
                    "yaw": 1.5356456397617206,
                    "pitch": -0.009135926167793684,
                    "title": "Title",
                    "text": "Text"
                }
            ]
        }
    ],
    "name": "Marzipano Application",
    "settings": {
        "mouseViewMode": "drag",
        "showNavigation": true,
        "showSceneMenu": true,
        "showAutorotate": true,
        "showFullscreen": true,
        "autorotateEnabled": true
    }
};
