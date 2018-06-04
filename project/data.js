var APP_DATA = {
    "scenes": [
        {
            "id": "01-bad",
            "name": "01-bad",
            "initialViewParameters": {
                "pitch": 0,
                "yaw": 0,
                "fov": 1.5707963267948966
            },
            "linkHotspots": [
                {
                    "yaw": 2.477661340721733,
                    "pitch": 0.07982691374305517,
                    "target": "02-balkon"
                }
            ],
            "infoHotspots": []
        },
        {
            "id": "02-balkon",
            "name": "02-balkon",
            "initialViewParameters": {
                "yaw": 1.5356456397617206,
                "pitch": -0.009135926167793684,
                "fov": 1.421635812135959
            },
            "linkHotspots": [
                {
                    "yaw": 0.4181248592740161,
                    "pitch": -0.06307958576166683,
                    "target": "03-balkon"
                }
            ],
            "infoHotspots": [
                {
                    "yaw": 1.5356456397617206,
                    "pitch": -0.009135926167793684,
                    "title": "Title",
                    "text": "Text"
                },
                {
                    "yaw": 1.5356456397617206,
                    "pitch": -0.009135926167793684,
                    "title": "Title",
                    "text": "Text"
                }
            ]
        },
        {
            "id": "03-balkon",
            "name": "03-balkon",
            "initialViewParameters": {
                "yaw": 1.5356456397617206,
                "pitch": -0.009135926167793684,
                "fov": 1.421635812135959
            },
            "linkHotspots": [
                {
                    "yaw": 0.4181248592740161,
                    "pitch": -0.06307958576166683,
                    "rotation": 0,
                    "target": "01-bad"
                }
            ],
            "infoHotspots": [
                {
                    "yaw": 1.5356456397617206,
                    "pitch": -0.009135926167793684,
                    "title": "Title",
                    "text": "Text"
                },
                {
                    "yaw": 1.5356456397617206,
                    "pitch": -0.009135926167793684,
                    "title": "Title",
                    "text": "Text"
                }
            ]
        }
    ],
    "name": "Project Title",
    "settings": {
        "mouseViewMode": "drag",
        "autorotateEnabled": true,
        "fullscreenButton": true,
        "viewControlButtons": false
    }
};
